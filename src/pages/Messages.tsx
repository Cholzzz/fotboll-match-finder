import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, Search, ArrowLeft, MoreVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Conversation {
  id: string;
  otherUserId: string;
  otherUserName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

const Messages = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const toUserId = searchParams.get("to");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
  const { data: conversations = [], isLoading: loadingConversations } = useQuery({
    queryKey: ["conversations", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: participations } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("user_id", user.id);

      if (!participations?.length) return [];

      const convoIds = participations.map((p: any) => p.conversation_id);

      // Get other participants
      const { data: allParticipants } = await supabase
        .from("conversation_participants")
        .select("conversation_id, user_id")
        .in("conversation_id", convoIds)
        .neq("user_id", user.id);

      const otherUserIds = [...new Set((allParticipants || []).map((p: any) => p.user_id))];

      // Get profiles for other users
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", otherUserIds);

      const profileMap: Record<string, string> = {};
      (profiles || []).forEach((p: any) => { profileMap[p.user_id] = p.full_name; });

      // Get last message per conversation
      const convos: Conversation[] = [];
      for (const convoId of convoIds) {
        const otherPart = (allParticipants || []).find((p: any) => p.conversation_id === convoId);
        if (!otherPart) continue;

        const { data: lastMsg } = await supabase
          .from("messages")
          .select("content, created_at")
          .eq("conversation_id", convoId)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        const { count } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("conversation_id", convoId)
          .neq("sender_id", user.id)
          .is("read_at", null);

        convos.push({
          id: convoId,
          otherUserId: otherPart.user_id,
          otherUserName: profileMap[otherPart.user_id] || "Okänd",
          lastMessage: lastMsg?.content || "",
          lastMessageTime: lastMsg?.created_at || "",
          unreadCount: count || 0,
        });
      }

      return convos.sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
    },
    enabled: !!user,
  });

  // Handle deep link ?to=userId - find or create conversation
  useEffect(() => {
    if (!toUserId || !user || loadingConversations) return;

    const existingConvo = conversations.find((c) => c.otherUserId === toUserId);
    if (existingConvo) {
      setSelectedConversationId(existingConvo.id);
      return;
    }

    // Create new conversation
    const createConvo = async () => {
      const { data: convo } = await supabase
        .from("conversations")
        .insert({})
        .select()
        .single();

      if (!convo) return;

      await supabase.from("conversation_participants").insert([
        { conversation_id: convo.id, user_id: user.id },
        { conversation_id: convo.id, user_id: toUserId },
      ]);

      setSelectedConversationId(convo.id);
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    };
    createConvo();
  }, [toUserId, user, conversations, loadingConversations]);

  // Fetch messages for selected conversation
  const { data: messages = [] } = useQuery({
    queryKey: ["messages", selectedConversationId],
    queryFn: async () => {
      if (!selectedConversationId) return [];
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", selectedConversationId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data || []) as Message[];
    },
    enabled: !!selectedConversationId,
    refetchInterval: 3000,
  });

  // Realtime subscription for new messages
  useEffect(() => {
    if (!selectedConversationId) return;

    const channel = supabase
      .channel(`messages-${selectedConversationId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${selectedConversationId}`,
      }, () => {
        queryClient.invalidateQueries({ queryKey: ["messages", selectedConversationId] });
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedConversationId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      if (!user || !selectedConversationId) return;
      const { error } = await supabase.from("messages").insert({
        conversation_id: selectedConversationId,
        sender_id: user.id,
        content,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", selectedConversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage.mutate(message.trim());
      setMessage("");
    }
  };

  const selectedConvo = conversations.find((c) => c.id === selectedConversationId);
  const filteredConversations = conversations.filter((c) =>
    c.otherUserName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 86400000) return date.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });
    if (diff < 172800000) return "Igår";
    return date.toLocaleDateString("sv-SE", { day: "numeric", month: "short" });
  };

  if (!user) {
    return (
      <Layout hideFooter>
        <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
          <p className="text-muted-foreground">Logga in för att se dina meddelanden</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideFooter>
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Conversations List */}
        <div className={`w-full md:w-80 lg:w-96 border-r border-border flex flex-col bg-background ${selectedConversationId ? "hidden md:flex" : "flex"}`}>
          <div className="p-4 border-b border-border">
            <h1 className="font-display text-xl font-bold text-foreground mb-4">Meddelanden</h1>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="text" placeholder="Sök konversationer..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2">
              {loadingConversations ? (
                [...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 mb-2 rounded-xl" />)
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">Inga konversationer ännu</p>
                </div>
              ) : (
                filteredConversations.map((convo) => (
                  <button
                    key={convo.id}
                    onClick={() => setSelectedConversationId(convo.id)}
                    className={`w-full p-3 rounded-xl text-left transition-colors flex items-start gap-3 ${selectedConversationId === convo.id ? "bg-muted" : "hover:bg-muted/50"}`}
                  >
                    <div className="w-11 h-11 rounded-xl bg-foreground flex items-center justify-center flex-shrink-0">
                      <span className="font-display font-semibold text-background text-sm">{convo.otherUserName.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-foreground truncate text-sm">{convo.otherUserName}</span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{formatTime(convo.lastMessageTime)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-0.5">{convo.lastMessage}</p>
                    </div>
                    {convo.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-neon text-neon-foreground text-xs flex items-center justify-center flex-shrink-0 font-medium">{convo.unreadCount}</span>
                    )}
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col bg-muted/30 ${selectedConversationId ? "flex" : "hidden md:flex"}`}>
          {selectedConvo ? (
            <>
              <div className="p-4 border-b border-border bg-background flex items-center gap-3">
                <button onClick={() => setSelectedConversationId(null)} className="md:hidden p-2 -ml-2 rounded-lg hover:bg-muted">
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
                  <span className="font-display font-semibold text-background text-sm">{selectedConvo.otherUserName.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-foreground">{selectedConvo.otherUserName}</h2>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4 max-w-2xl mx-auto">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender_id === user.id ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${msg.sender_id === user.id ? "bg-foreground text-background rounded-br-md" : "bg-background text-foreground rounded-bl-md border border-border"}`}>
                        <p className="text-sm">{msg.content}</p>
                        <span className={`text-xs mt-1 block ${msg.sender_id === user.id ? "text-background/70" : "text-muted-foreground"}`}>
                          {formatTime(msg.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-border bg-background">
                <form onSubmit={handleSendMessage} className="flex gap-2 max-w-2xl mx-auto">
                  <Input type="text" placeholder="Skriv ett meddelande..." value={message} onChange={(e) => setMessage(e.target.value)} className="flex-1" />
                  <Button type="submit" size="icon" variant="neon" disabled={sendMessage.isPending}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
                  <Send className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1">Dina meddelanden</h3>
                <p className="text-sm text-muted-foreground">Välj en konversation för att börja chatta</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
