import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { query } from "../lib/db/client";

// GET /api/v1/reports/cohort/{groupId}
export async function getCohortReport(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        const groupId = request.params.groupId;
        if (!groupId) {
            return { status: 400, jsonBody: { error: "A groupId is required." } };
        }

        const groupResult = await query('SELECT * FROM groups WHERE id = $1', [groupId]);
        if (groupResult.rowCount === 0) {
            return { status: 404, jsonBody: { error: "Group not found." } };
        }
        const group = groupResult.rows[0];

        // --- Gather all events for this cohort ---
        const prodQuery = 'SELECT * FROM production_records WHERE group_id = $1';
        const finQuery = 'SELECT * FROM financial_transactions WHERE group_id = $1';
        const animalsQuery = 'SELECT * FROM animals WHERE group_id = $1';

        const [prodResult, finResult, animalsResult] = await Promise.all([
            query(prodQuery, [groupId]),
            query(finQuery, [groupId]),
            query(animalsQuery, [groupId])
        ]);

        const allEvents = [
            ...prodResult.rows.map(e => ({ ...e, type: 'production' })),
            ...finResult.rows.map(e => ({ ...e, type: 'financial' }))
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // --- Calculate cohort-level KPIs ---
        const totalCost = finResult.rows
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.base_amount_cached), 0);

        const totalRevenue = finResult.rows
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + parseFloat(t.base_amount_cached), 0);

        const cohortSummary = {
            groupName: group.name,
            animalCount: animalsResult.rowCount,
            totalCost,
            totalRevenue,
            netProfit: totalRevenue - totalCost,
        };

        const report = {
            summary: cohortSummary,
            timeline: allEvents,
        };

        return { jsonBody: report };

    } catch (error) {
        context.log('Error generating cohort report:', error);
        return { status: 500, body: "Internal Server Error" };
    }
}


app.http('getCohortReport', {
    methods: ['GET'],
    route: 'v1/reports/cohort/{groupId}',
    authLevel: 'anonymous',
    handler: getCohortReport
});
