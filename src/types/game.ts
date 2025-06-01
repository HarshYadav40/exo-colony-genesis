
export interface Planet {
  id: number;
  name: string;
  distance_ly: number;
  gravity: number;
  temperature: number;
  radiation: string;
  atmosphere: string;
  habitability: string;
}

export interface ColonyModule {
  id: number;
  name: string;
  cost: number;
  energy_required?: number;
  energy_production?: number;
  supports_population?: number;
  boosts_morale?: number;
  produces_food?: number;
  oxygen_output?: number;
  reduces_radiation?: boolean;
  increases_efficiency?: boolean;
  unlocks_tech?: string[];
  maintenance?: number;
}

export interface Colony {
  energy: number;
  food: number;
  oxygen: number;
  morale: number;
  population: number;
  credits: number;
  modules: string[];
  day: number;
}

export interface GameEvent {
  id: number;
  type: string;
  description: string;
  impact: {
    energy?: number;
    morale?: number;
    population?: number;
    food_production?: number;
    efficiency?: number;
    repair_cost?: number;
    modules_damaged?: string[];
  };
}

export interface GameState {
  phase: 'planet-selection' | 'colonization';
  selectedPlanet: Planet | null;
  colony: Colony;
  time: number;
  gameSpeed: number;
}
