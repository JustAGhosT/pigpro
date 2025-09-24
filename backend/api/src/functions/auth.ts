import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getUserTier } from "../lib/auth";

// GET /api/v1/auth/tier
export async function getTier(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const tier = getUserTier();
        return {
            status: 200,
            jsonBody: { tier }
        };
    } catch (error) {
        context.log('Error fetching user tier:', error);
        return { status: 500, body: "Internal Server Error" };
    }
}

app.http('getTier', {
    methods: ['GET'],
    route: 'v1/auth/tier',
    authLevel: 'anonymous',
    handler: getTier
});
