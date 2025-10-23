/**
 * Local development server for testing the IP Geolocation API
 * This wraps the Cloudflare Workers Hono app for local Node.js execution
 */

import { serve } from '@hono/node-server';
import app from './src/index.js';

const port = 5000;

console.log(`Starting IP Geolocation API on port ${port}...`);

serve({
  fetch: app.fetch,
  port: port,
});

console.log(`✅ API running at http://localhost:${port}`);
console.log(`📍 Test it: curl http://localhost:${port}/?ip=8.8.8.8`);
