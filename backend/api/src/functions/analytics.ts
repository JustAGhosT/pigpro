import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { financialTransactionsDb } from "../lib/inMemoryDb";

// GET /api/v1/analytics/kpis
export async function getKpis(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        const totalRevenue = financialTransactionsDb
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.base_amount_cached, 0);

        const totalExpense = financialTransactionsDb
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.base_amount_cached, 0);

        const grossMargin = totalRevenue - totalExpense;

        // In the future, we can add more complex KPIs here based on production data
        const kpis = {
            totalRevenue,
            totalExpense,
            grossMargin,
            // Example of future KPI
            // profitPerUnit: 25.50,
        };

        return { jsonBody: kpis };
    } catch (error) {
        context.log('Error calculating KPIs:', error);
        return { status: 500, body: "Internal Server Error" };
    }
}

app.http('getKpis', {
    methods: ['GET'],
    route: 'api/v1/analytics/kpis',
    authLevel: 'anonymous',
    handler: getKpis
});
