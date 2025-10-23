/**
 * SEO Alias Routes
 * Marketing and SEO-optimized endpoint aliases
 */

export function registerAliasRoutes(app) {
  
  // Main IP Intelligence Aliases
  const mainAliases = [
    '/ip-intelligence',
    '/ip-lookup',
    '/geolocation-api',
    '/ip-geolocation',
    '/location-by-ip',
    '/ip-location-finder',
    '/free-ip-lookup',
    '/live-ip-data',
    '/real-time-ip-info',
    '/ip-address-lookup',
    '/advanced-ip-intel',
    '/professional-ip-data',
    '/locate-ip',
    '/find-ip',
    '/track-ip',
    '/ip-locator',
    '/ip-tracker',
    '/ip-finder',
    '/geolocation',
    '/geolocate',
    '/geo-ip',
    '/ip-details',
    '/ip-info',
    '/where-is-ip',
    '/ip-location',
    '/check-ip',
    '/ip-data',
    '/trace-ip',
    '/ip-analysis',
    '/visitor-location',
    '/ip-geo'
  ];
  
  mainAliases.forEach(path => {
    app.get(path, async (c) => {
      const url = new URL(c.req.url);
      const targetUrl = `${url.protocol}//${url.host}/?${url.searchParams.toString()}`;
      const response = await app.request(targetUrl, {
        method: 'GET',
        headers: c.req.raw.headers
      });
      return response;
    });
    
    app.post(path, async (c) => {
      const url = new URL(c.req.url);
      const targetUrl = `${url.protocol}//${url.host}/`;
      return app.request(targetUrl, {
        method: 'POST',
        headers: c.req.raw.headers,
        body: c.req.raw.body
      });
    });
  });
  
  // Security Aliases → /threat-intel
  const securityAliases = [
    '/threat-detection',
    '/security-check',
    '/ip-threat-analysis',
    '/malware-detection',
    '/fraud-prevention',
    '/cyber-security-api',
    '/threat-intelligence',
    '/security-analysis',
    '/ip-reputation-check'
  ];
  
  securityAliases.forEach(path => {
    app.get(path, async (c) => {
      return app.request('/threat-intel?' + new URLSearchParams(c.req.query()).toString(), {
        headers: c.req.raw.headers
      });
    });
  });
  
  // VPN/Proxy Aliases → /vpn-detect
  const vpnAliases = [
    '/proxy-checker',
    '/anonymizer-detection',
    '/residential-proxy-check',
    '/datacenter-detection'
  ];
  
  vpnAliases.forEach(path => {
    app.get(path, async (c) => {
      return app.request('/vpn-detect?' + new URLSearchParams(c.req.query()).toString(), {
        headers: c.req.raw.headers
      });
    });
  });
  
  // Business Aliases → /company-detection
  const businessAliases = [
    '/company-lookup',
    '/organization-finder',
    '/business-intelligence',
    '/corporate-data',
    '/enterprise-lookup'
  ];
  
  businessAliases.forEach(path => {
    app.get(path, async (c) => {
      return app.request('/company-detection?' + new URLSearchParams(c.req.query()).toString(), {
        headers: c.req.raw.headers
      });
    });
  });
  
  // Regional Endpoints
  app.get('/usa-ip-lookup', async (c) => {
    const url = new URL(c.req.url);
    const targetUrl = `${url.protocol}//${url.host}/?${url.searchParams.toString()}`;
    const response = await app.request(targetUrl, {
      headers: c.req.raw.headers
    });
    const data = await response.json();
    data.market_focus = 'USA';
    return c.json(data);
  });
  
  app.get('/american-ip-data', async (c) => {
    return app.request('/usa-ip-lookup?' + new URLSearchParams(c.req.query()).toString(), {
      headers: c.req.raw.headers
    });
  });
  app.get('/us-geolocation', async (c) => {
    return app.request('/usa-ip-lookup?' + new URLSearchParams(c.req.query()).toString(), {
      headers: c.req.raw.headers
    });
  });
  
  app.get('/europe-ip-lookup', async (c) => {
    const url = new URL(c.req.url);
    const targetUrl = `${url.protocol}//${url.host}/?${url.searchParams.toString()}`;
    const response = await app.request(targetUrl, {
      headers: c.req.raw.headers
    });
    const data = await response.json();
    data.market_focus = 'Europe';
    data.gdpr_compliant = true;
    return c.json(data);
  });
  
  app.get('/eu-geolocation', async (c) => {
    return app.request('/europe-ip-lookup?' + new URLSearchParams(c.req.query()).toString(), {
      headers: c.req.raw.headers
    });
  });
  app.get('/european-ip-data', async (c) => {
    return app.request('/europe-ip-lookup?' + new URLSearchParams(c.req.query()).toString(), {
      headers: c.req.raw.headers
    });
  });
  
  app.get('/asia-ip-lookup', async (c) => {
    const url = new URL(c.req.url);
    const targetUrl = `${url.protocol}//${url.host}/?${url.searchParams.toString()}`;
    const response = await app.request(targetUrl, {
      headers: c.req.raw.headers
    });
    const data = await response.json();
    data.market_focus = 'Asia-Pacific';
    return c.json(data);
  });
  
  app.get('/apac-geolocation', async (c) => {
    return app.request('/asia-ip-lookup?' + new URLSearchParams(c.req.query()).toString(), {
      headers: c.req.raw.headers
    });
  });
  app.get('/asian-ip-data', async (c) => {
    return app.request('/asia-ip-lookup?' + new URLSearchParams(c.req.query()).toString(), {
      headers: c.req.raw.headers
    });
  });
  
  // Industry-Specific Endpoints
  app.get('/ecommerce-fraud-check', async (c) => {
    const response = await app.request('/risk-score?' + new URLSearchParams(c.req.query()).toString(), {
      headers: c.req.raw.headers
    });
    const data = await response.json();
    data.ecommerce_optimized = true;
    return c.json(data);
  });
  
  app.get('/online-store-security', async (c) => {
    return app.request('/ecommerce-fraud-check?' + new URLSearchParams(c.req.query()).toString(), {
      headers: c.req.raw.headers
    });
  });
  app.get('/shopping-cart-protection', async (c) => {
    return app.request('/ecommerce-fraud-check?' + new URLSearchParams(c.req.query()).toString(), {
      headers: c.req.raw.headers
    });
  });
  
  app.get('/gaming-anti-cheat', async (c) => {
    const response = await app.request('/bot-detection?' + new URLSearchParams(c.req.query()).toString(), {
      headers: c.req.raw.headers
    });
    const data = await response.json();
    data.gaming_optimized = true;
    return c.json(data);
  });
  
  app.get('/game-server-protection', async (c) => {
    return app.request('/gaming-anti-cheat?' + new URLSearchParams(c.req.query()).toString(), {
      headers: c.req.raw.headers
    });
  });
  app.get('/esports-security', async (c) => {
    return app.request('/gaming-anti-cheat?' + new URLSearchParams(c.req.query()).toString(), {
      headers: c.req.raw.headers
    });
  });
  
  app.get('/fintech-compliance', async (c) => {
    const response = await app.request('/abuse-check?' + new URLSearchParams(c.req.query()).toString(), {
      headers: c.req.raw.headers
    });
    const data = await response.json();
    data.fintech_optimized = true;
    return c.json(data);
  });
  
  app.get('/banking-security-check', async (c) => {
    return app.request('/fintech-compliance?' + new URLSearchParams(c.req.query()).toString(), {
      headers: c.req.raw.headers
    });
  });
  app.get('/kyc-ip-verification', async (c) => {
    return app.request('/fintech-compliance?' + new URLSearchParams(c.req.query()).toString(), {
      headers: c.req.raw.headers
    });
  });
  
  // AI & Web3 Buzzword Endpoints
  app.get('/ai-powered-geolocation', async (c) => {
    const url = new URL(c.req.url);
    const targetUrl = `${url.protocol}//${url.host}/?${url.searchParams.toString()}`;
    const response = await app.request(targetUrl, {
      headers: c.req.raw.headers
    });
    const data = await response.json();
    data.ai_enhanced = true;
    data.ml_processed = true;
    return c.json(data);
  });
  
  const aiAliases = [
    '/machine-learning-ip-analysis',
    '/gpt-enhanced-location',
    '/artificial-intelligence-geo'
  ];
  
  aiAliases.forEach(path => {
    app.get(path, async (c) => {
      return app.request('/ai-powered-geolocation?' + new URLSearchParams(c.req.query()).toString(), {
        headers: c.req.raw.headers
      });
    });
  });
  
  app.get('/web3-ip-intelligence', async (c) => {
    const response = await app.request('/risk-score?' + new URLSearchParams(c.req.query()).toString(), {
      headers: c.req.raw.headers
    });
    const data = await response.json();
    data.web3_optimized = true;
    data.blockchain_ready = true;
    return c.json(data);
  });
  
  const web3Aliases = [
    '/blockchain-geo-verification',
    '/crypto-location-api',
    '/defi-security-check'
  ];
  
  web3Aliases.forEach(path => {
    app.get(path, async (c) => {
      return app.request('/web3-ip-intelligence?' + new URLSearchParams(c.req.query()).toString(), {
        headers: c.req.raw.headers
      });
    });
  });
  
  // Premium Endpoints (same as regular for now)
  const premiumAliases = [
    '/premium-threat-intel',
    '/advanced-security-analysis',
    '/enterprise-risk-assessment'
  ];
  
  premiumAliases.forEach(path => {
    app.get(path, async (c) => {
      const response = await app.request('/threat-intel?' + new URLSearchParams(c.req.query()).toString(), {
        headers: c.req.raw.headers
      });
      const data = await response.json();
      data.premium_features = true;
      return c.json(data);
    });
  });
  
  // Batch aliases
  app.post('/enterprise-batch-processing', async (c) => app.request('/batch', { method: 'POST', body: c.req.raw.body, headers: c.req.raw.headers }));
  app.post('/bulk-ip-analysis', async (c) => app.request('/batch', { method: 'POST', body: c.req.raw.body, headers: c.req.raw.headers }));
  
  // Versioned Endpoints
  app.get('/v1/geolocation', async (c) => {
    const url = new URL(c.req.url);
    const targetUrl = `${url.protocol}//${url.host}/?${url.searchParams.toString()}`;
    const response = await app.request(targetUrl, {
      headers: c.req.raw.headers
    });
    const data = await response.json();
    
    // Simplified v1 response
    return c.json({
      ip: data.ip,
      country: data.country,
      city: data.city,
      latitude: data.latitude,
      longitude: data.longitude,
      api_version: '1.0'
    });
  });
  
  app.get('/v1/ip-lookup', async (c) => {
    return app.request('/v1/geolocation?' + new URLSearchParams(c.req.query()).toString(), {
      headers: c.req.raw.headers
    });
  });
  
  app.get('/v2/geolocation', async (c) => {
    const url = new URL(c.req.url);
    const targetUrl = `${url.protocol}//${url.host}/?${url.searchParams.toString()}`;
    const response = await app.request(targetUrl, {
      headers: c.req.raw.headers
    });
    const data = await response.json();
    data.api_version = '2.0';
    return c.json(data);
  });
  
  app.get('/v2/ip-lookup', async (c) => {
    return app.request('/v2/geolocation?' + new URLSearchParams(c.req.query()).toString(), {
      headers: c.req.raw.headers
    });
  });
  
  app.get('/v3/geolocation', async (c) => {
    const url = new URL(c.req.url);
    const targetUrl = `${url.protocol}//${url.host}/?${url.searchParams.toString()}`;
    const response = await app.request(targetUrl, {
      headers: c.req.raw.headers
    });
    const data = await response.json();
    data.api_version = '3.0';
    data.ai_enhanced = true;
    return c.json(data);
  });
  
  app.get('/v3/ip-lookup', async (c) => {
    return app.request('/v3/geolocation?' + new URLSearchParams(c.req.query()).toString(), {
      headers: c.req.raw.headers
    });
  });
  
  // Format Variations
  app.get('/json/ip-lookup', async (c) => {
    const url = new URL(c.req.url);
    const targetUrl = `${url.protocol}//${url.host}/?${url.searchParams.toString()}`;
    return app.request(targetUrl, {
      headers: c.req.raw.headers
    });
  });
  
  app.get('/xml/ip-lookup', async (c) => {
    const url = new URL(c.req.url);
    const targetUrl = `${url.protocol}//${url.host}/?${url.searchParams.toString()}`;
    const response = await app.request(targetUrl, {
      headers: c.req.raw.headers
    });
    const data = await response.json();
    
    // Simple JSON to XML conversion
    const xml = jsonToXML(data);
    return new Response(xml, {
      headers: { 'Content-Type': 'application/xml' }
    });
  });
  
  app.get('/csv/ip-lookup', async (c) => {
    const url = new URL(c.req.url);
    const targetUrl = `${url.protocol}//${url.host}/?${url.searchParams.toString()}`;
    const response = await app.request(targetUrl, {
      headers: c.req.raw.headers
    });
    const data = await response.json();
    
    // Simple JSON to CSV conversion
    const csv = jsonToCSV(data);
    return new Response(csv, {
      headers: { 'Content-Type': 'text/csv' }
    });
  });
  
  // Status aliases
  app.get('/api-status', async (c) => {
    return app.request('/status', {
      headers: c.req.raw.headers
    });
  });
  app.get('/service-health', async (c) => {
    return app.request('/status', {
      headers: c.req.raw.headers
    });
  });
  app.get('/system-status', async (c) => {
    return app.request('/status', {
      headers: c.req.raw.headers
    });
  });
}

// Helper functions
function jsonToXML(obj, rootName = 'response') {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>`;
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      xml += `<${key}>${JSON.stringify(value)}</${key}>`;
    } else {
      xml += `<${key}>${value}</${key}>`;
    }
  }
  
  xml += `</${rootName}>`;
  return xml;
}

function jsonToCSV(obj) {
  const headers = Object.keys(obj).join(',');
  const values = Object.values(obj).map(v => 
    typeof v === 'object' ? JSON.stringify(v) : v
  ).join(',');
  
  return `${headers}\n${values}`;
}
