/**
 * IP Geolocation API - Cloudflare Workers Edition
 * 122+ Endpoints with real-time IP intelligence
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { cache } from 'hono/cache';

// Import route handlers
import { registerCoreRoutes } from './routes/core.js';
import { registerSecurityRoutes } from './routes/security.js';
import { registerBusinessRoutes } from './routes/business.js';
import { registerNetworkRoutes } from './routes/network.js';
import { registerEnrichmentRoutes } from './routes/enrichment.js';
import { registerAliasRoutes } from './routes/aliases.js';
import { registerUtilityRoutes } from './routes/utility.js';

// Create Hono app
const app = new Hono();

// CORS middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
}));

// Request logging middleware
app.use('*', async (c, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${c.req.method} ${c.req.path} - ${ms}ms`);
});

// Register all routes
registerCoreRoutes(app);
registerSecurityRoutes(app);
registerBusinessRoutes(app);
registerNetworkRoutes(app);
registerEnrichmentRoutes(app);
registerAliasRoutes(app);
registerUtilityRoutes(app);

// 404 handler
app.notFound((c) => {
  return c.json({
    error: 'Endpoint not found',
    code: 'NOT_FOUND',
    available_endpoints: [
      '/ - Main IP lookup',
      '/status - API status',
      '/health - Health check',
      'See documentation for all 122 endpoints'
    ]
  }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
    message: err.message
  }, 500);
});

// Export for Cloudflare Workers
export default app;
