import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { query } from "../lib/db/client";

// GET /api/v1/jobs/{id}
export async function getJobStatus(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        const jobId = request.params.id;
        if (!jobId) {
            return { status: 400, jsonBody: { error: "A jobId is required." } };
        }

        const result = await query('SELECT * FROM report_jobs WHERE id = $1', [jobId]);

        if (result.rowCount === 0) {
            return { status: 404, jsonBody: { error: "Job not found." } };
        }

        return { status: 200, jsonBody: result.rows[0] };

    } catch (error) {
        context.log('Error fetching job status:', error);
        return { status: 500, body: "Internal Server Error" };
    }
}


app.http('getJobStatus', {
    methods: ['GET'],
    route: 'v1/jobs/{id}',
    authLevel: 'anonymous',
    handler: getJobStatus
});
