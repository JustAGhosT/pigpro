import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import fs from 'fs';
import path from 'path';

// Serve static domain data from JSON moved to backend
function loadLivestock() {
  const p = path.join(process.cwd(), 'src', 'data', 'livestock-data.json');
  try { return JSON.parse(fs.readFileSync(p, 'utf-8')); } catch { return {}; }
}
const livestockData = loadLivestock();

export async function getLivestockData(_req: HttpRequest): Promise<HttpResponseInit> {
  return { 
    status: 200,
    jsonBody: livestockData 
  };
}

app.http('getLivestockData', {
  methods: ['GET'],
  route: 'v1/livestock',
  authLevel: 'anonymous',
  handler: getLivestockData
});


