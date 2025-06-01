
import React, { useState } from 'react';
import { PlanetSelection } from '../components/PlanetSelection';
import { PlanetViewer } from '../components/PlanetViewer';
import { ColonyPanel } from '../components/ColonyPanel';
import { AstroBuddy } from '../components/AstroBuddy';
import { EventNotification } from '../components/EventNotification';
import { useGameEngine } from '../hooks/useGameEngine';

const Index = () => {
  const [isAstroBuddyVisible, setIsAstroBuddyVisible] = useState(false);
  const {
    gameState,
    planets,
    modules,
    currentEvent,
    selectPlanet,
    startColonization,
    buildModule,
    dismissEvent,
  } = useGameEngine();

  const getContextForAstroBuddy = () => {
    if (gameState.phase === 'planet-selection') {
      return gameState.selectedPlanet 
        ? `selecting planet ${gameState.selectedPlanet.name}` 
        : 'choosing a planet for colonization';
    }
    return `managing a colony on ${gameState.selectedPlanet?.name} with ${gameState.colony.population} colonists`;
  };

  if (gameState.phase === 'planet-selection') {
    return (
      <div className="min-h-screen p-6 particle-bg">
        <div className="max-w-4xl mx-auto">
          <PlanetSelection
            planets={planets}
            selectedPlanet={gameState.selectedPlanet}
            onSelectPlanet={selectPlanet}
            onStartColonization={startColonization}
          />
        </div>
        
        <AstroBuddy
          isVisible={isAstroBuddyVisible}
          onToggle={() => setIsAstroBuddyVisible(!isAstroBuddyVisible)}
          currentContext={getContextForAstroBuddy()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen particle-bg">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-orbitron font-bold text-primary">
              ExoWorlds
            </h1>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                {gameState.selectedPlanet?.name} Colony
              </div>
              <div className="text-lg font-semibold text-white">
                Day {gameState.colony.day}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Layout */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Planet Info */}
        <div className="w-80 p-6 border-r border-white/10 bg-black/10 backdrop-blur-sm">
          <div className="space-y-6">
            {gameState.selectedPlanet && (
              <div className="glass-morphism neon-border p-4 rounded-xl">
                <h3 className="text-lg font-orbitron text-primary mb-3">
                  Planet Status
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Temperature:</span>
                    <span className="text-white">{gameState.selectedPlanet.temperature}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gravity:</span>
                    <span className="text-white">{gameState.selectedPlanet.gravity}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Radiation:</span>
                    <span className="text-white">{gameState.selectedPlanet.radiation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Atmosphere:</span>
                    <span className="text-white">{gameState.selectedPlanet.atmosphere}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Panel - 3D View */}
        <div className="flex-1 p-6">
          <PlanetViewer planet={gameState.selectedPlanet} />
        </div>

        {/* Right Panel - Colony Controls */}
        <div className="w-80 p-6 border-l border-white/10 bg-black/10 backdrop-blur-sm overflow-y-auto">
          <ColonyPanel
            colony={gameState.colony}
            availableModules={modules}
            onBuildModule={buildModule}
          />
        </div>
      </div>

      {/* Event Notification */}
      {currentEvent && (
        <EventNotification
          event={currentEvent}
          onDismiss={dismissEvent}
        />
      )}

      {/* AstroBuddy */}
      <AstroBuddy
        isVisible={isAstroBuddyVisible}
        onToggle={() => setIsAstroBuddyVisible(!isAstroBuddyVisible)}
        currentContext={getContextForAstroBuddy()}
      />
    </div>
  );
};

export default Index;
