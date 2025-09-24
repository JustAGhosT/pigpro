import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { query } from "../lib/db/client";
import { FinancialTransaction } from "@my-farm/domain";

// GET /api/v1/financial-transactions
export async function getFinancialTransactions(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const { categoryId, speciesId, groupId, from, to, currency } = request.query;

        let queryString = 'SELECT * FROM financial_transactions';
        const params: string[] = [];
        const conditions: string[] = [];

        if (categoryId) { params.push(categoryId as string); conditions.push(`category_id = $${params.length}`); }
        if (speciesId) { params.push(speciesId as string); conditions.push(`species_id = $${params.length}`); }
        if (groupId) { params.push(groupId as string); conditions.push(`group_id = $${params.length}`); }
        if (from) { params.push(from as string); conditions.push(`date >= $${params.length}`); }
        if (to) { params.push(to as string); conditions.push(`date <= $${params.length}`); }
        if (currency) { params.push(currency as string); conditions.push(`currency = $${params.length}`); }

        if (conditions.length > 0) {
            queryString += ' WHERE ' + conditions.join(' AND ');
        }
        queryString += ' ORDER BY date DESC';

        const result = await query(queryString, params);
        return { jsonBody: result.rows };
    } catch (error) {
        context.log('Error fetching financial transactions:', error);
        return { status: 500, body: "Internal Server Error" };
    }
}

// POST /api/v1/financial-transactions
export async function createFinancialTransaction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const tx = await request.json() as any;
        if (!tx.category_id || !tx.type || !tx.amount || !tx.currency || !tx.date) {
            return { status: 400, jsonBody: { error: "category_id, type, amount, currency, and date are required." } };
        }

        // In a real app, you'd look up the FX rate. For now, we'll assume it's 1 if not provided.
        const fx_rate_to_base = tx.fx_rate_to_base || 1.0;
        const base_amount_cached = tx.amount * fx_rate_to_base;

        const result = await query(
            `INSERT INTO financial_transactions (
                species_id, group_id, category_id, type, amount, currency,
                fx_rate_to_base, base_amount_cached, date, vendor_or_buyer, memo, created_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
            [
                tx.species_id, tx.group_id, tx.category_id, tx.type, tx.amount, tx.currency,
                fx_rate_to_base, base_amount_cached, tx.date, tx.vendor_or_buyer, tx.memo, tx.created_by
            ]
        );

        return { status: 201, jsonBody: result.rows[0] };
    } catch (error) {
        context.log('Error creating financial transaction:', error);
        if ((error as any).code === '23503') {
            return { status: 400, jsonBody: { error: "Invalid category_id, species_id, or group_id." } };
        }
        return { status: 500, body: "Internal Server Error" };
    }
}

// PATCH /api/v1/financial-transactions/{id}
export async function updateFinancialTransaction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    const txId = request.params.id;
    if (!txId) {
        return { status: 400, jsonBody: { error: "Transaction ID is required." } };
    }
    try {
        const tx = await request.json() as any;
        const { category_id, type, amount, currency, date, vendor_or_buyer, memo } = tx;

        // Recalculate base amount if amount or currency changes
        const fx_rate_to_base = tx.fx_rate_to_base || 1.0;
        const base_amount_cached = amount * fx_rate_to_base;

        const result = await query(
            `UPDATE financial_transactions SET
             category_id = $1, type = $2, amount = $3, currency = $4, date = $5,
             vendor_or_buyer = $6, memo = $7, fx_rate_to_base = $8, base_amount_cached = $9
             WHERE id = $10 RETURNING *`,
            [category_id, type, amount, currency, date, vendor_or_buyer, memo, fx_rate_to_base, base_amount_cached, txId]
        );

        if (result.rowCount === 0) {
            return { status: 404, jsonBody: { error: "Transaction not found." } };
        }
        return { jsonBody: result.rows[0] };
    } catch (error) {
        context.log(`Error updating transaction ${txId}:`, error);
        return { status: 500, body: "Internal Server Error" };
    }
}


app.http('getFinancialTransactions', {
    methods: ['GET'],
    route: 'v1/financial-transactions',
    authLevel: 'anonymous',
    handler: getFinancialTransactions
});

app.http('createFinancialTransaction', {
    methods: ['POST'],
    route: 'v1/financial-transactions',
    authLevel: 'anonymous',
    handler: createFinancialTransaction
});

app.http('updateFinancialTransaction', {
    methods: ['PATCH'],
    route: 'v1/financial-transactions/{id}',
    authLevel: 'anonymous',
    handler: updateFinancialTransaction
});
