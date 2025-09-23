import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { randomUUID } from "node:crypto";
import { financialTransactionsDb } from "../lib/inMemoryDb";
import { FinancialTransaction } from "../types/domain";

// GET /api/v1/financial-transactions
export async function getFinancialTransactions(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        return { jsonBody: financialTransactionsDb };
    } catch (error) {
        context.log('Error fetching financial transactions:', error);
        return { status: 500, body: "Internal Server Error" };
    }
}

// POST /api/v1/financial-transactions
export async function createFinancialTransaction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const newTransactionData = await request.json() as Partial<FinancialTransaction>;
        if (!newTransactionData.category_id || !newTransactionData.type || !newTransactionData.amount || !newTransactionData.currency || !newTransactionData.date) {
            return { status: 400, jsonBody: { error: "category_id, type, amount, currency, and date are required." } };
        }

        // In a real app, you'd look up the FX rate. For now, we'll assume it's 1.
        const fx_rate_to_base = newTransactionData.fx_rate_to_base || 1;
        const base_amount_cached = newTransactionData.amount * fx_rate_to_base;

        const newTransaction: FinancialTransaction = {
            id: randomUUID(),
            created_at: new Date(),
            ...newTransactionData,
            fx_rate_to_base,
            base_amount_cached,
        };

        financialTransactionsDb.push(newTransaction);
        return { status: 201, jsonBody: newTransaction };
    } catch (error) {
        context.log('Error creating financial transaction:', error);
        return { status: 500, body: "Internal Server Error" };
    }
}

// PATCH /api/v1/financial-transactions/{id}
export async function updateFinancialTransaction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    const transactionId = request.params.id;
    if (!transactionId) {
        return { status: 400, jsonBody: { error: "Transaction ID is required in the URL." } };
    }

    try {
        const transactionIndex = financialTransactionsDb.findIndex(t => t.id === transactionId);
        if (transactionIndex === -1) {
            return { status: 404, jsonBody: { error: "Transaction not found." } };
        }

        const updates = await request.json() as Partial<FinancialTransaction>;
        const updatedTransaction = { ...financialTransactionsDb[transactionIndex], ...updates };

        // Recalculate base amount if amount or fx_rate changes
        if(updates.amount || updates.fx_rate_to_base) {
            const fx_rate_to_base = updatedTransaction.fx_rate_to_base || 1;
            updatedTransaction.base_amount_cached = updatedTransaction.amount * fx_rate_to_base;
        }

        financialTransactionsDb[transactionIndex] = updatedTransaction;

        return { jsonBody: updatedTransaction };
    } catch (error) {
        context.log(`Error updating transaction ${transactionId}:`, error);
        return { status: 500, body: "Internal Server Error" };
    }
}


app.http('getFinancialTransactions', {
    methods: ['GET'],
    route: 'api/v1/financial-transactions',
    authLevel: 'anonymous',
    handler: getFinancialTransactions
});

app.http('createFinancialTransaction', {
    methods: ['POST'],
    route: 'api/v1/financial-transactions',
    authLevel: 'anonymous',
    handler: createFinancialTransaction
});

app.http('updateFinancialTransaction', {
    methods: ['PATCH'],
    route: 'api/v1/financial-transactions/{id}',
    authLevel: 'anonymous',
    handler: updateFinancialTransaction
});
