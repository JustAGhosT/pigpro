import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { query } from "../lib/db/client";

// GET /api/v1/species
export async function getSpecies(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const result = await query('SELECT * FROM species ORDER BY name ASC');
        return {
            status: 200,
            jsonBody: result.rows
        };
    } catch (error) {
        context.log('Error fetching species:', error);
        return { status: 500, body: "Internal Server Error" };
    }
}

// POST /api/v1/species
export async function createSpecies(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const { name, is_dairy, is_ruminant } = await request.json() as any;
        if (!name) {
            return { status: 400, jsonBody: { error: "Name is required." } };
        }

        const result = await query(
            'INSERT INTO species (name, is_dairy, is_ruminant) VALUES ($1, $2, $3) RETURNING *',
            [name, is_dairy, is_ruminant]
        );

        return { status: 201, jsonBody: result.rows[0] };
    } catch (error) {
        context.log('Error creating species:', error);
        return { status: 500, body: "Internal Server Error" };
    }
}

app.http('getSpecies', {
    methods: ['GET'],
    route: 'v1/species',
    authLevel: 'anonymous',
    handler: getSpecies
});

app.http('createSpecies', {
    methods: ['POST'],
    route: 'v1/species',
    authLevel: 'anonymous',
    handler: createSpecies
});
