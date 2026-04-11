import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Heart, MessageCircle, Send, Image as ImageIcon, X, Repeat2,
  MapPin, Briefcase, Users, TrendingUp, ChevronRight, Loader2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";

const Feed = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newPost, setNewPost] = useState("");
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Fetch user profile
  const { data: profile } = useQuery({
    queryKey: ["my-profile-feed", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  // Fetch user role
  const { data: userRole } = useQuery({
    queryKey: ["user-role-feed", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id)
        .single();
      return data?.role || null;
    },
    enabled: !!user,
  });

  // Fetch connections count
  const { data: connectionsCount } = useQuery({
    queryKey: ["connections-count", user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("connections")
        .select("*", { count: "exact", head: true })
        .or(`requester_id.eq.${user!.id},receiver_id.eq.${user!.id}`)
        .eq("status", "accepted");
      return count || 0;
    },
    enabled: !!user,
  });

  // Fetch posts with author info, likes count, and comments count
  const { data: posts, isLoading } = useQuery({
    queryKey: ["feed-posts"],
    queryFn: async () => {
      const { data: postsData } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (!postsData) return [];

      // Collect all user IDs including shared post authors
      const sharedPostIds = postsData.filter(p => p.shared_post_id).map(p => p.shared_post_id!);
      let sharedPosts: typeof postsData = [];
      if (sharedPostIds.length > 0) {
        const { data } = await supabase.from("posts").select("*").in("id", sharedPostIds);
        sharedPosts = data || [];
      }

      const allUserIds = [...new Set([
        ...postsData.map((p) => p.user_id),
        ...sharedPosts.map((p) => p.user_id),
      ])];

      const [{ data: profiles }, { data: roles }, { data: likes }, { data: comments }] = await Promise.all([
        supabase.from("profiles").select("user_id, full_name, avatar_url, location").in("user_id", allUserIds),
        supabase.from("user_roles").select("user_id, role").in("user_id", allUserIds),
        supabase.from("post_likes").select("post_id, user_id"),
        supabase.from("post_comments").select("post_id"),
      ]);

      return postsData.map((post) => {
        const shared = post.shared_post_id ? sharedPosts.find(s => s.id === post.shared_post_id) : null;
        return {
          ...post,
          author: profiles?.find((p) => p.user_id === post.user_id),
          authorRole: roles?.find((r) => r.user_id === post.user_id)?.role,
          likesCount: likes?.filter((l) => l.post_id === post.id).length || 0,
          isLiked: likes?.some((l) => l.post_id === post.id && l.user_id === user?.id) || false,
          commentsCount: comments?.filter((c) => c.post_id === post.id).length || 0,
          sharedPost: shared ? {
            ...shared,
            author: profiles?.find((p) => p.user_id === shared.user_id),
            authorRole: roles?.find((r) => r.user_id === shared.user_id)?.role,
          } : null,
        };
      });
    },
    enabled: !!user,
  });

  // Fetch comments for visible posts
  const { data: allComments } = useQuery({
    queryKey: ["feed-comments", Object.keys(showComments)],
    queryFn: async () => {
      const visiblePostIds = Object.entries(showComments)
        .filter(([, v]) => v)
        .map(([k]) => k);
      if (visiblePostIds.length === 0) return {};

      const { data: commentsData } = await supabase
        .from("post_comments")
        .select("*")
        .in("post_id", visiblePostIds)
        .order("created_at", { ascending: true });

      if (!commentsData) return {};

      const commentUserIds = [...new Set(commentsData.map((c) => c.user_id))];
      const { data: commentProfiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url")
        .in("user_id", commentUserIds);

      const result: Record<string, Array<typeof commentsData[0] & { author?: typeof commentProfiles extends Array<infer T> ? T : never }>> = {};
      for (const c of commentsData) {
        if (!result[c.post_id]) result[c.post_id] = [];
        result[c.post_id].push({
          ...c,
          author: commentProfiles?.find((p) => p.user_id === c.user_id),
        });
      }
      return result;
    },
    enabled: Object.values(showComments).some(Boolean),
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "För stor fil", description: "Max 5MB.", variant: "destructive" });
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  };

  // Create post
  const createPost = useMutation({
    mutationFn: async () => {
      if (!newPost.trim() && !imageFile) return;
      setUploading(true);

      let imageUrl: string | null = null;
      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `${user!.id}/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("post-images").upload(path, imageFile);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("post-images").getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from("posts").insert({
        user_id: user!.id,
        content: newPost.trim() || "📷",
        image_url: imageUrl,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setNewPost("");
      removeImage();
      setUploading(false);
      queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
    },
    onError: () => {
      setUploading(false);
      toast({ title: "Fel", description: "Kunde inte publicera inlägget.", variant: "destructive" });
    },
  });

  // Like/unlike
  const toggleLike = useMutation({
    mutationFn: async ({ postId, isLiked }: { postId: string; isLiked: boolean }) => {
      if (isLiked) {
        await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user!.id);
      } else {
        await supabase.from("post_likes").insert({ post_id: postId, user_id: user!.id });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["feed-posts"] }),
  });

  // Add comment
  const addComment = useMutation({
    mutationFn: async (postId: string) => {
      const text = commentTexts[postId]?.trim();
      if (!text) return;
      const { error } = await supabase.from("post_comments").insert({ post_id: postId, user_id: user!.id, content: text });
      if (error) throw error;
    },
    onSuccess: (_, postId) => {
      setCommentTexts((p) => ({ ...p, [postId]: "" }));
      queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
      queryClient.invalidateQueries({ queryKey: ["feed-comments"] });
    },
  });

  // Share/repost
  const sharePost = useMutation({
    mutationFn: async (postId: string) => {
      const originalPost = posts?.find(p => p.id === postId);
      const originalId = originalPost?.shared_post_id || postId;
      const { data: existing } = await supabase
        .from("posts")
        .select("id")
        .eq("user_id", user!.id)
        .eq("shared_post_id", originalId)
        .maybeSingle();
      if (existing) throw new Error("Du har redan delat detta inlägg");
      const { error } = await supabase.from("posts").insert({
        user_id: user!.id,
        content: "delade ett inlägg",
        shared_post_id: originalId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Delat!", description: "Inlägget har delats i ditt flöde." });
      queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
    },
    onError: (err: any) => {
      toast({ title: "Kunde inte dela", description: err.message, variant: "destructive" });
    },
  });

  const getRoleLabel = (role: string | null) => {
    const map: Record<string, string> = {
      player: "Spelare",
      club: "Klubb",
      coach: "Tränare",
      scout: "Scout",
      physiotherapist: "Fysioterapeut",
      analyst: "Analytiker",
      nutritionist: "Nutritionist",
      mental_coach: "Mental coach",
    };
    return map[role || ""] || "Användare";
  };

  const getProfilePath = () => {
    if (userRole === "club") return "/dashboard";
    if (["physiotherapist", "coach", "analyst", "scout", "nutritionist", "mental_coach"].includes(userRole || ""))
      return "/my-staff-profile";
    return "/my-profile";
  };

  return (
    <Layout>
      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Profile Card */}
          <aside className="lg:col-span-3 space-y-4">
            <Card className="overflow-hidden">
              {/* Banner */}
              <div className="h-16 bg-gradient-to-r from-neon/30 to-electric/20" />
              <div className="px-4 pb-4 -mt-8">
                <Link to={getProfilePath()}>
                  <Avatar className="h-16 w-16 border-4 border-card">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback className="bg-neon text-neon-foreground font-bold text-lg">
                      {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <Link to={getProfilePath()} className="block mt-2">
                  <h3 className="font-semibold text-foreground hover:underline">
                    {profile?.full_name || "Användare"}
                  </h3>
                </Link>
                <p className="text-xs text-muted-foreground">{getRoleLabel(userRole || null)}</p>
                {profile?.location && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {profile.location}
                  </p>
                )}
              </div>
              <Separator />
              <Link to="/connections" className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors">
                <span className="text-xs text-muted-foreground">Kontakter</span>
                <span className="text-xs font-semibold text-neon">{connectionsCount}</span>
              </Link>
            </Card>
          </aside>

          {/* Center - Feed */}
          <main className="lg:col-span-6 space-y-4">
            {/* Create post */}
            <Card className="p-4">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="bg-neon text-neon-foreground font-bold text-sm">
                    {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <Textarea
                  placeholder="Vad vill du dela med dig av?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-[60px] resize-none border-muted bg-muted/30 focus:bg-background"
                />
              </div>
              {/* Image preview */}
              {imagePreview && (
                <div className="relative mt-2 ml-13">
                  <img src={imagePreview} alt="Preview" className="rounded-lg max-h-48 object-cover" />
                  <button
                    onClick={removeImage}
                    className="absolute top-1.5 right-1.5 bg-foreground/80 text-background rounded-full p-1 hover:bg-foreground transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <Separator className="my-3" />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                    <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md px-3 py-2 transition-colors">
                      <ImageIcon className="w-4 h-4 text-neon" />
                      Bild
                    </div>
                  </label>
                </div>
                <Button
                  variant="neon"
                  size="sm"
                  onClick={() => createPost.mutate()}
                  disabled={(!newPost.trim() && !imageFile) || createPost.isPending || uploading}
                  className="btn-glow text-xs"
                >
                  {uploading ? <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> Laddar upp...</> : "Publicera"}
                </Button>
              </div>
            </Card>

            {/* Posts */}
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-4 animate-pulse">
                    <div className="flex gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-muted rounded w-1/3" />
                        <div className="h-3 bg-muted rounded w-1/4" />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="h-3 bg-muted rounded w-full" />
                      <div className="h-3 bg-muted rounded w-2/3" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : posts?.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground text-sm">Inga inlägg ännu. Var först att dela något!</p>
              </Card>
            ) : (
              posts?.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <div className="p-4">
                    {/* Author info */}
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage src={post.author?.avatar_url || ""} />
                        <AvatarFallback className="bg-muted font-semibold text-sm">
                          {post.author?.full_name?.charAt(0)?.toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-foreground">
                          {post.author?.full_name || "Okänd"}
                        </p>
                        <p className="text-xs text-muted-foreground">{getRoleLabel(post.authorRole || null)}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: sv })}
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    {!post.sharedPost && (
                      <p className="mt-3 text-sm text-foreground whitespace-pre-wrap">{post.content}</p>
                    )}
                    {post.image_url && (
                      <img src={post.image_url} alt="" className="mt-3 rounded-lg w-full object-cover max-h-96" />
                    )}

                    {/* Shared/Reposted content */}
                    {post.sharedPost && (
                      <div className="mt-3 border border-border rounded-xl overflow-hidden">
                        <div className="p-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={post.sharedPost.author?.avatar_url || ""} />
                              <AvatarFallback className="text-[10px] bg-muted">
                                {post.sharedPost.author?.full_name?.charAt(0)?.toUpperCase() || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-xs">{post.sharedPost.author?.full_name || "Okänd"}</p>
                              <p className="text-[10px] text-muted-foreground">{getRoleLabel(post.sharedPost.authorRole || null)}</p>
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-foreground whitespace-pre-wrap">{post.sharedPost.content}</p>
                          {post.sharedPost.image_url && (
                            <img src={post.sharedPost.image_url} alt="" className="mt-2 rounded-lg w-full object-cover max-h-64" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stats bar */}
                  {(post.likesCount > 0 || post.commentsCount > 0) && (
                    <div className="px-4 py-1.5 flex items-center justify-between text-xs text-muted-foreground">
                      {post.likesCount > 0 && (
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3 fill-destructive text-destructive" />
                          {post.likesCount}
                        </span>
                      )}
                      {post.commentsCount > 0 && (
                        <button
                          onClick={() => setShowComments((p) => ({ ...p, [post.id]: !p[post.id] }))}
                          className="hover:underline"
                        >
                          {post.commentsCount} kommentarer
                        </button>
                      )}
                    </div>
                  )}

                  <Separator />

                  {/* Action buttons */}
                  <div className="flex items-center justify-around px-2 py-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLike.mutate({ postId: post.id, isLiked: post.isLiked })}
                      className={`flex-1 gap-1.5 text-xs ${post.isLiked ? "text-destructive" : "text-muted-foreground"}`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? "fill-destructive" : ""}`} />
                      Gilla
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowComments((p) => ({ ...p, [post.id]: !p[post.id] }))}
                      className="flex-1 gap-1.5 text-xs text-muted-foreground"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Kommentera
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => sharePost.mutate(post.id)}
                      disabled={sharePost.isPending}
                      className="flex-1 gap-1.5 text-xs text-muted-foreground"
                    >
                      <Repeat2 className="w-4 h-4" />
                      Dela
                    </Button>
                  </div>

                  {/* Comments section */}
                  {showComments[post.id] && (
                    <div className="px-4 pb-3 space-y-3">
                      <Separator />
                      {allComments?.[post.id]?.map((comment) => (
                        <div key={comment.id} className="flex gap-2">
                          <Avatar className="h-7 w-7 shrink-0">
                            <AvatarImage src={comment.author?.avatar_url || ""} />
                            <AvatarFallback className="text-[10px] bg-muted">
                              {comment.author?.full_name?.charAt(0)?.toUpperCase() || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-muted/50 rounded-lg px-3 py-1.5 flex-1">
                            <p className="font-semibold text-xs">{comment.author?.full_name || "Okänd"}</p>
                            <p className="text-xs text-foreground">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Avatar className="h-7 w-7 shrink-0">
                          <AvatarImage src={profile?.avatar_url || ""} />
                          <AvatarFallback className="text-[10px] bg-neon text-neon-foreground">
                            {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Skriv en kommentar..."
                            value={commentTexts[post.id] || ""}
                            onChange={(e) => setCommentTexts((p) => ({ ...p, [post.id]: e.target.value }))}
                            onKeyDown={(e) => e.key === "Enter" && addComment.mutate(post.id)}
                            className="flex-1 bg-muted/50 rounded-full px-3 py-1.5 text-xs border-none outline-none focus:ring-1 focus:ring-neon/50"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 shrink-0"
                            onClick={() => addComment.mutate(post.id)}
                            disabled={!commentTexts[post.id]?.trim()}
                          >
                            <Send className="w-3.5 h-3.5 text-neon" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))
            )}
          </main>

          {/* Right Sidebar */}
          <aside className="lg:col-span-3 space-y-4 hidden lg:block">
            <Card className="p-4">
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-neon" />
                Snabblänkar
              </h3>
              <div className="space-y-1">
                {[
                  { path: "/highlights", label: "Highlights", icon: "🎬" },
                  { path: "/trials", label: "Provträningar", icon: "⚽" },
                  { path: "/rankings", label: "Topplista", icon: "🏆" },
                  { path: "/connections", label: "Mitt nätverk", icon: "🤝" },
                ].map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center justify-between py-2 px-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span>{link.icon}</span>
                      {link.label}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                ))}
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default Feed;
