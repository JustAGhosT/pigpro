import {
  Species,
  Group,
  Animal,
  ProductionRecord,
  FinancialTransaction,
  Category,
  FxRate,
  AnalyticsSnapshot,
  ReportJob,
} from '../types/domain-v2';
import { randomUUID } from 'node:crypto';

// Seed data for initial testing

const goatSpeciesId = randomUUID();
const cattleSpeciesId = randomUUID();

export const speciesDb: Species[] = [
  { id: goatSpeciesId, name: 'Goat', is_dairy: true, is_ruminant: true, created_at: new Date().toISOString() },
  { id: cattleSpeciesId, name: 'Cattle', is_dairy: true, is_ruminant: true, created_at: new Date().toISOString() },
  { id: randomUUID(), name: 'Sheep', is_dairy: false, is_ruminant: true, created_at: new Date().toISOString() },
  { id: randomUUID(), name: 'Pig', is_dairy: false, is_ruminant: false, created_at: new Date().toISOString() },
  { id: randomUUID(), name: 'Chicken', is_dairy: false, is_ruminant: false, created_at: new Date().toISOString() },
];

export const groupsDb: Group[] = [
  { id: randomUUID(), name: 'Dairy Goats', species_id: goatSpeciesId, location_id: 'loc-1', tags: ['milking'], active: true },
  { id: randomUUID(), name: 'Beef Cattle', species_id: cattleSpeciesId, location_id: 'loc-2', tags: ['pasture'], active: true },
];

export const animalsDb: Animal[] = [
    { id: randomUUID(), external_id: 'GT-001', species_id: goatSpeciesId, sex: 'female', status: 'active', tags: ['alpha'] },
    { id: randomUUID(), external_id: 'CT-001', species_id: cattleSpeciesId, sex: 'male', status: 'active', tags: [] }
];

export const productionRecordsDb: ProductionRecord[] = [];
export const financialTransactionsDb: FinancialTransaction[] = [];

export const categoriesDb: Category[] = [
    { id: randomUUID(), name: 'Feed', type: 'expense', is_active: true },
    { id: randomUUID(), name: 'Veterinary', type: 'expense', is_active: true },
    { id: randomUUID(), name: 'Labor', type: 'expense', is_active: true },
    { id: randomUUID(), name: 'Milk Sales', type: 'income', is_active: true },
    { id: randomUUID(), name: 'Animal Sales', type: 'income', is_active: true },
];

export const fxRatesDb: FxRate[] = [
    { id: randomUUID(), date: new Date().toISOString(), currency: 'USD', rate_to_base: 1.0 },
    { id: randomUUID(), date: new Date().toISOString(), currency: 'EUR', rate_to_base: 1.1 },
    { id: randomUUID(), date: new Date().toISOString(), currency: 'ZAR', rate_to_base: 0.065 },
];

export const analyticsSnapshotsDb: AnalyticsSnapshot[] = [];
export const reportJobsDb: ReportJob[] = [];
