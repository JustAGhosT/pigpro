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
} from '@my-farm/domain';
import { randomUUID } from 'node:crypto';

// --- Seed Data ---
// This data provides a realistic starting point for development and testing.

const goatSpeciesId = randomUUID();
const cattleSpeciesId = randomUUID();
const sheepSpeciesId = randomUUID();
const pigSpeciesId = randomUUID();
const poultrySpeciesId = randomUUID();

export const speciesDb: Species[] = [
  { id: goatSpeciesId, name: 'Goat', is_dairy: true, is_ruminant: true, created_at: new Date().toISOString() },
  { id: cattleSpeciesId, name: 'Cattle', is_dairy: true, is_ruminant: true, created_at: new Date().toISOString() },
  { id: sheepSpeciesId, name: 'Sheep', is_dairy: false, is_ruminant: true, created_at: new Date().toISOString() },
  { id: pigSpeciesId, name: 'Pig', is_dairy: false, is_ruminant: false, created_at: new Date().toISOString() },
  { id: poultrySpeciesId, name: 'Poultry', is_dairy: false, is_ruminant: false, created_at: new Date().toISOString() },
  { id: randomUUID(), name: 'Rabbit', is_dairy: false, is_ruminant: false, created_at: new Date().toISOString() },
];

const dairyGoatsGroupId = randomUUID();
const beefCattleGroupId = randomUUID();

export const groupsDb: Group[] = [
  { id: dairyGoatsGroupId, name: 'Dairy Goats', species_id: goatSpeciesId, location_id: 'loc-1', tags: ['milking', 'kidding-2024'], active: true },
  { id: beefCattleGroupId, name: 'Pastured Beef Cattle', species_id: cattleSpeciesId, location_id: 'loc-2', tags: ['rotation-3'], active: true },
];

export const animalsDb: Animal[] = [
    { id: randomUUID(), external_id: 'G-001', species_id: goatSpeciesId, group_id: dairyGoatsGroupId, sex: 'female', dob: '2022-04-10T00:00:00Z', status: 'active', tags: ['alpha', 'good-milker'] },
    { id: randomUUID(), external_id: 'G-002', species_id: goatSpeciesId, group_id: dairyGoatsGroupId, sex: 'female', dob: '2023-03-15T00:00:00Z', status: 'active', tags: [] },
    { id: randomUUID(), external_id: 'C-001', species_id: cattleSpeciesId, group_id: beefCattleGroupId, sex: 'male', dob: '2023-08-20T00:00:00Z', status: 'active', tags: ['bull'] }
];

export const productionRecordsDb: ProductionRecord[] = [];
export const financialTransactionsDb: FinancialTransaction[] = [];

const feedCategoryId = randomUUID();
const vetCategoryId = randomUUID();
const laborCategoryId = randomUUID();
const milkSalesCategoryId = randomUUID();
const animalSalesCategoryId = randomUUID();

export const categoriesDb: Category[] = [
    { id: feedCategoryId, name: 'Feed', type: 'expense', is_active: true },
    { id: vetCategoryId, name: 'Veterinary', type: 'expense', is_active: true },
    { id: laborCategoryId, name: 'Labor', type: 'expense', is_active: true },
    { id: randomUUID(), name: 'Utilities', type: 'expense', is_active: true },
    { id: randomUUID(), name: 'Equipment', type: 'expense', is_active: true },
    { id: randomUUID(), name: 'Housing', type: 'expense', is_active: true },
    { id: randomUUID(), name: 'Transport', type: 'expense', is_active: true },
    { id: milkSalesCategoryId, name: 'Milk Sales', type: 'income', is_active: true },
    { id: animalSalesCategoryId, name: 'Animal Sales', type: 'income', is_active: true },
    { id: randomUUID(), name: 'Grants', type: 'income', is_active: true },
    { id: randomUUID(), name: 'Other', type: 'income', is_active: true },
];

export const fxRatesDb: FxRate[] = [
    { id: randomUUID(), date: new Date().toISOString(), currency: 'USD', rate_to_base: 1.0 },
    { id: randomUUID(), date: new Date().toISOString(), currency: 'EUR', rate_to_base: 1.08 },
    { id: randomUUID(), date: new Date().toISOString(), currency: 'ZAR', rate_to_base: 0.053 },
];

// These are typically generated, so they start empty.
export const analyticsSnapshotsDb: AnalyticsSnapshot[] = [];
export const reportJobsDb: ReportJob[] = [];
