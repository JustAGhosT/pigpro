// backend/api/src/types/domain.ts

export interface Species {
  id: string;
  name: string;
  is_dairy: boolean;
  is_ruminant: boolean;
  created_at: Date;
}

export interface Group {
  id: string;
  name: string;
  species_id: string;
  location_id: string;
  tags: string[];
  active: boolean;
}

export interface Animal {
  id: string;
  external_id?: string;
  species_id: string;
  group_id?: string;
  sex: 'male' | 'female' | 'unknown';
  dob?: Date;
  status: 'active' | 'sold' | 'dead' | 'culled';
  tags: string[];
}

export interface ProductionRecord {
  id: string;
  species_id: string;
  animal_id?: string;
  group_id?: string;
  event_type: 'birth' | 'death' | 'weight' | 'egg_count' | 'milk_volume' | 'sale' | 'purchase' | 'feed_intake' | 'cull' | 'treatment' | 'transfer' | 'grazing_move';
  event_subtype?: string;
  date: Date;
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
  created_at: Date;
}

export interface FinancialTransaction {
  id: string;
  species_id?: string;
  group_id?: string;
  category_id: string;
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  fx_rate_to_base: number;
  base_amount_cached: number;
  date: Date;
  vendor_or_buyer?: string;
  memo?: string;
  attachments: string[]; // URLs to attachments
  created_by: string; // User ID
  created_at: Date;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  parent_id?: string;
  is_active: boolean;
}

export interface FxRate {
  id: string;
  date: Date;
  currency: string;
  rate_to_base: number;
}

export interface AnalyticsSnapshot {
  id:string;
  period_start: Date;
  period_end: Date;
  species_id?: string;
  group_id?: string;
  kpis: {
    adg?: number;
    mortality?: number;
    egg_per_hen_day?: number;
    litter_size?: number;
    milk_per_animal?: number;
    revenue: number;
    expense: number;
    profit: number;
    profit_per_unit?: number;
  };
  generated_at: Date;
}

export interface ReportJob {
  id: string;
  type: 'investor_pdf' | 'csv_export';
  params_json: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  uri?: string; // URL to the generated report
  requested_by: string; // User ID
  created_at: Date;
}
