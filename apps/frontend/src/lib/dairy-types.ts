export type Species = 'goat' | 'cow' | 'sheep';

export interface DairyAnimal {
  id: string;
  name: string;
  species: Species;
}

export interface MilkRecord {
  id: string;
  animal_id: string;
  species: Species;
  timestamp: Date;
  volume: number; // in liters
  quality_notes?: string;
  storage_temp?: number; // in Celsius
  photo_url?: string;
}

export interface DiyPlan {
  id: string;
  title: string;
  species_list: Species[];
  description: string;
  materials: string[];
  instructions_url: string;
  safety_notes?: string;
  author: string;
  publish_date: Date;
  download_url: string;
}

export type CheeseBatchStatus = 'inoculation' | 'pressing' | 'aging' | 'complete';

export interface CheeseBatch {
  id: string;
  species: Species;
  cheese_type: string;
  start_date: Date;
  milk_volume: number; // in liters
  ingredients: string[];
  status: CheeseBatchStatus;
  expected_aging_time: number; // in days
  aging_conditions: {
    timestamp: Date;
    temperature: number; // in Celsius
    humidity: number; // in %
    notes?: string;
  }[];
  notes?: string;
}

export interface CheeseRecipe {
  id: string;
  species: Species;
  cheese_type: string;
  ingredients: string[];
  equipment_needed: string[];
  steps: string[];
  recommended_temp: { min: number; max: number }; // in Celsius
  recommended_humidity: { min: number; max: number }; // in %
  aging_time: number; // in days
  author: string;
  publish_date: Date;
}
