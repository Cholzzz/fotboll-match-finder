import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Search, ArrowLeft, MoreVertical } from "lucide-react";

const mockConversations = [
  {
    id: "1",
    name: "Djurgårdens IF",
    lastMessage: "Tack för din anmälan till provträningen!",
    time: "10:32",
    unread: 2,
    isClub: true,
  },
  {
    id: "2",
    name: "Erik Lindqvist",
    lastMessage: "Ja, jag är intresserad av att komma på provträning.",
    time: "Igår",
    unread: 0,
    isClub: false,
  },
  {
    id: "3",
    name: "Hammarby IF",
    lastMessage: "Vi skulle gärna vilja se dig på träning nästa vecka.",
    time: "Igår",
    unread: 1,
    isClub: true,
  },
  {
    id: "4",
    name: "Marcus Eriksson",
    lastMessage: "Tack för informationen!",
    time: "Mån",
    unread: 0,
    isClub: false,
  },
];

const mockMessages = [
  {
    id: "1",
    sender: "them",
    text: "Hej! Vi har sett din profil och tycker att du verkar vara en intressant spelare.",
    time: "10:15",
  },
  {
    id: "2",
    sender: "them",
    text: "Vi skulle gärna vilja bjuda in dig till en provträning med vårt A-lag.",
    time: "10:16",
  },
  {
    id: "3",
    sender: "me",
    text: "Hej! Tack så mycket, det låter jättespännande!",
    time: "10:25",
  },
  {
    id: "4",
    sender: "me",
    text: "När skulle provträningen vara?",
    time: "10:25",
  },
  {
    id: "5",
    sender: "them",
    text: "Vi har en provträning den 15 januari kl 18:00 på Stockholms Stadion. Passar det?",
    time: "10:30",
  },
  {
    id: "6",
    sender: "them",
    text: "Tack för din anmälan till provträningen!",
    time: "10:32",
  },
];

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedConvo = mockConversations.find((c) => c.id === selectedConversation);

  const filteredConversations = mockConversations.filter((convo) =>
    convo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setMessage("");
    }
  };

  return (
    <Layout hideFooter>
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Conversations List */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-border flex flex-col bg-background ${
            selectedConversation ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-border">
            <h1 className="font-display text-xl font-bold text-foreground mb-4">Meddelanden</h1>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Sök konversationer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Conversation List */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredConversations.map((convo) => (
                <button
                  key={convo.id}
                  onClick={() => setSelectedConversation(convo.id)}
                  className={`w-full p-3 rounded-xl text-left transition-colors flex items-start gap-3 ${
                    selectedConversation === convo.id
                      ? "bg-muted"
                      : "hover:bg-muted/50"
                  }`}
                >
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-xl bg-foreground flex items-center justify-center flex-shrink-0">
                    <span className="font-display font-semibold text-background text-sm">
                      {convo.name.charAt(0)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-foreground truncate text-sm">{convo.name}</span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{convo.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-0.5">
                      {convo.lastMessage}
                    </p>
                  </div>

                  {/* Unread badge */}
                  {convo.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-neon text-neon-foreground text-xs flex items-center justify-center flex-shrink-0 font-medium">
                      {convo.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div
          className={`flex-1 flex flex-col bg-muted/30 ${
            selectedConversation ? "flex" : "hidden md:flex"
          }`}
        >
          {selectedConvo ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border bg-background flex items-center gap-3">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden p-2 -ml-2 rounded-lg hover:bg-muted"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
                  <span className="font-display font-semibold text-background text-sm">
                    {selectedConvo.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-foreground">{selectedConvo.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedConvo.isClub ? "Klubb" : "Spelare"}
                  </p>
                </div>
                <button className="p-2 rounded-lg hover:bg-muted">
                  <MoreVertical className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4 max-w-2xl mx-auto">
                  {mockMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                          msg.sender === "me"
                            ? "bg-foreground text-background rounded-br-md"
                            : "bg-background text-foreground rounded-bl-md border border-border"
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <span
                          className={`text-xs mt-1 block ${
                            msg.sender === "me" ? "text-background/70" : "text-muted-foreground"
                          }`}
                        >
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-border bg-background">
                <form onSubmit={handleSendMessage} className="flex gap-2 max-w-2xl mx-auto">
                  <Input
                    type="text"
                    placeholder="Skriv ett meddelande..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" variant="neon">
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
                <h3 className="font-display font-semibold text-foreground mb-1">
                  Dina meddelanden
                </h3>
                <p className="text-sm text-muted-foreground">
                  Välj en konversation för att börja chatta
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Messages;