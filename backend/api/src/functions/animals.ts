import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { randomUUID } from "node:crypto";
import { animalsDb } from "../lib/inMemoryDb";
import { Animal } from "../types/domain";

// GET /api/v1/animals
export async function getAnimals(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const speciesId = request.query.get('speciesId');
        if (speciesId) {
            const filteredAnimals = animalsDb.filter(a => a.species_id === speciesId);
            return { jsonBody: filteredAnimals };
        }
        return { jsonBody: animalsDb };
    } catch (error) {
        context.log('Error fetching animals:', error);
        return { status: 500, body: "Internal Server Error" };
    }
}

// POST /api/v1/animals
export async function createAnimal(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const newAnimalData = await request.json() as Partial<Animal>;
        if (!newAnimalData.species_id || !newAnimalData.status) {
            return { status: 400, jsonBody: { error: "species_id and status are required." } };
        }

        const newAnimal: Animal = {
            id: randomUUID(),
            tags: [],
            ...newAnimalData
        };

        animalsDb.push(newAnimal);
        return { status: 201, jsonBody: newAnimal };
    } catch (error) {
        context.log('Error creating animal:', error);
        return { status: 500, body: "Internal Server Error" };
    }
}

// PATCH /api/v1/animals/{id}
export async function updateAnimal(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    const animalId = request.params.id;
    if (!animalId) {
        return { status: 400, jsonBody: { error: "Animal ID is required in the URL." } };
    }

    try {
        const animalIndex = animalsDb.findIndex(a => a.id === animalId);
        if (animalIndex === -1) {
            return { status: 404, jsonBody: { error: "Animal not found." } };
        }

        const updates = await request.json() as Partial<Animal>;
        const updatedAnimal = { ...animalsDb[animalIndex], ...updates };
        animalsDb[animalIndex] = updatedAnimal;

        return { jsonBody: updatedAnimal };
    } catch (error) {
        context.log(`Error updating animal ${animalId}:`, error);
        return { status: 500, body: "Internal Server Error" };
    }
}

app.http('getAnimals', {
    methods: ['GET'],
    route: 'api/v1/animals',
    authLevel: 'anonymous',
    handler: getAnimals
});

app.http('createAnimal', {
    methods: ['POST'],
    route: 'api/v1/animals',
    authLevel: 'anonymous',
    handler: createAnimal
});

app.http('updateAnimal', {
    methods: ['PATCH'],
    route: 'api/v1/animals/{id}',
    authLevel: 'anonymous',
    handler: updateAnimal
});
