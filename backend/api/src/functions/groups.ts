import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { query } from "../lib/db/client";
import { Group } from "@my-farm/domain";
import { getUserTier, checkTierLimit, FREE_TIER_LIMITS } from "../lib/auth";

// GET /api/v1/groups
export async function getGroups(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const speciesId = request.query.get('speciesId');
        let result;
        if (speciesId) {
            result = await query('SELECT * FROM groups WHERE species_id = $1 ORDER BY name ASC', [speciesId]);
        } else {
            result = await query('SELECT * FROM groups ORDER BY name ASC');
        }
        return { jsonBody: result.rows };
    } catch (error) {
        context.log('Error fetching groups:', error);
        return { status: 500, body: "Internal Server Error" };
    }
}

// POST /api/v1/groups
export async function createGroup(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const userTier = getUserTier();

        // --- Tier Check ---
        const countResult = await query('SELECT COUNT(*) FROM groups');
        const groupCount = parseInt(countResult.rows[0].count, 10);
        if (!checkTierLimit(userTier, groupCount, FREE_TIER_LIMITS.groups)) {
            return { status: 403, jsonBody: { error: `Free tier limit of ${FREE_TIER_LIMITS.groups} groups reached. Please upgrade.` } };
        }

        const { name, species_id, location_id, tags } = await request.json() as any;
        if (!name || !species_id) {
            return { status: 400, jsonBody: { error: "Name and species_id are required." } };
        }

        const result = await query(
            'INSERT INTO groups (name, species_id, location_id, tags) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, species_id, location_id, tags || []]
        );

        return { status: 201, jsonBody: result.rows[0] };
    } catch (error) {
        context.log('Error creating group:', error);
        // Check for foreign key violation
        if ((error as any).code === '23503') {
            return { status: 400, jsonBody: { error: "Invalid species_id. Does not exist." } };
        }
        return { status: 500, body: "Internal Server Error" };
    }
}

// PATCH /api/v1/groups/{id}
export async function updateGroup(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    const groupId = request.params.id;
    if (!groupId) {
        return { status: 400, jsonBody: { error: "Group ID is required in the URL." } };
    }

    try {
        const { name, location_id, tags, active } = await request.json() as any;

        const result = await query(
            'UPDATE groups SET name = $1, location_id = $2, tags = $3, active = $4 WHERE id = $5 RETURNING *',
            [name, location_id, tags, active, groupId]
        );

        if (result.rowCount === 0) {
            return { status: 404, jsonBody: { error: "Group not found." } };
        }

        return { jsonBody: result.rows[0] };
    } catch (error) {
        context.log(`Error updating group ${groupId}:`, error);
        return { status: 500, body: "Internal Server Error" };
    }
}

app.http('getGroups', {
    methods: ['GET'],
    route: 'v1/groups',
    authLevel: 'anonymous',
    handler: getGroups
});

app.http('createGroup', {
    methods: ['POST'],
    route: 'v1/groups',
    authLevel: 'anonymous',
    handler: createGroup
});

app.http('updateGroup', {
    methods: ['PATCH'],
    route: 'v1/groups/{id}',
    authLevel: 'anonymous',
    handler: updateGroup
});
