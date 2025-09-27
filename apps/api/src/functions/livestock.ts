import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import fs from 'fs';
import path from 'path';

// Serve static domain data from JSON moved to backend
function loadLivestock() {
  // Use __dirname for reliable path resolution in Azure Functions
  const dataPath = path.join(__dirname, '..', 'data', 'livestock-data.json');
  try { 
    return JSON.parse(fs.readFileSync(dataPath, 'utf-8')); 
  } catch (error) {
    console.warn('Failed to load livestock-data.json:', error);
    return {}; 
  }
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


