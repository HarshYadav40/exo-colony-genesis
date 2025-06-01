
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface AstroBuddyProps {
  isVisible: boolean;
  onToggle: () => void;
  currentContext?: string;
}

export const AstroBuddy: React.FC<AstroBuddyProps> = ({
  isVisible,
  onToggle,
  currentContext,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Greetings, fellow space explorer! I'm AstroBuddy, your AI assistant for exoplanet colonization. I can help explain planetary features, recommend colony strategies, and teach you the science behind space colonization. How can I assist you today?",
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    if (!apiKey.trim()) {
      toast.error('Please enter your Gemini API key first');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const contextPrompt = currentContext 
        ? `Context: The user is currently ${currentContext}. ` 
        : '';

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${contextPrompt}You are AstroBuddy, an AI assistant for the ExoWorlds game that helps with exoplanet colonization. Be helpful, educational, and engaging. Focus on space science, colony management, and planetary conditions. Keep responses concise but informative. User question: ${input}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topP: 0.9,
              maxOutputTokens: 500,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
        "I'm having trouble connecting to my knowledge base right now. Please try again!";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      toast.error('Failed to get response from AstroBuddy');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm experiencing some technical difficulties. Please check your API key and try again!",
        sender: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isVisible) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary hover:bg-primary/80 text-primary-foreground z-50 pulse-glow"
      >
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-transparent text-primary-foreground font-bold">
            AB
          </AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] glass-morphism neon-border z-50 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center space-x-2">
          <Avatar className="w-8 h-8 pulse-glow">
            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
              AB
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-primary font-orbitron">AstroBuddy</CardTitle>
        </div>
        <Button
          onClick={onToggle}
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-white"
        >
          ×
        </Button>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-3 p-4">
        {!apiKey && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded p-3 mb-2">
            <p className="text-xs text-yellow-200 mb-2">
              Enter your Gemini API key to activate AstroBuddy:
            </p>
            <Input
              type="password"
              placeholder="Gemini API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="text-xs"
            />
          </div>
        )}
        
        <ScrollArea className="flex-1 pr-3" ref={scrollAreaRef}>
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  {message.sender === 'assistant' && (
                    <div className="typewriter-effect">
                      {message.text}
                    </div>
                  )}
                  {message.sender === 'user' && message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-white p-3 rounded-lg text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask AstroBuddy..."
            disabled={isLoading || !apiKey}
            className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-muted-foreground"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim() || !apiKey}
            className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50"
          >
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
