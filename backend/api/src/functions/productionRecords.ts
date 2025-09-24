import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { query } from "../lib/db/client";
import { ProductionRecord } from "@my-farm/domain";

// GET /api/v1/production-records
export async function getProductionRecords(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const { speciesId, groupId, animalId, eventType, from, to } = request.query;

        let queryString = 'SELECT * FROM production_records';
        const params: string[] = [];
        const conditions: string[] = [];

        if (speciesId) { params.push(speciesId as string); conditions.push(`species_id = $${params.length}`); }
        if (groupId) { params.push(groupId as string); conditions.push(`group_id = $${params.length}`); }
        if (animalId) { params.push(animalId as string); conditions.push(`animal_id = $${params.length}`); }
        if (eventType) { params.push(eventType as string); conditions.push(`event_type = $${params.length}`); }
        if (from) { params.push(from as string); conditions.push(`date >= $${params.length}`); }
        if (to) { params.push(to as string); conditions.push(`date <= $${params.length}`); }

        if (conditions.length > 0) {
            queryString += ' WHERE ' + conditions.join(' AND ');
        }
        queryString += ' ORDER BY date DESC';

        const result = await query(queryString, params);
        return { jsonBody: result.rows };
    } catch (error) {
        context.log('Error fetching production records:', error);
        return { status: 500, body: "Internal Server Error" };
    }
}

// POST /api/v1/production-records
export async function createProductionRecord(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const record = await request.json() as any;

        // Basic validation
        if (!record.species_id || !record.event_type || !record.date) {
            return { status: 400, jsonBody: { error: "species_id, event_type, and date are required." } };
        }

        const {
            species_id, animal_id, group_id, event_type, event_subtype, date,
            quantity, unit, weight_value, weight_unit, egg_count, milk_volume, milk_unit,
            notes, source_imported, source_origin, created_by
        } = record;

        const result = await query(
            `INSERT INTO production_records (
                species_id, animal_id, group_id, event_type, event_subtype, date,
                quantity, unit, weight_value, weight_unit, egg_count, milk_volume, milk_unit,
                notes, source_imported, source_origin, created_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`,
            [
                species_id, animal_id, group_id, event_type, event_subtype, date,
                quantity, unit, weight_value, weight_unit, egg_count, milk_volume, milk_unit,
                notes, source_imported, source_origin, created_by
            ]
        );

        return { status: 201, jsonBody: result.rows[0] };
    } catch (error) {
        context.log('Error creating production record:', error);
        if ((error as any).code === '23503') {
            return { status: 400, jsonBody: { error: "Invalid species_id, group_id, or animal_id." } };
        }
        return { status: 500, body: "Internal Server Error" };
    }
}

// PATCH /api/v1/production-records/{id}
export async function updateProductionRecord(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    const recordId = request.params.id;
    if (!recordId) {
        return { status: 400, jsonBody: { error: "Record ID is required." } };
    }

    try {
        const record = await request.json() as any;

        // For simplicity, this example updates all possible fields.
        // A more robust implementation would build the SET clause dynamically.
        const { date, quantity, unit, weight_value, weight_unit, egg_count, milk_volume, milk_unit, notes } = record;

        const result = await query(
            `UPDATE production_records
             SET date = $1, quantity = $2, unit = $3, weight_value = $4, weight_unit = $5,
                 egg_count = $6, milk_volume = $7, milk_unit = $8, notes = $9
             WHERE id = $10 RETURNING *`,
            [date, quantity, unit, weight_value, weight_unit, egg_count, milk_volume, milk_unit, notes, recordId]
        );

        if (result.rowCount === 0) {
            return { status: 404, jsonBody: { error: "Record not found." } };
        }

        return { jsonBody: result.rows[0] };
    } catch (error) {
        context.log(`Error updating record ${recordId}:`, error);
        return { status: 500, body: "Internal Server Error" };
    }
}


app.http('getProductionRecords', {
    methods: ['GET'],
    route: 'v1/production-records',
    authLevel: 'anonymous',
    handler: getProductionRecords
});

app.http('createProductionRecord', {
    methods: ['POST'],
    route: 'v1/production-records',
    authLevel: 'anonymous',
    handler: createProductionRecord
});

app.http('updateProductionRecord', {
    methods: ['PATCH'],
    route: 'v1/production-records/{id}',
    authLevel: 'anonymous',
    handler: updateProductionRecord
});
