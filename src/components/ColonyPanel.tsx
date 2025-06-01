
import React from 'react';
import { Colony, ColonyModule } from '../types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface ColonyPanelProps {
  colony: Colony;
  availableModules: ColonyModule[];
  onBuildModule: (moduleId: number) => void;
}

export const ColonyPanel: React.FC<ColonyPanelProps> = ({
  colony,
  availableModules,
  onBuildModule,
}) => {
  const getResourceColor = (value: number, max: number = 100) => {
    const percentage = (value / max) * 100;
    if (percentage > 70) return 'bg-green-500';
    if (percentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Colony Stats */}
      <Card className="glass-morphism neon-border">
        <CardHeader>
          <CardTitle className="text-primary font-orbitron">Colony Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Energy</span>
                <span className="text-sm text-white">{colony.energy}/100</span>
              </div>
              <Progress 
                value={colony.energy} 
                className={`h-2 ${getResourceColor(colony.energy)}`}
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Food</span>
                <span className="text-sm text-white">{colony.food}/100</span>
              </div>
              <Progress 
                value={colony.food} 
                className={`h-2 ${getResourceColor(colony.food)}`}
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Oxygen</span>
                <span className="text-sm text-white">{colony.oxygen}/100</span>
              </div>
              <Progress 
                value={colony.oxygen} 
                className={`h-2 ${getResourceColor(colony.oxygen)}`}
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Morale</span>
                <span className="text-sm text-white">{colony.morale}/100</span>
              </div>
              <Progress 
                value={colony.morale} 
                className={`h-2 ${getResourceColor(colony.morale)}`}
              />
            </div>
          </div>
          
          <div className="pt-2 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Population</span>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                {colony.population}
              </Badge>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-muted-foreground">Credits</span>
              <Badge variant="secondary" className="bg-accent/20 text-accent">
                {colony.credits}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Build Modules */}
      <Card className="glass-morphism neon-border">
        <CardHeader>
          <CardTitle className="text-secondary font-orbitron">Build Modules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {availableModules.map((module) => (
            <div
              key={module.id}
              className="glass-morphism p-3 rounded-lg hover-glow transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-white">{module.name}</h4>
                <Badge variant="outline" className="text-accent border-accent/50">
                  {module.cost} credits
                </Badge>
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1 mb-3">
                {module.energy_required && (
                  <div>Energy: -{module.energy_required}</div>
                )}
                {module.energy_production && (
                  <div className="text-green-400">Energy: +{module.energy_production}</div>
                )}
                {module.produces_food && (
                  <div className="text-green-400">Food: +{module.produces_food}</div>
                )}
                {module.oxygen_output && (
                  <div className="text-green-400">Oxygen: +{module.oxygen_output}</div>
                )}
                {module.supports_population && (
                  <div className="text-blue-400">Population: +{module.supports_population}</div>
                )}
                {module.boosts_morale && (
                  <div className="text-purple-400">Morale: +{module.boosts_morale}</div>
                )}
              </div>
              
              <Button
                onClick={() => onBuildModule(module.id)}
                disabled={colony.credits < module.cost}
                className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50"
                size="sm"
              >
                Build
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Built Modules */}
      {colony.modules.length > 0 && (
        <Card className="glass-morphism neon-border">
          <CardHeader>
            <CardTitle className="text-accent font-orbitron">Active Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {colony.modules.map((moduleName, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-white/5 rounded"
                >
                  <span className="text-sm text-white">{moduleName}</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full pulse-glow"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
