import { DairyAnimal, MilkRecord, DiyPlan, CheeseBatch, CheeseRecipe, Species } from './dairy-types';

export const dairyAnimals: DairyAnimal[] = [
  { id: 'animal-1', name: 'Bessie', species: 'cow' },
  { id: 'animal-2', name: 'Dolly', species: 'sheep' },
  { id: 'animal-3', name: 'Gertie', species: 'goat' },
];

export const milkRecords: MilkRecord[] = [
  {
    id: 'milk-1',
    animal_id: 'animal-1',
    species: 'cow',
    timestamp: new Date('2025-09-22T08:00:00Z'),
    volume: 15,
    quality_notes: 'Rich and creamy.',
    storage_temp: 4,
  },
  {
    id: 'milk-2',
    animal_id: 'animal-3',
    species: 'goat',
    timestamp: new Date('2025-09-22T18:00:00Z'),
    volume: 2,
    quality_notes: 'Slightly tangy, very fresh.',
    storage_temp: 3,
  },
];

export const diyPlans: DiyPlan[] = [
  {
    id: 'diy-1',
    title: 'Build a Goat Milking Stand',
    species_list: ['goat'],
    description: 'A sturdy and safe milking stand for your goats.',
    materials: ['Plywood', '2x4 lumber', 'Screws', 'Wood glue'],
    instructions_url: '/diy/goat-milking-stand.pdf',
    safety_notes: 'Always supervise animals on the stand.',
    author: 'Farm DIY Monthly',
    publish_date: new Date('2025-01-15T00:00:00Z'),
    download_url: '/diy/goat-milking-stand.pdf',
  },
  {
    id: 'diy-2',
    title: 'Simple Cow Stanchion',
    species_list: ['cow'],
    description: 'A simple and effective stanchion for handling cows.',
    materials: ['Metal pipes', 'Bolts', 'Concrete'],
    instructions_url: '/diy/cow-stanchion.pdf',
    author: 'DIY Farmer',
    publish_date: new Date('2024-11-20T00:00:00Z'),
    download_url: '/diy/cow-stanchion.pdf',
  },
];

export const cheeseRecipes: CheeseRecipe[] = [
  {
    id: 'recipe-1',
    cheese_type: 'Chevre',
    species: 'goat',
    ingredients: ['2L Goat Milk', '1/4 tsp Mesophilic Culture', '1 drop Rennet', 'Salt to taste'],
    equipment_needed: ['Large pot', 'Cheesecloth', 'Thermometer'],
    steps: ['Warm milk to 22°C', 'Add culture and rennet', 'Let set for 12-18 hours', 'Drain in cheesecloth', 'Salt and shape'],
    recommended_temp: { min: 20, max: 24 },
    recommended_humidity: { min: 60, max: 80 },
    aging_time: 0,
    author: 'The Modern Cheesemaker',
    publish_date: new Date('2023-05-10T00:00:00Z'),
  },
  {
    id: 'recipe-2',
    cheese_type: 'Farmhouse Cheddar',
    species: 'cow',
    ingredients: ['10L Cow Milk', '1/2 tsp Mesophilic Culture', '1/2 tsp Rennet', '2 tbsp Salt'],
    equipment_needed: ['Large pot', 'Cheese press', 'Cheesecloth', 'Thermometer'],
    steps: ['Warm milk to 32°C', 'Add culture', 'Add rennet', 'Cut curd', 'Cook curd', 'Drain whey', 'Cheddar', 'Salt', 'Press', 'Age'],
    recommended_temp: { min: 10, max: 13 },
    recommended_humidity: { min: 80, max: 85 },
    aging_time: 90,
    author: 'Classic Cheese Co.',
    publish_date: new Date('2022-08-01T00:00:00Z'),
  },
];

export const cheeseBatches: CheeseBatch[] = [
  {
    id: 'batch-1',
    cheese_type: 'Chevre',
    species: 'goat',
    start_date: new Date('2025-09-21T00:00:00Z'),
    milk_volume: 4,
    ingredients: ['4L Goat Milk', '1/2 tsp Mesophilic Culture', '2 drops Rennet', 'Salt'],
    status: 'complete',
    expected_aging_time: 0,
    aging_conditions: [],
    notes: 'First attempt at chevre. Very successful.',
  },
  {
    id: 'batch-2',
    cheese_type: 'Farmhouse Cheddar',
    species: 'cow',
    start_date: new Date('2025-08-15T00:00:00Z'),
    milk_volume: 10,
    ingredients: ['10L Cow Milk', '1/2 tsp Mesophilic Culture', '1/2 tsp Rennet', '2 tbsp Salt'],
    status: 'aging',
    expected_aging_time: 90,
    aging_conditions: [
      {
        timestamp: new Date('2025-08-16T10:00:00Z'),
        temperature: 12,
        humidity: 85,
        notes: 'Turned and wiped down.',
      },
      {
        timestamp: new Date('2025-09-01T10:00:00Z'),
        temperature: 12.5,
        humidity: 83,
        notes: 'Slight mold growth, wiped with brine.',
      },
    ],
    notes: 'Looking good so far.',
  },
];
