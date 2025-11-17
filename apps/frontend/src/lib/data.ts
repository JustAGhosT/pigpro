import { Breed, Stat, Task } from './types';

export const stats: Stat[] = [
  {
    title: 'Total Herd',
    value: '247',
    change: '+12 this month',
    trend: 'up',
  },
  {
    title: 'Avg. Revenue/Pig',
    value: 'R2,840',
    change: '+18% vs last year',
    trend: 'up',
  },
  {
    title: 'Team Members',
    value: '8',
    change: '2 new this month',
    trend: 'up',
  },
  {
    title: 'Breeding Score',
    value: '92%',
    change: '+5% this quarter',
    trend: 'up',
  },
];

export const tasks: Task[] = [
  {
    title: 'Vaccination Schedule',
    description: 'Batch A pigs due for vaccination',
    priority: 'high',
    dueDate: 'Tomorrow',
  },
  {
    title: 'Feed Optimization',
    description: 'Review feed efficiency metrics',
    priority: 'medium',
    dueDate: 'This week',
  },
  {
    title: 'Market Analysis',
    description: 'Check pricing trends for premium cuts',
    priority: 'low',
    dueDate: 'Next week',
  },
];

export const breeds: Breed[] = [
  {
    id: '1',
    name: 'Rhode Island Red',
    origin: 'United States',
    category: 'chicken',
    description: 'Hardy dual-purpose breed known for excellent egg production and good meat quality.',
    traits: ['Hardy', 'Good Egg Layer', 'Dual Purpose', 'Cold Tolerant'],
    weight: {
      male: '3.9kg',
      female: '2.9kg'
    },
    eggProduction: '250-300 eggs/year',
    temperament: 'Docile',
    rating: 4.8,
    contributors: 34,
    imageUrl: '/placeholder-rhode-island-red.jpg',
    compliance: {
      ndImmunisation: true,
      pdmaRequirements: ['Health certificates', 'Transport permits'],
      exportConsiderations: ['HPAI vaccination', 'Export health certificates']
    },
    intelligence: {
      breedingPotential: 92,
      marketDemand: 'high' as const,
      adaptability: 88,
      maintenanceLevel: 'low' as const
    },
    commonHealthConcerns: ["Marek's Disease", 'Coccidiosis', 'Bumblefoot']
  },
  {
    id: '2',
    name: 'White Leghorn',
    origin: 'Italy',
    category: 'chicken',
    description: 'Excellent white egg layer breed, active and hardy with high feed efficiency.',
    traits: ['Excellent Layer', 'Active', 'Hardy', 'Heat Tolerant'],
    weight: {
      male: '2.7kg',
      female: '2.0kg'
    },
    eggProduction: '280-320 eggs/year',
    temperament: 'Active',
    rating: 4.6,
    contributors: 28,
    imageUrl: '/placeholder-leghorn.jpg',
    commonHealthConcerns: ['Avian Influenza (if in high-risk areas)', 'Egg-binding']
  },
  {
    id: '3',
    name: 'Pekin Duck',
    origin: 'China',
    category: 'duck',
    description: 'Large white duck breed excellent for meat production with calm temperament.',
    traits: ['Fast Growing', 'Good Meat Production', 'Hardy', 'Calm'],
    weight: {
      male: '4.1kg',
      female: '3.6kg'
    },
    eggProduction: '150-200 eggs/year',
    temperament: 'Calm',
    rating: 4.4,
    contributors: 19,
    imageUrl: '/placeholder-pekin-duck.jpg'
  },
  {
    id: '4',
    name: 'Toulouse Goose',
    origin: 'France',
    category: 'goose',
    description: 'Large heritage goose breed known for excellent meat quality and liver production.',
    traits: ['Large Size', 'Excellent Meat', 'Good Forager', 'Docile'],
    weight: {
      male: '12kg',
      female: '10kg'
    },
    eggProduction: '35-40 eggs/year',
    temperament: 'Docile',
    rating: 4.5,
    contributors: 15,
    imageUrl: '/placeholder-toulouse-goose.jpg'
  },
  {
    id: '5',
    name: 'Bronze Turkey',
    origin: 'United States',
    category: 'turkey',
    description: 'Traditional heritage turkey breed with excellent meat quality and natural breeding ability.',
    traits: ['Heritage Breed', 'Natural Breeding', 'Good Meat Quality', 'Hardy'],
    weight: {
      male: '16kg',
      female: '9kg'
    },
    temperament: 'Alert',
    rating: 4.3,
    contributors: 12,
    imageUrl: '/placeholder-bronze-turkey.jpg'
  },
  {
    id: '6',
    name: 'Guinea Fowl',
    origin: 'Africa',
    category: 'guinea-fowl',
    description: 'Hardy bird excellent for pest control, alert and protective of the flock.',
    traits: ['Pest Control', 'Alert', 'Hardy', 'Good Alarm System'],
    weight: {
      male: '1.3kg',
      female: '1.2kg'
    },
    eggProduction: '100-150 eggs/year',
    temperament: 'Alert',
    rating: 4.2,
    contributors: 21,
    imageUrl: '/placeholder-guinea-fowl.jpg'
  },
  {
    id: '7',
    name: 'Hampshire Pig',
    origin: 'United Kingdom',
    category: 'pig',
    description: 'Hardy pig breed known for excellent meat quality, good mothering ability, and lean muscle development.',
    traits: ['Lean Meat', 'Good Mothering', 'Hardy', 'Fast Growing'],
    weight: {
      male: '320kg',
      female: '250kg'
    },
    temperament: 'Docile',
    rating: 4.6,
    contributors: 18,
    imageUrl: '/placeholder-hampshire-pig.jpg'
  },
  {
    id: '8',
    name: 'Large White Pig',
    origin: 'United Kingdom',
    category: 'pig',
    description: 'Popular commercial pig breed with excellent feed conversion and high litter numbers.',
    traits: ['High Fertility', 'Good Feed Conversion', 'Large Litters', 'Hardy'],
    weight: {
      male: '300kg',
      female: '230kg'
    },
    temperament: 'Calm',
    rating: 4.7,
    contributors: 25,
    imageUrl: '/placeholder-large-white-pig.jpg'
  },
  {
    id: '9',
    name: 'Boer Goat',
    origin: 'South Africa',
    category: 'goat',
    description: 'Premium meat goat breed developed in South Africa, known for fast growth and excellent meat quality.',
    traits: ['Fast Growth', 'Excellent Meat', 'Hardy', 'Good Mothers'],
    weight: {
      male: '120kg',
      female: '90kg'
    },
    temperament: 'Docile',
    rating: 4.8,
    contributors: 32,
    imageUrl: '/placeholder-boer-goat.jpg'
  },
  {
    id: '10',
    name: 'Saanen Goat',
    origin: 'Switzerland',
    category: 'goat',
    description: 'World-renowned dairy goat breed with excellent milk production and calm temperament.',
    traits: ['High Milk Production', 'Calm', 'Hardy', 'Heat Tolerant'],
    weight: {
      male: '90kg',
      female: '65kg'
    },
    temperament: 'Calm',
    rating: 4.5,
    contributors: 24,
    imageUrl: '/placeholder-saanen-goat.jpg'
  },
  {
    id: '11',
    name: 'New Zealand White Rabbit',
    origin: 'United States',
    category: 'rabbit',
    description: 'Popular meat rabbit breed with excellent growth rate and feed conversion efficiency.',
    traits: ['Fast Growth', 'Good Feed Conversion', 'Large Litters', 'Docile'],
    weight: {
      male: '5kg',
      female: '4.5kg'
    },
    temperament: 'Docile',
    rating: 4.4,
    contributors: 16,
    imageUrl: '/placeholder-nz-white-rabbit.jpg'
  },
  {
    id: '12',
    name: 'Californian Rabbit',
    origin: 'United States',
    category: 'rabbit',
    description: 'Dual-purpose rabbit breed excellent for both meat and fur production with distinctive markings.',
    traits: ['Dual Purpose', 'Good Meat Quality', 'Hardy', 'Distinctive Markings'],
    weight: {
      male: '4.5kg',
      female: '4kg'
    },
    temperament: 'Calm',
    rating: 4.3,
    contributors: 14,
    imageUrl: '/placeholder-californian-rabbit.jpg'
  }
];
