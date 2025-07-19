import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Settings, LogOut, Sun, Moon, Menu, Send, Mic, MicOff, Sparkles, ChefHat, Coffee, Volume2, VolumeX } from "lucide-react";
import cooksyLogo from "@/assets/cooksy-logo.png";
import { AppSidebar } from "@/components/AppSidebar";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const Chat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm Cooksy, your AI cooking assistant. I can help you with recipes, cooking tips, meal planning, and answer any culinary questions you might have. What would you like to cook today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isListeningForWakeWord, setIsListeningForWakeWord] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentRecipeStep, setCurrentRecipeStep] = useState(0);
  const [isInRecipeMode, setIsInRecipeMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const wakeWordRecognitionRef = useRef<any>(null);
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const conversationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const ELEVENLABS_API_KEY = 'sk_a122ad6a61bc931bcd2c6852f464e479be87d7c88cb31d9f';
  const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Sarah voice

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

  const isCookingRelated = (message: string): boolean => {
    const cookingKeywords = [
      'recipe', 'cook', 'cooking', 'kitchen', 'ingredient', 'food', 'dish', 'meal',
      'bake', 'baking', 'fry', 'boil', 'roast', 'grill', 'steam', 'sauté',
      'spice', 'seasoning', 'flavor', 'taste', 'chef', 'cuisine', 'menu',
      'breakfast', 'lunch', 'dinner', 'snack', 'appetizer', 'dessert',
      'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'protein', 'carbs',
      'nutrition', 'calories', 'healthy', 'diet', 'eat', 'eating', 'prepare'
    ];
    
    return cookingKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
  };

  const speakText = async (text: string) => {
    try {
      setIsSpeaking(true);
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        
        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          
          // Add conversation delay and then listen for next input
          if (isVoiceMode) {
            conversationTimeoutRef.current = setTimeout(() => {
              if (!isRecording && isVoiceMode && !isSpeaking) {
                setIsRecording(true);
                if (recognitionRef.current) {
                  recognitionRef.current.start();
                }
              }
            }, 2500);
          }
        };
        
        await audio.play();
      } else {
        throw new Error('Failed to generate speech');
      }
    } catch (error) {
      console.error('Error generating speech:', error);
      setIsSpeaking(false);
      toast({
        title: "Voice Error",
        description: "Failed to generate voice response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
    }
  };

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      
      // Main speech recognition
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');

        // Clear existing timeout
        if (speechTimeoutRef.current) {
          clearTimeout(speechTimeoutRef.current);
        }

        // Set timeout to stop recording after 2-3 seconds of silence
        speechTimeoutRef.current = setTimeout(() => {
          if (recognitionRef.current && isRecording) {
            recognitionRef.current.stop();
          }
        }, 2500);

        setInputMessage(transcript);
        
        if (event.results[event.results.length - 1].isFinal) {
          setIsRecording(false);
          if (isVoiceMode && transcript.trim()) {
            handleSendMessage(transcript.trim());
          }
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        if (speechTimeoutRef.current) {
          clearTimeout(speechTimeoutRef.current);
        }
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        if (speechTimeoutRef.current) {
          clearTimeout(speechTimeoutRef.current);
        }
      };

      // Wake word recognition
      wakeWordRecognitionRef.current = new SpeechRecognition();
      wakeWordRecognitionRef.current.continuous = true;
      wakeWordRecognitionRef.current.interimResults = false;
      wakeWordRecognitionRef.current.lang = 'en-US';

      wakeWordRecognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        console.log('Wake word listening:', transcript);
        
        if (transcript.includes('cooksy') || transcript.includes('cookie')) {
          console.log('Wake word detected!');
          if (isSpeaking) {
            stopSpeaking();
          }
          setIsRecording(true);
          if (recognitionRef.current) {
            recognitionRef.current.start();
          }
          toast({
            title: "Wake word detected!",
            description: "I'm listening... How can I help you cook today?",
          });
        }
      };

      wakeWordRecognitionRef.current.onerror = (event: any) => {
        console.error('Wake word recognition error:', event.error);
        if (isListeningForWakeWord) {
          setTimeout(() => {
            if (wakeWordRecognitionRef.current && isListeningForWakeWord) {
              try {
                wakeWordRecognitionRef.current.start();
              } catch (error) {
                console.error('Error restarting wake word recognition:', error);
              }
            }
          }, 1000);
        }
      };

      wakeWordRecognitionRef.current.onend = () => {
        if (isListeningForWakeWord) {
          setTimeout(() => {
            if (wakeWordRecognitionRef.current && isListeningForWakeWord) {
              try {
                wakeWordRecognitionRef.current.start();
              } catch (error) {
                console.error('Error restarting wake word recognition:', error);
              }
            }
          }, 100);
        }
      };
    }

    return () => {
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
      if (conversationTimeoutRef.current) {
        clearTimeout(conversationTimeoutRef.current);
      }
    };
  }, [isRecording, isVoiceMode, isListeningForWakeWord, isSpeaking]);

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      setIsRecording(false);
      recognitionRef.current.stop();
    }
  };

  const startWakeWordListening = () => {
    if (wakeWordRecognitionRef.current && !isListeningForWakeWord) {
      setIsListeningForWakeWord(true);
      try {
        wakeWordRecognitionRef.current.start();
        toast({
          title: "Wake word activated",
          description: "Say 'Cooksy' to start voice conversation",
        });
      } catch (error) {
        console.error('Error starting wake word recognition:', error);
        setIsListeningForWakeWord(false);
      }
    }
  };

  const stopWakeWordListening = () => {
    if (wakeWordRecognitionRef.current && isListeningForWakeWord) {
      setIsListeningForWakeWord(false);
      try {
        wakeWordRecognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping wake word recognition:', error);
      }
    }
  };

  const toggleVoiceMode = () => {
    if (isVoiceMode) {
      setIsVoiceMode(false);
      stopWakeWordListening();
      if (isSpeaking) {
        stopSpeaking();
      }
      if (isRecording) {
        stopRecording();
      }
      toast({
        title: "Voice mode disabled",
        description: "Voice conversation mode is now off",
      });
    } else {
      setIsVoiceMode(true);
      startWakeWordListening();
    }
  };

  const getGeminiResponse = async (userMessage: string): Promise<string> => {
    try {
      // Check if the message is cooking-related
      if (!isCookingRelated(userMessage)) {
        return "I'm Cooksy, your cooking assistant! I'm here to help you with recipes, cooking techniques, meal planning, and kitchen tips. Could you ask me something related to cooking or food?";
      }

      // Build conversation context from recent messages
      const recentMessages = messages.slice(-6); // Last 6 messages for context
      const conversationContext = recentMessages
        .map(msg => `${msg.isUser ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');

      const enhancedPrompt = `You are Cooksy AI, an expert culinary assistant and professional chef with extensive knowledge in:

🍳 COOKING EXPERTISE:
- International cuisines and traditional recipes
- Advanced cooking techniques and food science
- Ingredient substitutions and dietary adaptations
- Kitchen equipment recommendations and usage
- Food safety and proper storage methods
- Meal planning and nutrition optimization
- Baking science and pastry techniques
- Wine pairing and beverage recommendations

🎯 RESPONSE STYLE:
- Provide step-by-step instructions with precise measurements
- Include cooking times, temperatures, and techniques
- Suggest ingredient alternatives for dietary restrictions
- Offer helpful tips and pro chef secrets
- Be encouraging and enthusiastic about cooking
- Format recipes clearly with ingredients and instructions
- Include nutritional benefits when relevant
${isVoiceMode ? `- Keep responses conversational and suitable for voice interaction
- For step-by-step recipes, number each step clearly and keep steps concise
- End with questions like "Ready for the next step?" or "Any questions about this step?"` : ''}

📝 CONVERSATION CONTEXT:
${conversationContext ? `Previous conversation:\n${conversationContext}\n\n` : ''}

Current question: ${userMessage}

Please provide a detailed, helpful, and engaging response focused on cooking and culinary arts.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDhUzf3y6JkGexIbmY_jwhpTu6BA3FbDYs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: enhancedPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            topK: 50,
            topP: 0.9,
            maxOutputTokens: 2048,
            candidateCount: 1,
            stopSequences: ["User:", "Assistant:"]
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH", 
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        
        if (response.status === 503) {
          return "🔄 The AI service is currently experiencing high demand. Please try again in a few moments, or feel free to ask me another cooking question!";
        } else if (response.status === 429) {
          return "⏱️ We've hit the rate limit. Please wait a moment before sending another message.";
        } else if (response.status === 400) {
          return "❌ There was an issue with your request. Please try rephrasing your question.";
        } else {
          console.error('API Error:', errorData);
          return "🔧 I'm experiencing technical difficulties. Please try again in a moment, and I'll do my best to help with your cooking questions!";
        }
      }

      const data = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || "I'm sorry, I couldn't generate a response. Please try asking your cooking question again.";
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return "🌐 Unable to connect to the AI service. Please check your internet connection and try again.";
      }
      return "🤖 I'm having trouble processing your request right now. Please try again in a moment, and I'll be happy to help with your cooking questions!";
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const messageToSend = messageText || inputMessage.trim();
    if (!messageToSend) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageToSend,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Get AI response from Gemini
    try {
      const aiResponseContent = await getGeminiResponse(messageToSend);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseContent,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);

      // If in voice mode, speak the response
      if (isVoiceMode) {
        await speakText(aiResponseContent);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
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
            {/* Voice Mode Status */}
            {isVoiceMode && (
              <div className="px-6 py-2 bg-gradient-hero/10 border-b border-border/50">
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <Volume2 className="w-4 h-4 text-primary" />
                  <span className="text-primary font-medium">
                    {isListeningForWakeWord ? "Say 'Cooksy' to start" : 
                     isRecording ? "Listening..." : 
                     isSpeaking ? "Speaking..." : "Voice mode active"}
                  </span>
                  {(isRecording || isSpeaking) && (
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                </div>
              </div>
            )}

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
                  <div className="text-center mb-6">
                    <h2 className="text-lg font-semibold mb-2">Welcome to Voice Mode!</h2>
                    <p className="text-muted-foreground mb-4 text-sm">Try asking me about cooking, or enable voice mode below:</p>
                    
                    {/* Voice Mode Toggle */}
                    <div className="mb-6">
                      <Button
                        onClick={toggleVoiceMode}
                        variant={isVoiceMode ? "default" : "outline"}
                        className="mb-2"
                        size="lg"
                      >
                        {isVoiceMode ? <VolumeX className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
                        {isVoiceMode ? "Disable Voice Mode" : "Enable Voice Mode"}
                      </Button>
                      {isVoiceMode && (
                        <p className="text-xs text-muted-foreground">
                          Say "Cooksy" to start voice conversation
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-center text-muted-foreground mb-4 text-sm">Or try asking me about:</p>
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
                      placeholder={isVoiceMode ? "Voice mode active - say 'Cooksy' or type here..." : "Ask me about cooking, recipes, or food..."}
                      className="bg-background/80 border-border/30 focus:border-primary/50 transition-all duration-300 min-h-[48px] text-base"
                      disabled={isLoading}
                    />
                  </div>
                  
                  {/* Voice Mode Toggle Button */}
                  <Button
                    onClick={toggleVoiceMode}
                    variant={isVoiceMode ? "default" : "outline"}
                    size="lg"
                    className="px-3"
                    title={isVoiceMode ? "Disable Voice Mode" : "Enable Voice Mode"}
                  >
                    {isVoiceMode ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                  
                  {/* Manual Voice Input Button */}
                  <Button
                    onClick={startRecording}
                    disabled={isRecording || isLoading}
                    variant={isRecording ? "default" : "outline"}
                    size="lg"
                    className="px-3"
                    title="Voice Input"
                  >
                    {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </Button>
                  
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() || isLoading}
                    size="lg"
                    className="px-6 bg-gradient-hero hover:shadow-glow transition-all duration-300"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Chat;