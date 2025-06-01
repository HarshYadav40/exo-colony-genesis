
import React from 'react';
import { GameEvent } from '../types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Zap, TrendingUp, Users, Wrench } from 'lucide-react';

interface EventNotificationProps {
  event: GameEvent;
  onDismiss: () => void;
}

export const EventNotification: React.FC<EventNotificationProps> = ({
  event,
  onDismiss,
}) => {
  const getEventIcon = () => {
    switch (event.type) {
      case 'solar_flare':
        return <Zap className="w-6 h-6 text-yellow-400" />;
      case 'meteor_shower':
        return <AlertTriangle className="w-6 h-6 text-red-400" />;
      case 'resource_discovery':
        return <TrendingUp className="w-6 h-6 text-green-400" />;
      case 'colony_illness':
        return <Users className="w-6 h-6 text-red-400" />;
      case 'tech_breakthrough':
        return <Wrench className="w-6 h-6 text-blue-400" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getEventColor = () => {
    switch (event.type) {
      case 'resource_discovery':
      case 'tech_breakthrough':
        return 'border-green-500/50 bg-green-500/10';
      case 'solar_flare':
        return 'border-yellow-500/50 bg-yellow-500/10';
      case 'meteor_shower':
      case 'colony_illness':
        return 'border-red-500/50 bg-red-500/10';
      default:
        return 'border-blue-500/50 bg-blue-500/10';
    }
  };

  return (
    <Card className={`fixed top-6 right-6 w-80 z-50 glass-morphism ${getEventColor()} animate-fade-in`}>
      <CardHeader className="flex flex-row items-center space-y-0 pb-3">
        <div className="flex items-center space-x-3">
          {getEventIcon()}
          <CardTitle className="text-white font-orbitron text-sm">
            Colony Event
          </CardTitle>
        </div>
        <Button
          onClick={onDismiss}
          variant="ghost"
          size="sm"
          className="ml-auto text-muted-foreground hover:text-white p-1"
        >
          ×
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-white text-sm mb-3">{event.description}</p>
        
        {/* Impact Display */}
        <div className="space-y-1 text-xs">
          {event.impact.energy && (
            <div className={`flex justify-between ${event.impact.energy > 0 ? 'text-green-400' : 'text-red-400'}`}>
              <span>Energy:</span>
              <span>{event.impact.energy > 0 ? '+' : ''}{event.impact.energy}</span>
            </div>
          )}
          {event.impact.morale && (
            <div className={`flex justify-between ${event.impact.morale > 0 ? 'text-green-400' : 'text-red-400'}`}>
              <span>Morale:</span>
              <span>{event.impact.morale > 0 ? '+' : ''}{event.impact.morale}</span>
            </div>
          )}
          {event.impact.population && (
            <div className={`flex justify-between ${event.impact.population > 0 ? 'text-green-400' : 'text-red-400'}`}>
              <span>Population:</span>
              <span>{event.impact.population > 0 ? '+' : ''}{event.impact.population}</span>
            </div>
          )}
          {event.impact.food_production && (
            <div className="flex justify-between text-green-400">
              <span>Food Production:</span>
              <span>+{event.impact.food_production}</span>
            </div>
          )}
          {event.impact.repair_cost && (
            <div className="flex justify-between text-yellow-400">
              <span>Repair Cost:</span>
              <span>{event.impact.repair_cost} credits</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
