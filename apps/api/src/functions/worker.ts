import { app, InvocationContext, Timer } from "@azure/functions";
import { query } from "../lib/db/client";
import { fileContentStore } from "./imports"; // To get the CSV content
import Papa from "papaparse";
import { PDFDocument, StandardFonts } from "pdf-lib";

// This function simulates a background worker processing one job at a time.
export async function processJobQueue(myTimer: Timer, context: InvocationContext): Promise<void> {
    context.log('Timer function processed request.');

    // 1. Find a pending job
    const pendingJobResult = await query(
        `SELECT * FROM report_jobs WHERE status = 'pending' ORDER BY created_at ASC LIMIT 1`
    );

    if (pendingJobResult.rowCount === 0) {
        context.log('No pending jobs to process.');
        return;
    }
    const job = pendingJobResult.rows[0];

    // 2. Set job status to 'running'
    await query(`UPDATE report_jobs SET status = 'running' WHERE id = $1`, [job.id]);
    context.log(`Processing job ${job.id} of type ${job.type}`);

    try {
        // 3. Execute the job based on its type
        if (job.type === 'production_import') {
            const csvString = fileContentStore[job.id];
            if (!csvString) throw new Error('File content not found for job.');

            const { data } = Papa.parse(csvString, { header: true, skipEmptyLines: true });

            // In a real transaction, you'd use a transaction block
            for (const _ of data as any[]) {
                await query(
                    `INSERT INTO production_records (species_id, event_type, date, ...) VALUES (...)`,
                    // ...params
                );
            }
            delete fileContentStore[job.id]; // Clean up
        }
        else if (job.type === 'investor_report') {
            // The actual PDF generation logic from the old synchronous endpoint
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage();
            page.drawText('This is your asynchronously generated report!', { x: 50, y: 700, font: await pdfDoc.embedFont(StandardFonts.Helvetica), size: 16 });
            await pdfDoc.save();

            // In a real app, you would upload `pdfBytes` to blob storage and get a URL.
            // Here, we'll just simulate it.
            const reportUri = `/api/v1/reports/download/${job.id}`; // A fake download link
            await query(`UPDATE report_jobs SET uri = $1 WHERE id = $2`, [reportUri, job.id]);
        }

        // 4. Set job status to 'completed'
        await query(`UPDATE report_jobs SET status = 'completed' WHERE id = $1`, [job.id]);
        context.log(`Job ${job.id} completed successfully.`);

    } catch (error) {
        context.log(`Error processing job ${job.id}:`, error);
        // 5. Set job status to 'failed'
        await query(`UPDATE report_jobs SET status = 'failed' WHERE id = $1`, [job.id]);
    }
}

// Run this worker every 30 seconds
app.timer('processJobQueue', {
    schedule: '*/30 * * * * *',
    handler: processJobQueue
});
