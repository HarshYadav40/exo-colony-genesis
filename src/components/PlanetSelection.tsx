
import React from 'react';
import { Planet } from '../types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PlanetSelectionProps {
  planets: Planet[];
  selectedPlanet: Planet | null;
  onSelectPlanet: (planet: Planet) => void;
  onStartColonization: () => void;
}

export const PlanetSelection: React.FC<PlanetSelectionProps> = ({
  planets,
  selectedPlanet,
  onSelectPlanet,
  onStartColonization,
}) => {
  const getHabitabilityColor = (habitability: string) => {
    switch (habitability) {
      case 'high': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRadiationColor = (radiation: string) => {
    switch (radiation) {
      case 'low': return 'text-green-400';
      case 'moderate': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-orbitron font-bold text-primary mb-2 typewriter">
          ExoWorlds
        </h1>
        <p className="text-muted-foreground">
          Choose your exoplanet to begin colonization
        </p>
      </div>

      <div className="grid gap-4">
        {planets.map((planet) => (
          <Card
            key={planet.id}
            className={`glass-morphism cursor-pointer transition-all hover-glow ${
              selectedPlanet?.id === planet.id ? 'neon-border' : 'border-white/10'
            }`}
            onClick={() => onSelectPlanet(planet)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-white font-orbitron">
                  {planet.name}
                </CardTitle>
                <Badge 
                  className={`${getHabitabilityColor(planet.habitability)} text-white`}
                >
                  {planet.habitability}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Distance:</span>
                  <span className="text-white ml-2">{planet.distance_ly} ly</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Gravity:</span>
                  <span className="text-white ml-2">{planet.gravity}g</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Temperature:</span>
                  <span className="text-white ml-2">{planet.temperature}°C</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Radiation:</span>
                  <span className={`ml-2 ${getRadiationColor(planet.radiation)}`}>
                    {planet.radiation}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Atmosphere:</span>
                <span className="text-white ml-2 text-sm">{planet.atmosphere}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedPlanet && (
        <div className="text-center">
          <Button
            onClick={onStartColonization}
            className="bg-primary hover:bg-primary/80 text-primary-foreground font-orbitron font-bold px-8 py-3 text-lg neon-glow"
          >
            Begin Colonization
          </Button>
        </div>
      )}
    </div>
  );
};
