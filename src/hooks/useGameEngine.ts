
import { useState, useEffect, useCallback } from 'react';
import { Colony, Planet, ColonyModule, GameEvent, GameState } from '../types/game';
import { toast } from 'sonner';

export const useGameEngine = () => {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'planet-selection',
    selectedPlanet: null,
    colony: {
      energy: 50,
      food: 40,
      oxygen: 60,
      morale: 75,
      population: 3,
      credits: 200,
      modules: [],
      day: 1,
    },
    time: 0,
    gameSpeed: 1,
  });

  const [planets, setPlanets] = useState<Planet[]>([]);
  const [modules, setModules] = useState<ColonyModule[]>([]);
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);

  // Load game data
  useEffect(() => {
    const loadGameData = async () => {
      try {
        const [planetsRes, modulesRes, eventsRes] = await Promise.all([
          fetch('/data/planets.json'),
          fetch('/data/modules.json'),
          fetch('/data/events.json'),
        ]);

        const planetsData = await planetsRes.json();
        const modulesData = await modulesRes.json();
        const eventsData = await eventsRes.json();

        setPlanets(planetsData);
        setModules(modulesData);
        setEvents(eventsData);
      } catch (error) {
        console.error('Failed to load game data:', error);
        toast.error('Failed to load game data');
      }
    };

    loadGameData();
  }, []);

  // Game simulation loop
  useEffect(() => {
    if (gameState.phase !== 'colonization') return;

    const interval = setInterval(() => {
      setGameState(prevState => {
        const newColony = { ...prevState.colony };
        
        // Resource consumption/production
        newColony.energy = Math.max(0, Math.min(100, newColony.energy - 2 + getEnergyProduction(newColony.modules)));
        newColony.food = Math.max(0, Math.min(100, newColony.food - newColony.population + getFoodProduction(newColony.modules)));
        newColony.oxygen = Math.max(0, Math.min(100, newColony.oxygen - newColony.population + getOxygenProduction(newColony.modules)));
        
        // Morale calculations
        let moraleChange = 0;
        if (newColony.energy < 30) moraleChange -= 2;
        if (newColony.food < 30) moraleChange -= 3;
        if (newColony.oxygen < 30) moraleChange -= 5;
        if (newColony.energy > 70 && newColony.food > 70 && newColony.oxygen > 70) moraleChange += 1;
        
        newColony.morale = Math.max(0, Math.min(100, newColony.morale + moraleChange + getMoraleBonus(newColony.modules)));
        
        // Population growth/decline
        if (newColony.morale > 80 && newColony.food > 50 && newColony.oxygen > 50) {
          newColony.population = Math.min(getMaxPopulation(newColony.modules), newColony.population + 0.1);
        } else if (newColony.morale < 20 || newColony.food < 10 || newColony.oxygen < 10) {
          newColony.population = Math.max(1, newColony.population - 0.1);
        }
        
        newColony.population = Math.round(newColony.population * 10) / 10;
        
        // Credits generation
        newColony.credits += Math.floor(newColony.population * 2);
        
        // Day progression
        newColony.day += 1;

        return {
          ...prevState,
          colony: newColony,
          time: prevState.time + prevState.gameSpeed,
        };
      });
    }, 1000); // Run every second

    return () => clearInterval(interval);
  }, [gameState.phase, gameState.gameSpeed]);

  // Random events
  useEffect(() => {
    if (gameState.phase !== 'colonization') return;

    const eventInterval = setInterval(() => {
      if (Math.random() < 0.05 && events.length > 0) { // 5% chance per interval
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        triggerEvent(randomEvent);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(eventInterval);
  }, [gameState.phase, events]);

  const getEnergyProduction = (modules: string[]) => {
    return modules.filter(m => m === 'Solar Array').length * 20;
  };

  const getFoodProduction = (modules: string[]) => {
    return modules.filter(m => m === 'Greenhouse').length * 15;
  };

  const getOxygenProduction = (modules: string[]) => {
    return modules.filter(m => m === 'Greenhouse').length * 5;
  };

  const getMoraleBonus = (modules: string[]) => {
    return modules.filter(m => m === 'Habitat Dome').length * 5;
  };

  const getMaxPopulation = (modules: string[]) => {
    return 3 + modules.filter(m => m === 'Habitat Dome').length * 5;
  };

  const selectPlanet = useCallback((planet: Planet) => {
    setGameState(prev => ({ ...prev, selectedPlanet: planet }));
  }, []);

  const startColonization = useCallback(() => {
    if (!gameState.selectedPlanet) return;

    setGameState(prev => ({
      ...prev,
      phase: 'colonization',
    }));

    toast.success(`Colonization of ${gameState.selectedPlanet.name} has begun!`);
  }, [gameState.selectedPlanet]);

  const buildModule = useCallback((moduleId: number) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;

    setGameState(prev => {
      if (prev.colony.credits < module.cost) {
        toast.error('Insufficient credits!');
        return prev;
      }

      const newColony = {
        ...prev.colony,
        credits: prev.colony.credits - module.cost,
        modules: [...prev.colony.modules, module.name],
      };

      toast.success(`${module.name} constructed successfully!`);
      
      return {
        ...prev,
        colony: newColony,
      };
    });
  }, [modules]);

  const triggerEvent = useCallback((event: GameEvent) => {
    setCurrentEvent(event);
    
    setGameState(prev => {
      const newColony = { ...prev.colony };
      
      if (event.impact.energy) {
        newColony.energy = Math.max(0, Math.min(100, newColony.energy + event.impact.energy));
      }
      if (event.impact.morale) {
        newColony.morale = Math.max(0, Math.min(100, newColony.morale + event.impact.morale));
      }
      if (event.impact.population) {
        newColony.population = Math.max(1, newColony.population + event.impact.population);
      }
      if (event.impact.repair_cost) {
        newColony.credits = Math.max(0, newColony.credits - event.impact.repair_cost);
      }
      
      return {
        ...prev,
        colony: newColony,
      };
    });

    toast.warning(`Event: ${event.description}`);
  }, []);

  const dismissEvent = useCallback(() => {
    setCurrentEvent(null);
  }, []);

  return {
    gameState,
    planets,
    modules,
    currentEvent,
    selectPlanet,
    startColonization,
    buildModule,
    dismissEvent,
  };
};
