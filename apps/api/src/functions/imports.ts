import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { query } from "../lib/db/client";

// A temporary in-memory store to simulate blob storage for file content
export const fileContentStore: Record<string, string> = {};

// POST /api/v1/imports/production
export async function importProductionCsv(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const csvString = await request.text();
        if (!csvString) {
            return { status: 400, jsonBody: { error: "Request body cannot be empty." } };
        }

        // Create a job record in the database
        const jobResult = await query(
            `INSERT INTO report_jobs (type, status) VALUES ('production_import', 'pending') RETURNING id`
        );
        const jobId = jobResult.rows[0].id;

        // Store the file content for the worker to process
        fileContentStore[jobId] = csvString;

        // Return the job ID to the client
        return {
            status: 202, // Accepted
            jsonBody: {
                message: "Import job accepted. Poll the job status endpoint for progress.",
                jobId: jobId,
            }
        };

    } catch (error) {
        context.log('Error creating import job:', error);
        return { status: 500, body: "Internal Server Error" };
    }
}

app.http('importProductionCsv', {
    methods: ['POST'],
    route: 'v1/imports/production',
    authLevel: 'anonymous',
    handler: importProductionCsv
});
