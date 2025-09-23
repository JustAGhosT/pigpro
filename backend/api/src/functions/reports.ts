import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { randomUUID } from "node:crypto";
import { reportJobsDb } from "../lib/inMemoryDb";
import { ReportJob } from "../types/domain";

// POST /api/v1/reports/investor
export async function createInvestorReport(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        const params = await request.json();

        const newJob: ReportJob = {
            id: randomUUID(),
            type: 'investor_pdf',
            status: 'pending',
            params_json: JSON.stringify(params),
            requested_by: 'user-1', // In a real app, this would come from auth
            created_at: new Date(),
        };

        reportJobsDb.push(newJob);

        // In a real app, this would trigger a background worker.
        // We'll simulate a delay and then update the job status.
        setTimeout(() => {
            const jobIndex = reportJobsDb.findIndex(j => j.id === newJob.id);
            if (jobIndex !== -1) {
                reportJobsDb[jobIndex].status = 'completed';
                reportJobsDb[jobIndex].uri = `/reports/investor-report-${newJob.id}.pdf`;
                context.log(`Report job ${newJob.id} completed.`);
            }
        }, 10000); // Simulate a 10-second report generation time

        return {
            status: 202, // Accepted
            jsonBody: { jobId: newJob.id, message: "Report generation started." }
        };

    } catch (error) {
        context.log('Error creating investor report job:', error);
        return { status: 500, body: "Internal Server Error" };
    }
}

// GET /api/v1/jobs/{id}
export async function getJobStatus(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    const jobId = request.params.id;

    if (!jobId) {
        return { status: 400, jsonBody: { error: "Job ID is required in the URL." } };
    }

    const job = reportJobsDb.find(j => j.id === jobId);

    if (!job) {
        return { status: 404, jsonBody: { error: "Job not found." } };
    }

    return { jsonBody: job };
}


app.http('createInvestorReport', {
    methods: ['POST'],
    route: 'api/v1/reports/investor',
    authLevel: 'anonymous',
    handler: createInvestorReport
});

app.http('getJobStatus', {
    methods: ['GET'],
    route: 'api/v1/jobs/{id}',
    authLevel: 'anonymous',
    handler: getJobStatus
});
