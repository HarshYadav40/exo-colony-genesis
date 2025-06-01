
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AstroBuddyChat } from './AstroBuddyChat';

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
  const [apiKey, setApiKey] = useState('AIzaSyAYmEj1tHJMiRm7lMsQbJ83Tf3IfkkY0Fg');
  const [showApiInput, setShowApiInput] = useState(false);

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
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setShowApiInput(!showApiInput)}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-white text-xs"
          >
            ⚙️
          </Button>
          <Button
            onClick={onToggle}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-white"
          >
            ×
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-3 p-4">
        {showApiInput && (
          <div className="bg-blue-500/20 border border-blue-500/50 rounded p-3 mb-2">
            <p className="text-xs text-blue-200 mb-2">
              Gemini API Key (pre-filled with default):
            </p>
            <Input
              type="password"
              placeholder="Gemini API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="text-xs"
            />
            <Button
              onClick={() => setShowApiInput(false)}
              size="sm"
              className="mt-2 text-xs"
            >
              Save
            </Button>
          </div>
        )}
        
        <AstroBuddyChat 
          currentContext={currentContext}
          apiKey={apiKey}
          className="flex-1"
        />
      </CardContent>
    </Card>
  );
};
