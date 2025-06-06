
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AstroBuddyChat } from './AstroBuddyChat';
import { X, MessageCircle } from 'lucide-react';

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
  const apiKey = 'AIzaSyAYmEj1tHJMiRm7lMsQbJ83Tf3IfkkY0Fg';

  if (!isVisible) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] bg-white shadow-2xl border border-gray-200 rounded-2xl z-50 flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8 bg-emerald-500">
            <AvatarFallback className="bg-emerald-500 text-white font-semibold text-sm">
              AB
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-gray-900 font-semibold text-lg">AstroBuddy</CardTitle>
            <p className="text-xs text-gray-500">AI Assistant</p>
          </div>
        </div>
        <Button
          onClick={onToggle}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1"
        >
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <AstroBuddyChat 
          currentContext={currentContext}
          apiKey={apiKey}
          className="flex-1"
        />
      </CardContent>
    </Card>
  );
};
