
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  // Use the pre-configured API key without exposing it to the user
  const apiKey = 'AIzaSyAYmEj1tHJMiRm7lMsQbJ83Tf3IfkkY0Fg';

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
      
      <CardContent className="flex-1 flex flex-col p-0">
        <AstroBuddyChat 
          currentContext={currentContext}
          apiKey={apiKey}
          className="flex-1"
        />
      </CardContent>
    </Card>
  );
};
