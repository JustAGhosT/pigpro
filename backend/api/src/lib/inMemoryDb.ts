import { Animal, Category, FinancialTransaction, Group, ProductionRecord } from '../types/domain';

/**
 * A temporary in-memory store for all our domain data.
 * This will be replaced by a proper database connection in the future.
 */

export const productionRecordsDb: ProductionRecord[] = [];

export const groupsDb: Group[] = [
    { id: 'group-1', name: 'Breeding Goats', species_id: '1', location_id: 'loc-1', tags: ['breeding'], active: true },
    { id: 'group-2', name: 'Layer Hens - Cohort A', species_id: '5', location_id: 'loc-2', tags: ['egg-layers'], active: true },
];

export const animalsDb: Animal[] = [];

export const financialTransactionsDb: FinancialTransaction[] = [];

export const categoriesDb: Category[] = [
    { id: 'cat-1', name: 'Feed', type: 'expense', is_active: true },
    { id: 'cat-2', name: 'Veterinary', type: 'expense', is_active: true },
    { id: 'cat-3', name: 'Labor', type: 'expense', is_active: true },
    { id: 'cat-4', name: 'Utilities', type: 'expense', is_active: true },
    { id: 'cat-5', name: 'Equipment', type: 'expense', is_active: true },
    { id: 'cat-6', name: 'Housing', type: 'expense', is_active: true },
    { id: 'cat-7', name: 'Transport', type: 'expense', is_active: true },
    { id: 'cat-8', name: 'Sales', type: 'income', is_active: true },
    { id: 'cat-9', name: 'Grants', type: 'income', is_active: true },
    { id: 'cat-10', name: 'Other', type: 'income', is_active: true },
];

export const reportJobsDb: any[] = [];
