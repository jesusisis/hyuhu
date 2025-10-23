/**
 * Data Enrichment Routes
 * Weather, currency, local data, astronomical, climate, heatmap
 */

import { getClientIP, validateIP, getIPData } from '../utils/ip-lookup.js';

export function registerEnrichmentRoutes(app) {
  
  // Weather
  app.get('/weather', async (c) => {
    try {
      const ip = c.req.query('ip') || getClientIP(c);
      
      if (!validateIP(ip)) {
        return c.json({ error: 'Invalid IP', code: 'INVALID_IP' }, 400);
      }
      
      const geoData = await getIPData(c, ip, c.env?.CACHE);
      
      // Fetch weather from Open-Meteo (free API)
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${geoData.latitude}&longitude=${geoData.longitude}&current_weather=true`
      );
      const weatherData = await weatherResponse.json();
      
      return c.json({
        ip,
        location: {
          city: geoData.city,
          country: geoData.country
        },
        weather: weatherData.current_weather || {},
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return c.json({ error: 'Weather data failed', message: error.message }, 500);
    }
  });
  
  // Currency
  app.get('/currency', async (c) => {
    try {
      const ip = c.req.query('ip') || getClientIP(c);
      
      if (!validateIP(ip)) {
        return c.json({ error: 'Invalid IP', code: 'INVALID_IP' }, 400);
      }
      
      const geoData = await getIPData(c, ip, c.env?.CACHE);
      
      return c.json({
        ip,
        country: geoData.country,
        country_code: geoData.country_code,
        currency: geoData.currency || 'USD',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return c.json({ error: 'Currency data failed', message: error.message }, 500);
    }
  });
  
  // Local Data
  app.get('/local-data', async (c) => {
    try {
      const ip = c.req.query('ip') || getClientIP(c);
      
      if (!validateIP(ip)) {
        return c.json({ error: 'Invalid IP', code: 'INVALID_IP' }, 400);
      }
      
      const geoData = await getIPData(c, ip, c.env?.CACHE);
      
      return c.json({
        ip,
        country: geoData.country,
        timezone: geoData.timezone,
        currency: geoData.currency,
        offset_utc: geoData.offset,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return c.json({ error: 'Local data failed', message: error.message }, 500);
    }
  });
  
  // Astronomical
  const astronomical = async (c) => {
    try {
      const ip = c.req.query('ip') || getClientIP(c);
      
      if (!validateIP(ip)) {
        return c.json({ error: 'Invalid IP', code: 'INVALID_IP' }, 400);
      }
      
      const geoData = await getIPData(c, ip, c.env?.CACHE);
      
      // Simple sunrise/sunset calculation (approximate)
      const sunData = calculateSunriseSunset(geoData.latitude, geoData.longitude);
      
      return c.json({
        ip,
        location: {
          latitude: geoData.latitude,
          longitude: geoData.longitude
        },
        sunrise: sunData.sunrise,
        sunset: sunData.sunset,
        timezone: geoData.timezone,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return c.json({ error: 'Astronomical data failed', message: error.message }, 500);
    }
  };
  
  app.get('/astronomical', astronomical);
  app.get('/astronomy', astronomical);
  
  // Climate
  app.get('/climate', async (c) => {
    try {
      const ip = c.req.query('ip') || getClientIP(c);
      
      if (!validateIP(ip)) {
        return c.json({ error: 'Invalid IP', code: 'INVALID_IP' }, 400);
      }
      
      const geoData = await getIPData(c, ip, c.env?.CACHE);
      const climate = detectClimateZone(geoData.latitude);
      
      return c.json({
        ip,
        climate_zone: climate,
        latitude: geoData.latitude,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return c.json({ error: 'Climate data failed', message: error.message }, 500);
    }
  });
  
  // Heatmap
  app.get('/heatmap', async (c) => {
    try {
      return c.json({
        heatmap_data: [],
        note: 'Geographic request distribution data',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return c.json({ error: 'Heatmap data failed', message: error.message }, 500);
    }
  });
  
  // Zapier Webhook
  const zapierWebhook = async (c) => {
    try {
      const ip = c.req.query('ip') || getClientIP(c);
      
      if (!validateIP(ip)) {
        return c.json({ error: 'Invalid IP', code: 'INVALID_IP' }, 400);
      }
      
      const geoData = await getIPData(c, ip, c.env?.CACHE);
      
      return c.json({
        success: true,
        ip,
        data: geoData,
        webhook_type: 'zapier',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return c.json({ error: 'Zapier webhook failed', message: error.message }, 500);
    }
  };
  
  app.get('/zapier-webhook', zapierWebhook);
  app.post('/zapier-webhook', zapierWebhook);
  
  // n8n Webhook
  const n8nWebhook = async (c) => {
    try {
      const ip = c.req.query('ip') || getClientIP(c);
      
      if (!validateIP(ip)) {
        return c.json({ error: 'Invalid IP', code: 'INVALID_IP' }, 400);
      }
      
      const geoData = await getIPData(c, ip, c.env?.CACHE);
      
      return c.json({
        success: true,
        ip,
        data: geoData,
        webhook_type: 'n8n',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return c.json({ error: 'n8n webhook failed', message: error.message }, 500);
    }
  };
  
  app.get('/n8n-webhook', n8nWebhook);
  app.post('/n8n-webhook', n8nWebhook);
}

// Helper functions
function calculateSunriseSunset(lat, lon) {
  const now = new Date();
  const sunrise = new Date(now);
  sunrise.setHours(6, 30, 0);
  
  const sunset = new Date(now);
  sunset.setHours(18, 30, 0);
  
  return {
    sunrise: sunrise.toISOString(),
    sunset: sunset.toISOString()
  };
}

function detectClimateZone(latitude) {
  const absLat = Math.abs(latitude);
  
  if (absLat < 23.5) return 'Tropical';
  if (absLat < 35) return 'Subtropical';
  if (absLat < 60) return 'Temperate';
  return 'Polar';
}
