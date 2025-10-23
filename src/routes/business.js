/**
 * Business Intelligence Routes
 * Company detection, business enrichment, ASN risk
 */

import { getClientIP, validateIP, getIPData } from '../utils/ip-lookup.js';

export function registerBusinessRoutes(app) {
  
  // Company Detection
  app.get('/company-detection', async (c) => {
    try {
      const ip = c.req.query('ip') || getClientIP(c);
      
      if (!validateIP(ip)) {
        return c.json({ error: 'Invalid IP', code: 'INVALID_IP' }, 400);
      }
      
      const geoData = await getIPData(c, ip, c.env?.CACHE);
      
      return c.json({
        ip,
        company_name: geoData.org || geoData.isp || 'Unknown',
        organization: geoData.org,
        isp: geoData.isp,
        asn: geoData.asn,
        company_type: geoData.hosting ? 'hosting_provider' : 'isp',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return c.json({ error: 'Company detection failed', message: error.message }, 500);
    }
  });
  
  // Business Enrichment
  const businessEnrich = async (c) => {
    try {
      const ip = c.req.query('ip') || getClientIP(c);
      
      if (!validateIP(ip)) {
        return c.json({ error: 'Invalid IP', code: 'INVALID_IP' }, 400);
      }
      
      const geoData = await getIPData(c, ip, c.env?.CACHE);
      
      return c.json({
        ip,
        company_name: geoData.org || geoData.isp,
        industry: detectIndustry(geoData.org, geoData.isp),
        company_size: 'unknown',
        country: geoData.country,
        city: geoData.city,
        asn: geoData.asn,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return c.json({ error: 'Business enrichment failed', message: error.message }, 500);
    }
  };
  
  app.get('/business-enrich', businessEnrich);
  app.post('/business-enrich', businessEnrich);
  
  // ASN Risk Analysis
  app.get('/asn-risk', async (c) => {
    try {
      const ip = c.req.query('ip') || getClientIP(c);
      
      if (!validateIP(ip)) {
        return c.json({ error: 'Invalid IP', code: 'INVALID_IP' }, 400);
      }
      
      const geoData = await getIPData(c, ip, c.env?.CACHE);
      
      return c.json({
        ip,
        asn: geoData.asn,
        asn_risk_score: geoData.hosting ? 40 : 10,
        asn_reputation: geoData.hosting ? 'medium' : 'good',
        organization: geoData.org,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return c.json({ error: 'ASN risk analysis failed', message: error.message }, 500);
    }
  });
}

// Helper function
function detectIndustry(org, isp) {
  const name = (org || isp || '').toLowerCase();
  
  if (name.includes('google') || name.includes('microsoft') || name.includes('amazon')) {
    return 'Technology';
  }
  if (name.includes('hosting') || name.includes('server') || name.includes('cloud')) {
    return 'Hosting & Infrastructure';
  }
  if (name.includes('telecom') || name.includes('wireless') || name.includes('mobile')) {
    return 'Telecommunications';
  }
  
  return 'Unknown';
}
