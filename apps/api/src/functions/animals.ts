import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { query } from "../lib/db/client";
import { getUserTier, checkTierLimit, FREE_TIER_LIMITS } from "../lib/auth";

// GET /api/v1/animals
export async function getAnimals(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const speciesId = request.query.get('speciesId');
        const groupId = request.query.get('groupId');

        let queryString = 'SELECT * FROM animals';
        const params: string[] = [];
        const conditions: string[] = [];

        if (speciesId) {
            params.push(speciesId);
            conditions.push(`species_id = $${params.length}`);
        }
        if (groupId) {
            params.push(groupId);
            conditions.push(`group_id = $${params.length}`);
        }

        if (conditions.length > 0) {
            queryString += ' WHERE ' + conditions.join(' AND ');
        }
        queryString += ' ORDER BY external_id ASC';

        const result = await query(queryString, params);
        return { jsonBody: result.rows };
    } catch (error) {
        context.log('Error fetching animals:', error);
        return { status: 500, body: "Internal Server Error" };
    }
}

// POST /api/v1/animals
export async function createAnimal(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const userTier = getUserTier();

        // --- Tier Check ---
        const countResult = await query('SELECT COUNT(*) FROM animals');
        const animalCount = Number.parseInt(countResult.rows[0].count, 10);
        if (!checkTierLimit(userTier, animalCount, FREE_TIER_LIMITS.animals)) {
            return { status: 403, jsonBody: { error: `Free tier limit of ${FREE_TIER_LIMITS.animals} animals reached. Please upgrade.` } };
        }

        const { external_id, species_id, group_id, sex, dob, status, tags } = await request.json();
        if (!species_id || !sex || !status) {
            return { status: 400, jsonBody: { error: "species_id, sex, and status are required." } };
        }

        const result = await query(
            'INSERT INTO animals (external_id, species_id, group_id, sex, dob, status, tags) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [external_id, species_id, group_id, sex, dob, status, tags || []]
        );

        return { status: 201, jsonBody: result.rows[0] };
    } catch (error) {
        context.log('Error creating animal:', error);
        if ((error as any).code === '23503') {
            return { status: 400, jsonBody: { error: "Invalid species_id or group_id." } };
        }
        if ((error as any).code === '23505') { // unique constraint violation
            return { status: 409, jsonBody: { error: "Animal with that external_id already exists." } };
        }
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
        // For PATCH, we only update fields that are provided.
        const { external_id, group_id, sex, dob, status, tags } = await request.json();

        // This is a bit more complex in SQL. We need to build the query dynamically.
        const existingResult = await query('SELECT * FROM animals WHERE id = $1', [animalId]);
        if (existingResult.rowCount === 0) {
            return { status: 404, jsonBody: { error: "Animal not found." } };
        }
        const existingAnimal = existingResult.rows[0];

        const updatedAnimal = {
            external_id: external_id === undefined ? existingAnimal.external_id : external_id,
            group_id: group_id === undefined ? existingAnimal.group_id : group_id,
            sex: sex === undefined ? existingAnimal.sex : sex,
            dob: dob === undefined ? existingAnimal.dob : dob,
            status: status === undefined ? existingAnimal.status : status,
            tags: tags === undefined ? existingAnimal.tags : tags,
        };

        const result = await query(
            'UPDATE animals SET external_id = $1, group_id = $2, sex = $3, dob = $4, status = $5, tags = $6 WHERE id = $7 RETURNING *',
            [updatedAnimal.external_id, updatedAnimal.group_id, updatedAnimal.sex, updatedAnimal.dob, updatedAnimal.status, updatedAnimal.tags, animalId]
        );

        return { jsonBody: result.rows[0] };
    } catch (error) {
        context.log(`Error updating animal ${animalId}:`, error);
        return { status: 500, body: "Internal Server Error" };
    }
}

app.http('getAnimals', {
    methods: ['GET'],
    route: 'v1/animals',
    authLevel: 'anonymous',
    handler: getAnimals
});

app.http('createAnimal', {
    methods: ['POST'],
    route: 'v1/animals',
    authLevel: 'anonymous',
    handler: createAnimal
});

app.http('updateAnimal', {
    methods: ['PATCH'],
    route: 'v1/animals/{id}',
    authLevel: 'anonymous',
    handler: updateAnimal
});
