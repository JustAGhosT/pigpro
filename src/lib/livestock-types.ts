// Core livestock and compliance types for Livestock Club SA

export interface LivestockBreed {
  id: string;
  name: string;
  origin: string;
  category: LivestockCategory;
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
}

export type LivestockCategory =
  | 'chicken'
  | 'duck'
  | 'goose'
  | 'turkey'
  | 'guinea-fowl'
  | 'pigeon'
  | 'pig'
  | 'goat'
  | 'rabbit';

export interface CompliancePermit {
  id: string;
  name: string;
  applies_to: LivestockCategory[];
  activity: ActivityType[];
  issuing_authority: string;
  who: string;
  roles: string[];
  core: string;
  docs: string;
  refs: string[];
  category: ComplianceStrategy;
  compliance_level: ComplianceLevel;
}

export interface ComplianceSOP {
  id: string;
  title: string;
  description: string;
  category: string;
  animal_types: LivestockCategory[];
  steps: string[];
  requirements: string[];
  references: string[];
}

export interface ComplianceGuideline {
  id: string;
  title: string;
  description: string;
  type: ComplianceStrategy;
  recommendations: string[];
  considerations: string[];
}

export interface ComplianceSource {
  id: string;
  name: string;
  description: string;
  url: string;
  type: 'regulation' | 'protocol' | 'guideline';
}

export type ComplianceStrategy = 'forward-looking' | 'conservative';

export type ComplianceLevel = 'mandatory' | 'recommended' | 'optional';

export type ActivityType =
  | 'breeding'
  | 'live_sale'
  | 'meat_sale'
  | 'transport'
  | 'export'
  | 'vaccination'
  | 'feed_production'
  | 'waste_management';

export interface LivestockType {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
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
    specialties?: LivestockCategory[];
    bio?: string;
    profileImage?: string;
  };
  compliance: {
    strategy: ComplianceStrategy;
    activities: ActivityType[];
    permits: string[];
    lastComplianceCheck: Date;
    nextComplianceReview: Date;
  };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  eventType: 'show' | 'competition' | 'meeting' | 'workshop' | 'conference';
  categories: LivestockCategory[];
  registrationDeadline?: Date;
  maxParticipants?: number;
  currentParticipants: number;
  isPublic: boolean;
}