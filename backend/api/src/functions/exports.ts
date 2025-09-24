import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { productionRecordsDb, financialTransactionsDb } from "../lib/inMemoryDb";
import Papa from "papaparse";

// GET /api/v1/export/production.csv
export async function exportProductionCsv(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const csv = Papa.unparse(productionRecordsDb);
        return {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename="production_export.csv"'
            },
            body: csv
        };
    } catch (error) {
        context.log('Error exporting production CSV:', error);
        return { status: 500, body: "Internal Server Error" };
    }
}

// GET /api/v1/export/financials.csv
export async function exportFinancialsCsv(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const csv = Papa.unparse(financialTransactionsDb);
        return {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename="financials_export.csv"'
            },
            body: csv
        };
    } catch (error) {
        context.log('Error exporting financials CSV:', error);
        return { status: 500, body: "Internal Server Error" };
    }
}


app.http('exportProductionCsv', {
    methods: ['GET'],
    route: 'v1/export/production.csv',
    authLevel: 'anonymous',
    handler: exportProductionCsv
});

app.http('exportFinancialsCsv', {
    methods: ['GET'],
    route: 'v1/export/financials.csv',
    authLevel: 'anonymous',
    handler: exportFinancialsCsv
});
