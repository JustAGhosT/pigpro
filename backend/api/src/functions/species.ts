import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Species } from "../types/domain";

// Hardcoded data for the species endpoint
const speciesData: Species[] = [
    { id: '1', name: 'Goat', is_dairy: true, is_ruminant: true, created_at: new Date() },
    { id: '2', name: 'Cattle', is_dairy: true, is_ruminant: true, created_at: new Date() },
    { id: '3', name: 'Sheep', is_dairy: true, is_ruminant: true, created_at: new Date() },
    { id: '4', name: 'Pig', is_dairy: false, is_ruminant: false, created_at: new Date() },
    { id: '5', name: 'Poultry', is_dairy: false, is_ruminant: false, created_at: new Date() },
    { id: '6', name: 'Rabbit', is_dairy: false, is_ruminant: false, created_at: new Date() },
];

export async function getSpecies(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        return {
            status: 200,
            jsonBody: speciesData
        };
    } catch (error) {
        context.log('Error fetching species:', error);
        return {
            status: 500,
            body: "Internal Server Error"
        };
    }
}

app.http('getSpecies', {
    methods: ['GET'],
    route: 'api/v1/species',
    authLevel: 'anonymous',
    handler: getSpecies
});
