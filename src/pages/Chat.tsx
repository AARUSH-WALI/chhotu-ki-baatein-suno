import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Settings, LogOut, Sun, Moon, Menu, Send, Mic, MicOff, Sparkles, ChefHat, Coffee } from "lucide-react";
import cooksyLogo from "@/assets/cooksy-logo.png";
import { AppSidebar } from "@/components/AppSidebar";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const Chat = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI cooking assistant. I can help you with recipes, cooking tips, meal planning, and answer any culinary questions you might have. What would you like to cook today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const handleLogout = () => {
    navigate("/");
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');

        setInputMessage(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const startRecording = () => {
    if (recognitionRef.current) {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      setIsRecording(false);
      recognitionRef.current.stop();
    }
  };

  const simulateAIResponse = (userMessage: string): string => {
    const responses = [
      "I'd be happy to help you with that recipe! Here are some suggestions based on your request...",
      "That sounds delicious! Let me break down the cooking process step by step for you.",
      "Great choice! Here's what I recommend for the perfect flavor combination...",
      "I can definitely help you with that. Here are some tips to make it even better...",
      "That's an interesting cooking question! Based on culinary science, here's what I suggest...",
    ];
    
    if (userMessage.toLowerCase().includes("recipe")) {
      return "I'd love to help you find the perfect recipe! What type of cuisine or ingredients are you interested in? I can suggest something delicious based on your preferences.";
    }
    
    if (userMessage.toLowerCase().includes("ingredient")) {
      return "Great question about ingredients! The key is understanding how different ingredients work together. What specific ingredients are you working with?";
    }
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: simulateAIResponse(inputMessage),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedPrompts = [
    "Give me a quick dinner recipe",
    "How do I make perfect pasta?",
    "Suggest a healthy breakfast",
    "What can I cook with chicken?",
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gradient-warm">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-background/95 backdrop-blur-md border-b border-border/50">
          {/* Left Section with Sidebar Toggle and Logo */}
          <div className="flex items-center space-x-4">
            <SidebarTrigger className="hover:bg-accent/50 hover:text-primary transition-all duration-200 p-2 rounded-md">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <div className="flex items-center space-x-3">
              <img 
                src={cooksyLogo} 
                alt="Cooksy Logo" 
                className="h-10 w-10 rounded-lg shadow-card"
              />
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-foreground bg-gradient-hero bg-clip-text text-transparent">
                  Cooksy AI
                </h1>
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              </div>
            </div>
          </div>

          {/* Right Section - Account */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <Switch 
                checked={isDarkMode}
                onCheckedChange={toggleTheme}
              />
              <Moon className="h-4 w-4 text-muted-foreground" />
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:shadow-glow transition-all duration-300">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback className="bg-gradient-hero text-primary-foreground font-semibold">
                      JD
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background/95 backdrop-blur-md border-border/50 shadow-glow" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">john.doe@gmail.com</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Welcome back!
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-accent/50">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="hover:bg-accent/50 text-destructive focus:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Layout with Sidebar */}
        <div className="flex w-full">
          <AppSidebar />
          
          {/* Chat Interface */}
          <main className="flex-1 pt-20 flex flex-col h-screen">
            <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4">
              
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto space-y-6 py-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? "justify-end" : "justify-start"} animate-fade-in`}
                  >
                    <div className={`flex items-start space-x-3 max-w-3xl ${message.isUser ? "flex-row-reverse space-x-reverse" : ""}`}>
                      <Avatar className="h-8 w-8 mt-1">
                        {message.isUser ? (
                          <AvatarFallback className="bg-gradient-hero text-primary-foreground text-sm font-semibold">
                            JD
                          </AvatarFallback>
                        ) : (
                          <AvatarFallback className="bg-gradient-accent text-accent-foreground">
                            <ChefHat className="h-4 w-4" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <Card className={`${
                        message.isUser 
                          ? "bg-gradient-hero text-primary-foreground border-primary/20" 
                          : "bg-background/80 backdrop-blur-md border-border/30"
                      } shadow-card hover:shadow-glow transition-all duration-300`}>
                        <CardContent className="p-4">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                          <p className={`text-xs mt-2 ${
                            message.isUser ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="flex items-start space-x-3 max-w-3xl">
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className="bg-gradient-accent text-accent-foreground">
                          <ChefHat className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <Card className="bg-background/80 backdrop-blur-md border-border/30 shadow-card">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span className="text-sm text-muted-foreground">AI is thinking...</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Prompts (only show when no messages or just welcome message) */}
              {messages.length <= 1 && (
                <div className="py-4">
                  <p className="text-center text-muted-foreground mb-4 text-sm">Try asking me about:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {suggestedPrompts.map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="text-left justify-start h-auto p-4 border-border/30 hover:bg-accent/30 hover:border-primary/30 transition-all duration-300"
                        onClick={() => setInputMessage(prompt)}
                      >
                        <Coffee className="h-4 w-4 mr-3 text-primary" />
                        <span className="text-sm">{prompt}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="border-t border-border/30 bg-background/50 backdrop-blur-md p-4">
                <div className="flex items-end space-x-3 max-w-4xl mx-auto">
                  <div className="flex-1 relative">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about cooking, recipes, or food..."
                      className="pr-12 min-h-[48px] bg-background/80 border-border/30 focus:border-primary/50 focus:ring-primary/20 resize-none rounded-xl"
                      disabled={isLoading}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
                        isRecording ? "text-destructive hover:text-destructive" : "text-muted-foreground hover:text-primary"
                      }`}
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={isLoading}
                    >
                      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="min-h-[48px] px-6 bg-gradient-hero hover:shadow-glow transition-all duration-300"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                {isRecording && (
                  <div className="text-center mt-2">
                    <span className="text-sm text-destructive animate-pulse">🎤 Recording... Speak now</span>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Chat;