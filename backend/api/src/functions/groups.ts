import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { randomUUID } from "node:crypto";
import { groupsDb } from "../lib/inMemoryDb";
import { Group } from "../types/domain";

// GET /api/v1/groups
export async function getGroups(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const speciesId = request.query.get('speciesId');
        if (speciesId) {
            const filteredGroups = groupsDb.filter(g => g.species_id === speciesId);
            return { jsonBody: filteredGroups };
        }
        return { jsonBody: groupsDb };
    } catch (error) {
        context.log('Error fetching groups:', error);
        return { status: 500, body: "Internal Server Error" };
    }
}

// POST /api/v1/groups
export async function createGroup(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const newGroupData = await request.json() as Partial<Group>;
        if (!newGroupData.name || !newGroupData.species_id) {
            return { status: 400, jsonBody: { error: "Name and species_id are required." } };
        }

        const newGroup: Group = {
            id: randomUUID(),
            active: true,
            tags: [],
            ...newGroupData
        };

        groupsDb.push(newGroup);
        return { status: 201, jsonBody: newGroup };
    } catch (error) {
        context.log('Error creating group:', error);
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
        const groupIndex = groupsDb.findIndex(g => g.id === groupId);
        if (groupIndex === -1) {
            return { status: 404, jsonBody: { error: "Group not found." } };
        }

        const updates = await request.json() as Partial<Group>;
        const updatedGroup = { ...groupsDb[groupIndex], ...updates };
        groupsDb[groupIndex] = updatedGroup;

        return { jsonBody: updatedGroup };
    } catch (error) {
        context.log(`Error updating group ${groupId}:`, error);
        return { status: 500, body: "Internal Server Error" };
    }
}

app.http('getGroups', {
    methods: ['GET'],
    route: 'api/v1/groups',
    authLevel: 'anonymous',
    handler: getGroups
});

app.http('createGroup', {
    methods: ['POST'],
    route: 'api/v1/groups',
    authLevel: 'anonymous',
    handler: createGroup
});

app.http('updateGroup', {
    methods: ['PATCH'],
    route: 'api/v1/groups/{id}',
    authLevel: 'anonymous',
    handler: updateGroup
});
