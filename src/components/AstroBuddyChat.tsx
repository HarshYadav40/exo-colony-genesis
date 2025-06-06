
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface AstroBuddyChatProps {
  currentContext?: string;
  apiKey: string;
  className?: string;
}

export const AstroBuddyChat: React.FC<AstroBuddyChatProps> = ({
  currentContext,
  apiKey,
  className = "",
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Greetings! I'm AstroBuddy, your AI assistant for exoplanet colonization. How can I assist you today?",
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (!apiKey.trim()) {
      toast.error('Please provide your Gemini API key');
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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${contextPrompt}You are AstroBuddy, an AI assistant for the ExoWorlds game. Be helpful, concise, and engaging (max 3–5 sentences). User question: ${input}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topP: 0.9,
              maxOutputTokens: 200,
            },
          }),
        }
      );

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
        "I'm having trouble connecting right now. Please try again!";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error('Failed to get response from AstroBuddy');
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "I'm experiencing technical difficulties. Please try again later!",
          sender: 'assistant',
          timestamp: new Date(),
        },
      ]);
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

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Messages Container with proper scrolling */}
      <div className="flex-1 overflow-y-auto scrollbar-dark px-4 py-2 min-h-0 max-h-full">
        <div className="space-y-4 w-full">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex w-full ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-start space-x-2 max-w-[85%] min-w-0">
                {message.sender === 'assistant' && (
                  <Avatar className="w-6 h-6 mt-1 pulse-glow flex-shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
                      AB
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`p-3 rounded-lg text-sm min-w-0 flex-1 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white/10 text-white'
                  }`}
                  style={{ 
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word',
                    hyphens: 'auto'
                  }}
                >
                  {message.text}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start w-full">
              <div className="flex items-start space-x-2">
                <Avatar className="w-6 h-6 mt-1 pulse-glow flex-shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
                    AB
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white/10 text-white p-3 rounded-lg text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="border-t border-white/10 p-3 bg-black/20 backdrop-blur-sm flex-shrink-0">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask AstroBuddy anything..."
            disabled={isLoading}
            className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-muted-foreground"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};
