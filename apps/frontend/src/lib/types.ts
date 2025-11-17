export interface PoultryBreed {
  id: string;
  name: string;
  category: 'chicken' | 'duck' | 'goose' | 'turkey' | 'guinea-fowl' | 'pigeon';
  description: string;
  characteristics: string[];
  weight: {
    male: string;
    female: string;
  };
  eggProduction?: string;
  temperament: string;
  imageUrl?: string;
  standard: string;
  origin: string;
  classification: {
    class: string;
    order: string;
    family: string;
  };
}

export interface Breed {
  id: string;
  name: string;
  origin: string;
  category: 'chicken' | 'duck' | 'goose' | 'turkey' | 'guinea-fowl' | 'pigeon' | 'pig' | 'goat' | 'rabbit';
  description: string;
  traits: string[];
  weight: {
    male: string;
    female: string;
  };
  eggProduction?: string;
  milkProduction?: string;
  temperament: string;
  rating: number;
  contributors: number;
  imageUrl: string;
  compliance: {
    ndImmunisation?: boolean;
    pdmaRequirements?: string[];
    exportConsiderations?: string[];
  };
  intelligence: {
    breedingPotential: number;
    marketDemand: 'high' | 'medium' | 'low';
    adaptability: number;
    maintenanceLevel: 'low' | 'medium' | 'high';
  };
  commonHealthConcerns?: string[];
}

export interface Stat {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

export interface Task {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  membershipType: 'individual' | 'family' | 'commercial' | 'honorary';
  joinDate: Date;
  renewalDate: Date;
  isActive: boolean;
  profile?: {
    farmName?: string;
    location?: string;
    specialties?: string[];
    bio?: string;
    profileImage?: string;
  };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: {
    name: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  type: 'show' | 'meeting' | 'workshop' | 'competition' | 'other';
  isRegistrationRequired: boolean;
  maxAttendees?: number;
  attendees: string[]; // Array of member IDs
  organizer: string; // Member ID
  imageUrl?: string;
  documents?: string[]; // URLs to related documents
}

export interface GettyImage {
  id: string;
  title: string;
  caption: string;
  asset_family: string;
  aspect_ratio: number;
  display_sizes: Array<{
    name: string;
    uri: string;
  }>;
}

export interface NavigationItem {
  name: string;
  href: string;
  description?: string;
  children?: NavigationItem[];
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
    url?: string;
  };
  twitter?: {
    card?: string;
    site?: string;
    title?: string;
    description?: string;
    image?: string;
  };
  canonicalUrl?: string;
  noIndex?: boolean;
}