import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { query } from "../lib/db/client";
import { getUserTier } from "../lib/auth";

// POST /api/v1/reports/investor
export async function generateInvestorReport(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const userTier = getUserTier();
        if (userTier === 'free') {
            return { status: 403, jsonBody: { error: "Investor reports are a premium feature. Please upgrade." } };
        }

        const params = await request.json().catch(() => ({})); // Allow empty body

        // Create a job record in the database
        const jobResult = await query(
            `INSERT INTO report_jobs (type, status, params_json) VALUES ('investor_report', 'pending', $1) RETURNING id`,
            [params]
        );
        const jobId = jobResult.rows[0].id;

        return {
            status: 202, // Accepted
            jsonBody: {
                message: "Report generation job accepted. Poll the job status endpoint for progress.",
                jobId: jobId,
            }
        };
    } catch (error) {
        context.log('Error creating report job:', error);
        return { status: 500, body: "Internal Server Error" };
    }
}

// GET /api/v1/reports/p-and-l
export async function getPLReport(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const { from, to } = request.query;
        if (!from || !to) {
            return { status: 400, jsonBody: { error: "'from' and 'to' date query parameters are required." } };
        }

        const queryStr = `
            SELECT
                c.name as "categoryName",
                tx.type,
                SUM(tx.base_amount_cached) as "total"
            FROM financial_transactions tx
            JOIN categories c ON tx.category_id = c.id
            WHERE tx.date >= $1 AND tx.date <= $2
            GROUP BY c.name, tx.type;
        `;
        const result = await query(queryStr, [from, to]);

        const incomeByCategory: Record<string, number> = {};
        const expenseByCategory: Record<string, number> = {};
        let totalIncome = 0;
        let totalExpense = 0;

        result.rows.forEach(row => {
            const amount = parseFloat(row.total);
            if (row.type === 'income') {
                incomeByCategory[row.categoryName] = amount;
                totalIncome += amount;
            } else {
                expenseByCategory[row.categoryName] = amount;
                totalExpense += amount;
            }
        });

        const report = {
            period: { from, to },
            income: { total: totalIncome, byCategory: incomeByCategory },
            expense: { total: totalExpense, byCategory: expenseByCategory },
            netProfit: totalIncome - totalExpense,
        };
        return { jsonBody: report };
    } catch (error) {
        context.log('Error generating P&L report:', error);
        return { status: 500, body: "Internal Server Error" };
    }
}

app.http('generateInvestorReport', {
    methods: ['POST'],
    route: 'v1/reports/investor',
    authLevel: 'anonymous',
    handler: generateInvestorReport
});

app.http('getPLReport', {
    methods: ['GET'],
    route: 'v1/reports/p-and-l',
    authLevel: 'anonymous',
    handler: getPLReport
});
