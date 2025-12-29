import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Loader2, 
  LogOut, 
  Mail, 
  RefreshCw, 
  Trash2,
  Inbox,
  ArrowLeft,
  MessageCircle,
  Bot,
  User as UserIcon,
  Users,
  Shield,
  ShieldCheck
} from "lucide-react";
import { format } from "date-fns";
import { User } from "@supabase/supabase-js";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  created_at: string;
}

interface ChatConversation {
  id: string;
  created_at: string;
  updated_at: string;
  messages: ChatMessage[];
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

interface UserWithRole {
  user_id: string;
  email: string;
  role: "admin" | "user" | null;
  role_id: string | null;
  created_at: string | null;
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [fetching, setFetching] = useState(false);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session) {
          navigate("/auth");
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchSubmissions();
      fetchConversations();
      fetchUsers();
    }
  }, [user]);

  const fetchSubmissions = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching submissions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setFetching(false);
    }
  };

  const fetchConversations = async () => {
    try {
      const { data: convData, error: convError } = await supabase
        .from("chat_conversations")
        .select("*")
        .order("updated_at", { ascending: false });

      if (convError) throw convError;

      // Fetch messages for each conversation
      const conversationsWithMessages: ChatConversation[] = await Promise.all(
        (convData || []).map(async (conv) => {
          const { data: messages } = await supabase
            .from("chat_messages")
            .select("*")
            .eq("conversation_id", conv.id)
            .order("created_at", { ascending: true });

          return {
            ...conv,
            messages: (messages || []).map((m) => ({
              ...m,
              role: m.role as "user" | "assistant",
            })),
          };
        })
      );

      setConversations(conversationsWithMessages);
    } catch (error: any) {
      console.error("Error fetching conversations:", error.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.rpc("get_users_with_roles");
      if (error) throw error;
      setUsers((data as UserWithRole[]) || []);
    } catch (error: any) {
      console.error("Error fetching users:", error.message);
    }
  };

  const handleRoleChange = async (userId: string, newRole: "admin" | "user" | "none") => {
    setUpdatingRole(userId);
    try {
      // Find existing role for this user
      const existingUser = users.find(u => u.user_id === userId);
      
      // If they have an existing role, remove it first
      if (existingUser?.role_id) {
        const { error: deleteError } = await supabase
          .from("user_roles")
          .delete()
          .eq("id", existingUser.role_id);
        if (deleteError) throw deleteError;
      }
      
      // If new role is not "none", add the new role
      if (newRole !== "none") {
        const { error: insertError } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role: newRole });
        if (insertError) throw insertError;
      }
      
      toast({ title: "Role updated successfully" });
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error updating role",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdatingRole(null);
    }
  };

const handleDelete = async (id: string) => {
  try {
    const { error } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", id);

    if (error) throw error;
    
    setSubmissions(submissions.filter((s) => s.id !== id));
    toast({ title: "Submission deleted" });
  } catch (error: any) {
    toast({
      title: "Error deleting submission",
      description: error.message,
      variant: "destructive",
    });
  }
};

const handleDeleteConversation = async (id: string) => {
  try {
    const { error } = await supabase
      .from("chat_conversations")
      .delete()
      .eq("id", id);

    if (error) throw error;
    
    setConversations(conversations.filter((c) => c.id !== id));
    if (selectedConversation?.id === id) {
      setSelectedConversation(null);
    }
    toast({ title: "Conversation deleted" });
  } catch (error: any) {
    toast({
      title: "Error deleting conversation",
      description: error.message,
      variant: "destructive",
    });
  }
};

const handleSignOut = async () => {
  await supabase.auth.signOut();
  navigate("/auth");
};

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

return (
  <div className="min-h-screen bg-background">
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{user?.email}</span>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>

    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Tabs defaultValue="contacts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="contacts" className="gap-2">
            <Mail className="h-4 w-4" />
            Contact Submissions
          </TabsTrigger>
          <TabsTrigger value="chats" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            Chat Conversations
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Contact Submissions</h2>
              <p className="text-sm text-muted-foreground">
                {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Button variant="outline" onClick={fetchSubmissions} disabled={fetching}>
              <RefreshCw className={`mr-2 h-4 w-4 ${fetching ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
              <Inbox className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium text-foreground">No submissions yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Contact form submissions will appear here.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead className="max-w-[300px]">Message</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {format(new Date(submission.created_at), "MMM d, yyyy")}
                        <br />
                        <span className="text-xs">
                          {format(new Date(submission.created_at), "h:mm a")}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{submission.name}</TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${submission.email}`}
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          <Mail className="h-3 w-3" />
                          {submission.email}
                        </a>
                      </TableCell>
                      <TableCell>
                        {submission.company ? (
                          submission.company
                        ) : (
                          <Badge variant="secondary">N/A</Badge>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[300px]">
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {submission.message}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(submission.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="chats" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Chat Conversations</h2>
              <p className="text-sm text-muted-foreground">
                {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Button variant="outline" onClick={fetchConversations} disabled={fetching}>
              <RefreshCw className={`mr-2 h-4 w-4 ${fetching ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
              <MessageCircle className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium text-foreground">No conversations yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Chat conversations will appear here when visitors use the chatbot.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Conversation list */}
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="border-b border-border bg-muted/50 px-4 py-3">
                  <h3 className="font-medium text-foreground">Conversations</h3>
                </div>
                <ScrollArea className="h-[500px]">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={`cursor-pointer border-b border-border p-4 transition-colors hover:bg-muted/50 ${
                        selectedConversation?.id === conv.id ? "bg-muted" : ""
                      }`}
                      onClick={() => setSelectedConversation(conv)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {conv.messages[0]?.content.slice(0, 50) || "Empty conversation"}
                            {(conv.messages[0]?.content.length || 0) > 50 ? "..." : ""}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {format(new Date(conv.updated_at), "MMM d, yyyy h:mm a")}
                          </p>
                          <Badge variant="secondary" className="mt-2">
                            {conv.messages.length} message{conv.messages.length !== 1 ? "s" : ""}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteConversation(conv.id);
                          }}
                          className="text-destructive hover:text-destructive ml-2 flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </div>

              {/* Conversation detail */}
              <div className="lg:col-span-2 rounded-lg border border-border bg-card overflow-hidden">
                <div className="border-b border-border bg-muted/50 px-4 py-3">
                  <h3 className="font-medium text-foreground">
                    {selectedConversation ? "Conversation Details" : "Select a conversation"}
                  </h3>
                </div>
                {selectedConversation ? (
                  <ScrollArea className="h-[500px] p-4">
                    <div className="space-y-4">
                      {selectedConversation.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                        >
                          <div
                            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                              msg.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {msg.role === "user" ? (
                              <UserIcon className="h-4 w-4" />
                            ) : (
                              <Bot className="h-4 w-4" />
                            )}
                          </div>
                          <div
                            className={`rounded-lg px-3 py-2 text-sm max-w-[80%] ${
                              msg.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground"
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                            <p className="mt-1 text-xs opacity-70">
                              {format(new Date(msg.created_at), "h:mm a")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex h-[500px] items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                      Click on a conversation to view details
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">User Management</h2>
              <p className="text-sm text-muted-foreground">
                Assign roles to control admin access
              </p>
            </div>
            <Button variant="outline" onClick={fetchUsers} disabled={fetching}>
              <RefreshCw className={`mr-2 h-4 w-4 ${fetching ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {users.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
              <Users className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium text-foreground">No users found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Users will appear here after they sign up.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead>Role Assigned</TableHead>
                    <TableHead className="w-[200px]">Change Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.user_id}>
                      <TableCell className="font-medium">{u.email}</TableCell>
                      <TableCell>
                        {u.role === "admin" ? (
                          <Badge className="bg-primary/20 text-primary border-primary/30">
                            <ShieldCheck className="mr-1 h-3 w-3" />
                            Admin
                          </Badge>
                        ) : u.role === "user" ? (
                          <Badge variant="secondary">
                            <UserIcon className="mr-1 h-3 w-3" />
                            User
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            No Role
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {u.created_at
                          ? format(new Date(u.created_at), "MMM d, yyyy")
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={u.role || "none"}
                          onValueChange={(value) =>
                            handleRoleChange(u.user_id, value as "admin" | "user" | "none")
                          }
                          disabled={updatingRole === u.user_id}
                        >
                          <SelectTrigger className="w-[140px]">
                            {updatingRole === u.user_id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <SelectValue />
                            )}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No Role</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  </div>
);
}
