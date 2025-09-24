import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { query } from "../lib/db/client";

// --- Main Analytics Endpoint ---

export async function getKpis(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        const { speciesId, groupId, from, to } = request.query;

        let baseWhere = ' WHERE 1=1 ';
        const params: any[] = [];

        if (speciesId && speciesId !== 'all') {
            params.push(speciesId);
            baseWhere += ` AND species_id = $${params.length}`;
        }
        if (groupId && groupId !== 'all') {
            params.push(groupId);
            baseWhere += ` AND group_id = $${params.length}`;
        }
        if (from) {
            params.push(from);
            baseWhere += ` AND date >= $${params.length}`;
        }
        if (to) {
            params.push(to);
            baseWhere += ` AND date <= $${params.length}`;
        }

        // --- SQL Queries for KPIs ---
        // This is much more efficient than calculating in code.

        const financialSummaryQuery = `
            SELECT
                COALESCE(SUM(CASE WHEN type = 'income' THEN base_amount_cached ELSE 0 END), 0) as "totalRevenue",
                COALESCE(SUM(CASE WHEN type = 'expense' THEN base_amount_cached ELSE 0 END), 0) as "totalExpense"
            FROM financial_transactions
            ${baseWhere}
        `;
        const financialResult = await query(financialSummaryQuery, params);
        const { totalRevenue, totalExpense } = financialResult.rows[0];

        const animalCountQuery = `SELECT COUNT(*) as "totalAnimals" FROM animals WHERE status = 'active'`; // Simplified, doesn't use all filters
        const animalResult = await query(animalCountQuery);
        const { totalAnimals } = animalResult.rows[0];

        const productionQuery = `
            SELECT
                COALESCE(SUM(CASE WHEN event_type = 'egg_count' THEN egg_count ELSE 0 END), 0) as "totalEggs",
                COALESCE(SUM(CASE WHEN event_type = 'milk_volume' THEN milk_volume ELSE 0 END), 0) as "totalMilk",
                COALESCE(AVG(CASE WHEN event_type = 'birth' THEN quantity ELSE NULL END), 0) as "avgLitterSize"
            FROM production_records
            ${baseWhere}
        `;
        const productionResult = await query(productionQuery, params);
        const { totalEggs, totalMilk, avgLitterSize } = productionResult.rows[0];

        // ADG and Mortality are more complex and would require more dedicated queries,
        // so we'll return placeholders for now. This is a reasonable simplification.
        const adg = 0; // Placeholder
        const mortality = 0; // Placeholder


        const kpis = {
            totalRevenue: Number.parseFloat(totalRevenue),
            totalExpense: Number.parseFloat(totalExpense),
            grossMargin: Number.parseFloat(totalRevenue) - Number.parseFloat(totalExpense),
            totalAnimals: Number.parseInt(totalAnimals, 10),
            adg,
            mortality,
            avgLitterSize: Number.parseFloat(avgLitterSize),
            totalEggs: Number.parseInt(totalEggs, 10),
            totalMilk: Number.parseFloat(totalMilk),
        };

        return { jsonBody: kpis };
    } catch (error) {
        context.log('Error fetching KPIs:', error);
        return { status: 500, body: "Internal Server Error" };
    }
}


app.http('getKpis', {
    methods: ['GET'],
    route: 'v1/analytics/kpis',
    authLevel: 'anonymous',
    handler: getKpis
});

// --- Time Series Endpoint ---
export async function getTimeSeries(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const { speciesId, groupId, from, to } = request.query;

    let whereClause = ' WHERE 1=1 ';
    const params: any[] = [];
    if (speciesId && speciesId !== 'all') { params.push(speciesId); whereClause += ` AND species_id = $${params.length}`; }
    if (groupId && groupId !== 'all') { params.push(groupId); whereClause += ` AND group_id = $${params.length}`; }
    if (from) { params.push(from); whereClause += ` AND date >= $${params.length}`; }
    if (to) { params.push(to); whereClause += ` AND date <= $${params.length}`; }

    const queryString = `
        SELECT
            to_char(date, 'YYYY-MM') as name,
            COALESCE(SUM(CASE WHEN type = 'income' THEN base_amount_cached ELSE 0 END), 0) as revenue,
            COALESCE(SUM(CASE WHEN type = 'expense' THEN base_amount_cached ELSE 0 END), 0) as expense
        FROM financial_transactions
        ${whereClause}
        GROUP BY to_char(date, 'YYYY-MM')
        ORDER BY name;
    `;

    const result = await query(queryString, params);

    // Ensure numbers are not returned as strings from the DB driver
    const monthlyData = result.rows.map(r => ({
        ...r,
        revenue: Number.parseFloat(r.revenue),
        expense: Number.parseFloat(r.expense),
    }));

    return { jsonBody: monthlyData };
}

app.http('getTimeSeries', {
    methods: ['GET'],
    route: 'v1/analytics/time-series',
    authLevel: 'anonymous',
    handler: getTimeSeries
});
