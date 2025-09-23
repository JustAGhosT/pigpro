// NOTE: These types are copied from the backend's domain.ts file.
// In a real-world monorepo, these would be in a shared package.

export interface Species {
  id: string;
  name: string;
}

export type ProductionEvent = 'birth' | 'death' | 'weight' | 'egg_count' | 'milk_volume' | 'sale' | 'purchase' | 'feed_intake' | 'cull' | 'treatment' | 'transfer' | 'grazing_move';

export interface ProductionRecord {
  id: string;
  species_id: string;
  animal_id?: string;
  group_id?: string;
  event_type: ProductionEvent;
  event_subtype?: string;
  date: string; // Using string for date to simplify form handling
  quantity?: number;
  unit?: string;
  weight_value?: number;
  weight_unit?: 'kg' | 'lb';
  egg_count?: number;
  milk_volume?: number;
  milk_unit?: 'L' | 'gal';
  notes?: string;
  attachments: string[]; // URLs to attachments
  source: {
    imported: boolean;
    origin?: string;
    file_id?: string;
  };
  created_by: string; // User ID
  created_at: string; // Using string for date
}
