export interface Species {
  id: string;
  name: string;
  is_dairy: boolean;
  is_ruminant: boolean;
  created_at: string;
}

export interface Group {
  id: string;
  name: string;
  species_id: string;
  location_id: string; // Assuming location is managed elsewhere
  tags: string[];
  active: boolean;
}

export interface Animal {
  id: string;
  external_id?: string;
  species_id: string;
  group_id?: string;
  sex: 'male' | 'female' | 'unknown';
  dob?: string;
  status: 'active' | 'sold' | 'dead' | 'culled';
  tags: string[];
}

export type ProductionEvent =
  | 'birth'
  | 'death'
  | 'weight'
  | 'egg_count'
  | 'milk_volume'
  | 'sale'
  | 'purchase'
  | 'feed_intake'
  | 'cull'
  | 'treatment'
  | 'transfer'
  | 'grazing_move';

export interface ProductionRecord {
  id: string;
  species_id: string;
  animal_id?: string;
  group_id?: string;
  event_type: ProductionEvent;
  event_subtype?: string;
  date: string;
  quantity?: number;
  unit?: string;
  weight_value?: number;
  weight_unit?: 'kg' | 'lb';
  egg_count?: number;
  milk_volume?: number;
  milk_unit?: 'L' | 'gal';
  notes?: string;
  attachments: string[]; // URLs
  source: {
    imported: boolean;
    origin?: string;
    file_id?: string;
  };
  created_by: string; // User ID
  created_at: string;
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
  date: string;
  vendor_or_buyer?: string;
  memo?: string;
  attachments: string[]; // URLs
  created_by: string; // User ID
  created_at: string;
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
  date: string;
  currency: string;
  rate_to_base: number;
}

export interface AnalyticsSnapshot {
  id:string;
  period_start: string;
  period_end: string;
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
  generated_at: string;
}

export interface ReportJob {
  id: string;
  type: 'investor_pdf' | 'csv_export';
  params_json: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  uri?: string; // URL to the generated report
  requested_by: string; // User ID
  created_at: string;
}
