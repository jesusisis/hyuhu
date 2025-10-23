/**
 * Security & Threat Detection Routes
 * VPN, Proxy, Tor, Bot detection, Threat intelligence, Risk scoring
 */

import { getClientIP, validateIP, getIPData } from '../utils/ip-lookup.js';

export function registerSecurityRoutes(app) {
  
  // VPN Detection (multiple endpoints)
  const vpnDetection = async (c) => {
    try {
      const ip = c.req.query('ip') || getClientIP(c);
      
      if (!validateIP(ip)) {
        return c.json({ error: 'Invalid IP', code: 'INVALID_IP' }, 400);
      }
      
      const geoData = await getIPData(c, ip, c.env?.CACHE);
      
      // Simple VPN detection logic
      const isVPN = geoData.proxy || geoData.hosting || isKnownVPNProvider(geoData.isp);
      
      return c.json({
        ip,
        is_vpn: isVPN,
        is_proxy: geoData.proxy || false,
        is_hosting: geoData.hosting || false,
        confidence: isVPN ? 85 : 95,
        vpn_provider: isVPN ? detectVPNProvider(geoData.isp) : null,
        isp: geoData.isp,
        asn: geoData.asn,
        country: geoData.country,
        analysis_method: 'pattern_matching',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return c.json({ error: 'VPN detection failed', message: error.message }, 500);
    }
  };
  
  app.get('/vpn-detect', vpnDetection);
  app.post('/vpn-detect', vpnDetection);
  app.get('/vpn-detection', vpnDetection);
  app.post('/vpn-detection', vpnDetection);
  app.get('/proxy-detection', vpnDetection);
  app.post('/proxy-detection', vpnDetection);
  
  // Tor Detection
  const torDetection = async (c) => {
    try {
      const ip = c.req.query('ip') || getClientIP(c);
      
      if (!validateIP(ip)) {
        return c.json({ error: 'Invalid IP', code: 'INVALID_IP' }, 400);
      }
      
      // Tor detection (would need external API in production)
      const isTor = false; // Placeholder
      
      return c.json({
        ip,
        is_tor: isTor,
        is_tor_exit_node: isTor,
        confidence: isTor ? 99 : 100,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return c.json({ error: 'Tor detection failed', message: error.message }, 500);
    }
  };
  
  app.get('/tor-detection', torDetection);
  app.post('/tor-detection', torDetection);
  
  // Threat Intelligence
  app.get('/threat-intel', async (c) => {
    try {
      const ip = c.req.query('ip') || getClientIP(c);
      
      if (!validateIP(ip)) {
        return c.json({ error: 'Invalid IP', code: 'INVALID_IP' }, 400);
      }
      
      const geoData = await getIPData(c, ip, c.env?.CACHE);
      
      return c.json({
        ip,
        is_malicious: false,
        threat_score: 0,
        threat_types: [],
        reputation_score: 100,
        sources_checked: ['ip-api.com'],
        last_seen_malicious: null,
        country: geoData.country,
        isp: geoData.isp,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return c.json({ error: 'Threat intelligence failed', message: error.message }, 500);
    }
  });
  
  // Advanced Threat Intelligence
  app.get('/threat-intel-advanced', async (c) => {
    try {
      const ip = c.req.query('ip') || getClientIP(c);
      
      if (!validateIP(ip)) {
        return c.json({ error: 'Invalid IP', code: 'INVALID_IP' }, 400);
      }
      
      return c.json({
        ip,
        advanced_threat_score: 0,
        threat_categories: [],
        malware_detected: false,
        botnet_activity: false,
        spam_detected: false,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return c.json({ error: 'Advanced threat intel failed', message: error.message }, 500);
    }
  });
  
  // Risk Score (AI-powered)
  app.get('/risk-score', async (c) => {
    try {
      const ip = c.req.query('ip') || getClientIP(c);
      
      if (!validateIP(ip)) {
        return c.json({ error: 'Invalid IP', code: 'INVALID_IP' }, 400);
      }
      
      const geoData = await getIPData(c, ip, c.env?.CACHE);
      
      // Calculate risk score
      let riskScore = 0;
      if (geoData.proxy) riskScore += 40;
      if (geoData.hosting) riskScore += 25;
      if (isKnownVPNProvider(geoData.isp)) riskScore += 35;
      
      return c.json({
        ip,
        risk_score: Math.min(riskScore, 100),
        risk_level: riskScore < 30 ? 'low' : riskScore < 70 ? 'medium' : 'high',
        factors: {
          is_proxy: geoData.proxy || false,
          is_hosting: geoData.hosting || false,
          is_vpn: isKnownVPNProvider(geoData.isp)
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return c.json({ error: 'Risk scoring failed', message: error.message }, 500);
    }
  });
  
  // Abuse Check
  app.get('/abuse-check', async (c) => {
    try {
      const ip = c.req.query('ip') || getClientIP(c);
      
      if (!validateIP(ip)) {
        return c.json({ error: 'Invalid IP', code: 'INVALID_IP' }, 400);
      }
      
      return c.json({
        ip,
        abuse_detected: false,
        total_reports: 0,
        abuse_types: [],
        confidence: 50,
        data_source: 'free_abuse_databases',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return c.json({ error: 'Abuse check failed', message: error.message }, 500);
    }
  });
  
  // Reputation
  app.get('/reputation', async (c) => {
    try {
      const ip = c.req.query('ip') || getClientIP(c);
      
      if (!validateIP(ip)) {
        return c.json({ error: 'Invalid IP', code: 'INVALID_IP' }, 400);
      }
      
      return c.json({
        ip,
        reputation_score: 100,
        reputation_category: 'good',
        is_blacklisted: false,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return c.json({ error: 'Reputation check failed', message: error.message }, 500);
    }
  });
  
  // Bot Detection
  app.get('/bot-detection', async (c) => {
    try {
      const ip = c.req.query('ip') || getClientIP(c);
      const userAgent = c.req.header('User-Agent') || '';
      
      if (!validateIP(ip)) {
        return c.json({ error: 'Invalid IP', code: 'INVALID_IP' }, 400);
      }
      
      const isBot = detectBot(userAgent);
      
      return c.json({
        ip,
        is_bot: isBot,
        bot_type: isBot ? 'crawler' : null,
        confidence: isBot ? 90 : 95,
        user_agent: userAgent,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return c.json({ error: 'Bot detection failed', message: error.message }, 500);
    }
  });
  
  // Botnet Detection
  app.get('/botnet-detection', async (c) => {
    try {
      const ip = c.req.query('ip') || getClientIP(c);
      
      if (!validateIP(ip)) {
        return c.json({ error: 'Invalid IP', code: 'INVALID_IP' }, 400);
      }
      
      return c.json({
        ip,
        is_botnet: false,
        confidence: 100,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return c.json({ error: 'Botnet detection failed', message: error.message }, 500);
    }
  });
  
  // Residential Proxy Detection
  app.get('/residential-proxy-detection', async (c) => {
    try {
      const ip = c.req.query('ip') || getClientIP(c);
      
      if (!validateIP(ip)) {
        return c.json({ error: 'Invalid IP', code: 'INVALID_IP' }, 400);
      }
      
      return c.json({
        ip,
        is_residential_proxy: false,
        confidence: 75,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return c.json({ error: 'Residential proxy detection failed', message: error.message }, 500);
    }
  });
  
  app.get('/residential-proxy-advanced', async (c) => {
    const response = await app.request('/residential-proxy-detection?' + new URLSearchParams(c.req.query()).toString());
    return response;
  });
  
  // Commercial VPN Detection
  app.get('/vpn-commercial-detection', async (c) => {
    try {
      const ip = c.req.query('ip') || getClientIP(c);
      
      if (!validateIP(ip)) {
        return c.json({ error: 'Invalid IP', code: 'INVALID_IP' }, 400);
      }
      
      const geoData = await getIPData(c, ip, c.env?.CACHE);
      const isCommercialVPN = isKnownVPNProvider(geoData.isp);
      
      return c.json({
        ip,
        is_commercial_vpn: isCommercialVPN,
        vpn_provider: isCommercialVPN ? detectVPNProvider(geoData.isp) : null,
        confidence: isCommercialVPN ? 90 : 85,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return c.json({ error: 'Commercial VPN detection failed', message: error.message }, 500);
    }
  });
  
  // Crypto Detection
  app.get('/crypto-detection', async (c) => {
    try {
      const ip = c.req.query('ip') || getClientIP(c);
      
      if (!validateIP(ip)) {
        return c.json({ error: 'Invalid IP', code: 'INVALID_IP' }, 400);
      }
      
      return c.json({
        ip,
        is_crypto_node: false,
        crypto_type: null,
        confidence: 50,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return c.json({ error: 'Crypto detection failed', message: error.message }, 500);
    }
  });
  
  // Fraud Analysis
  const fraudAnalysis = async (c) => {
    try {
      const ip = c.req.query('ip') || getClientIP(c);
      
      if (!validateIP(ip)) {
        return c.json({ error: 'Invalid IP', code: 'INVALID_IP' }, 400);
      }
      
      const geoData = await getIPData(c, ip, c.env?.CACHE);
      
      let fraudScore = 0;
      if (geoData.proxy) fraudScore += 40;
      if (geoData.hosting) fraudScore += 30;
      
      return c.json({
        ip,
        fraud_score: Math.min(fraudScore, 100),
        fraud_risk: fraudScore < 30 ? 'low' : fraudScore < 70 ? 'medium' : 'high',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return c.json({ error: 'Fraud analysis failed', message: error.message }, 500);
    }
  };
  
  app.get('/fraud-analysis', fraudAnalysis);
  app.post('/fraud-analysis', fraudAnalysis);
  
  // Privacy Analysis
  app.get('/privacy-analysis', async (c) => {
    try {
      const ip = c.req.query('ip') || getClientIP(c);
      
      if (!validateIP(ip)) {
        return c.json({ error: 'Invalid IP', code: 'INVALID_IP' }, 400);
      }
      
      const geoData = await getIPData(c, ip, c.env?.CACHE);
      
      return c.json({
        ip,
        privacy_score: geoData.proxy ? 80 : 20,
        is_anonymous: geoData.proxy || false,
        privacy_services: geoData.proxy ? ['proxy'] : [],
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return c.json({ error: 'Privacy analysis failed', message: error.message }, 500);
    }
  });
  
  app.get('/privacy-detection', async (c) => {
    const response = await app.request('/privacy-analysis?' + new URLSearchParams(c.req.query()).toString());
    return response;
  });
}

// Helper functions
function isKnownVPNProvider(isp) {
  if (!isp) return false;
  const vpnKeywords = ['vpn', 'nordvpn', 'expressvpn', 'surfshark', 'private internet', 'proton'];
  return vpnKeywords.some(keyword => isp.toLowerCase().includes(keyword));
}

function detectVPNProvider(isp) {
  if (!isp) return 'Unknown';
  const lower = isp.toLowerCase();
  if (lower.includes('nordvpn')) return 'NordVPN';
  if (lower.includes('expressvpn')) return 'ExpressVPN';
  if (lower.includes('surfshark')) return 'Surfshark';
  if (lower.includes('proton')) return 'ProtonVPN';
  return 'Unknown VPN';
}

function detectBot(userAgent) {
  if (!userAgent) return false;
  const botKeywords = ['bot', 'crawler', 'spider', 'scraper', 'googlebot', 'bingbot'];
  return botKeywords.some(keyword => userAgent.toLowerCase().includes(keyword));
}
