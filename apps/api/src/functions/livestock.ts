import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import fs from 'fs';
import path from 'path';

// Serve static domain data from JSON moved to backend
function loadLivestock() {
  // Try multiple paths for reliable file loading in Azure Functions
  const possiblePaths = [
    // Development path (relative to source)
    path.join(process.cwd(), 'src', 'data', 'livestock-data.json'),
    // Azure Functions path (relative to function directory)
    path.join(__dirname, '..', 'data', 'livestock-data.json'),
    // Alternative Azure Functions path
    path.join(__dirname, '..', '..', 'src', 'data', 'livestock-data.json'),
    // Fallback path
    path.join(process.cwd(), 'apps', 'api', 'src', 'data', 'livestock-data.json')
  ];

  for (const dataPath of possiblePaths) {
    try {
      if (fs.existsSync(dataPath)) {
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        console.log(`Successfully loaded livestock data from: ${dataPath}`);
        return data;
      }
    } catch (error) {
      console.warn(`Failed to load livestock-data.json from ${dataPath}:`, error);
    }
  }
  
  console.error('Failed to load livestock-data.json from any of the attempted paths:', possiblePaths);
  return {};
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


