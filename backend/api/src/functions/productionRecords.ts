import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { randomUUID } from "node:crypto";
import { productionRecordsDb } from "../lib/inMemoryDb";
import { ProductionRecord } from "../types/domain";

// GET /api/v1/production-records
export async function getProductionRecords(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        // Return all records from the in-memory db
        return {
            status: 200,
            jsonBody: productionRecordsDb
        };
    } catch (error) {
        context.log('Error fetching production records:', error);
        return {
            status: 500,
            body: "Internal Server Error"
        };
    }
}

// POST /api/v1/production-records
export async function createProductionRecord(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        const newRecordData = await request.json() as Omit<ProductionRecord, 'id' | 'created_at'>;

        // Basic validation
        if (!newRecordData || !newRecordData.species_id || !newRecordData.event_type || !newRecordData.date) {
            return {
                status: 400,
                jsonBody: { error: "Missing required fields: species_id, event_type, date are required." }
            };
        }

        const newRecord: ProductionRecord = {
            id: randomUUID(),
            created_at: new Date(),
            ...newRecordData
        };

        productionRecordsDb.push(newRecord);

        return {
            status: 201,
            jsonBody: newRecord
        };
    } catch (error) {
        if (error instanceof SyntaxError) {
            return { status: 400, jsonBody: { error: "Invalid JSON in request body." } };
        }
        context.log('Error creating production record:', error);
        return {
            status: 500,
            body: "Internal Server Error"
        };
    }
}


app.http('getProductionRecords', {
    methods: ['GET'],
    route: 'api/v1/production-records',
    authLevel: 'anonymous',
    handler: getProductionRecords
});

app.http('createProductionRecord', {
    methods: ['POST'],
    route: 'api/v1/production-records',
    authLevel: 'anonymous',
    handler: createProductionRecord
});
