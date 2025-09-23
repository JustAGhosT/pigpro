import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { randomUUID } from "node:crypto";
import { categoriesDb } from "../lib/inMemoryDb";
import { Category } from "../types/domain";

// GET /api/v1/categories
export async function getCategories(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        return { jsonBody: categoriesDb };
    } catch (error) {
        context.log('Error fetching categories:', error);
        return { status: 500, body: "Internal Server Error" };
    }
}

// POST /api/v1/categories
export async function createCategory(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const newCategoryData = await request.json() as Partial<Category>;
        if (!newCategoryData.name || !newCategoryData.type) {
            return { status: 400, jsonBody: { error: "Name and type are required." } };
        }

        const newCategory: Category = {
            id: randomUUID(),
            is_active: true,
            ...newCategoryData
        };

        categoriesDb.push(newCategory);
        return { status: 201, jsonBody: newCategory };
    } catch (error) {
        context.log('Error creating category:', error);
        return { status: 500, body: "Internal Server Error" };
    }
}


app.http('getCategories', {
    methods: ['GET'],
    route: 'api/v1/categories',
    authLevel: 'anonymous',
    handler: getCategories
});

app.http('createCategory', {
    methods: ['POST'],
    route: 'api/v1/categories',
    authLevel: 'anonymous',
    handler: createCategory
});
