import { ProductionRecord } from '../types/domain';

/**
 * A temporary in-memory store for production records.
 * This will be replaced by a proper database connection in the future.
 */
export const productionRecordsDb: ProductionRecord[] = [];
