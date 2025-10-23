/**
 * Core API Routes - UPDATED WITH CONVERTED JAVASCRIPT SERVICES
 * Main IP lookup, status, health endpoints
 */

import { getClientIp, validateIp } from '../utils/helpers.js';
import { ipClassifier } from '../utils/ip-classifier.js';
import { userAgentParser } from '../utils/user-agent-parser.js';
import { formatResponse } from '../utils/response-formatter.js';
import { CacheManager } from '../services/cache-manager.js';
import { IPDatabase } from '../services/ip-database.js';
import { MLRiskDetector } from '../services/ml-risk-detector.js';
import { threatIntel } from '../services/threat-intelligence.js';
import { gdprCompliance } from '../services/gdpr-compliance.js';
import { accuracyScorer } from '../services/accuracy-scoring.js';
import { connectionClassifier } from '../services/connection-classifier.js';

export function registerCoreRoutes(app) {
  
  // Main IP Lookup - GET/POST /
  app.get('/', async (c) => {
    try {
      // Get IP from query or auto-detect
      let targetIp = c.req.query('ip');
      let autoDetected = false;
      
      if (!targetIp) {
        targetIp = getClientIp(c.req.raw);
        autoDetected = true;
      }
      
      // Validate IP
      if (!validateIp(targetIp)) {
        return c.json({
          error: 'Invalid IP address format',
          code: 'INVALID_IP',
          ip: targetIp
        }, 400);
      }
      
      // Classify IP (check for special IPs)
      const classification = ipClassifier.validateAndClassify(targetIp);
      
      if (!classification.canGeolocate) {
        const specialResponse = ipClassifier.getSpecialResponse(targetIp, classification);
        if (specialResponse) {
          specialResponse.timestamp = new Date().toISOString();
          specialResponse.auto_detect_ip = autoDetected;
          return c.json(specialResponse);
        }
      }
      
      // Initialize services with KV namespace (handle undefined env in internal requests)
      const cache = c.env?.CACHE || null;
      const cacheManager = new CacheManager(cache, 24);
      const ipDatabase = new IPDatabase(cache);
      const mlDetector = new MLRiskDetector();
      
      // Check cache
      const cached = await cacheManager.get(targetIp);
      if (cached) {
        cached.auto_detect_ip = autoDetected;
        cached.cached = true;
        return c.json(cached);
      }
      
      // Lookup geolocation data
      const geoData = await ipDatabase.lookup(targetIp);
      if (!geoData) {
        return c.json({
          error: 'IP geolocation data not found',
          code: 'DATA_NOT_FOUND',
          ip: targetIp
        }, 404);
      }
      
      // Parse user agent
      const userAgent = c.req.header('User-Agent') || '';
      const deviceInfo = userAgentParser.parse(userAgent);
      
      // Perform risk analysis
      const riskAnalysis = mlDetector.analyzeIpRisk(
        targetIp,
        geoData.isp,
        geoData.asn,
        geoData.country,
        '',
        deviceInfo.deviceType
      );
      
      // Get threat intelligence
      const threatData = threatIntel.analyze(targetIp);
      
      // Get accuracy info
      const accuracyInfo = accuracyScorer.calculateAccuracy(geoData, threatData);
      
      // Get GDPR compliance info
      const gdprInfo = gdprCompliance.getComplianceInfo(geoData.country_code);
      
      // Get connection classification
      const connectionInfo = connectionClassifier.classify(geoData, threatData);
      
      // Format response
      const response = formatResponse(targetIp, geoData, riskAnalysis, deviceInfo.deviceType, {
        cached: false,
        userAgent
      });
      
      // Add additional data
      Object.assign(response, {
        ...accuracyInfo,
        ...gdprInfo,
        ...connectionInfo,
        auto_detect_ip: autoDetected,
        user_agent_info: deviceInfo,
        api_version: c.env?.API_VERSION || '2.0.0'
      });
      
      // Cache the result
      await cacheManager.set(targetIp, response);
      
      return c.json(response);
      
    } catch (error) {
      console.error('Main endpoint error:', error);
      return c.json({
        error: 'Failed to retrieve IP data',
        code: 'LOOKUP_ERROR',
        message: error.message
      }, 500);
    }
  });
  
  // Alternative API endpoint
  app.get('/api', async (c) => {
    return app.request('/?' + new URLSearchParams(c.req.query()).toString(), {
      method: 'GET',
      headers: c.req.raw.headers
    });
  });
  
  // API Status - Updated with new features
  app.get('/status', async (c) => {
    const cache = c.env?.CACHE || null;
    const cacheManager = new CacheManager(cache, 24);
    const stats = cacheManager.getStats();
    
    return c.json({
      status: 'operational',
      version: c.env?.API_VERSION || '2.0.0',
      api_version: 'v2',
      uptime: 'Cloudflare Workers',
      endpoints: {
        total: 122,
        core: 4,
        security: 27,
        business: 8,
        network: 10,
        enrichment: 7,
        utilities: 7,
        aliases: 59
      },
      cache: {
        enabled: c.env?.ENABLE_CACHING === 'true',
        provider: c.env?.CACHE ? 'cloudflare-kv' : 'none',
        stats
      },
      features: {
        ip_lookup: true,
        vpn_detection: true,
        threat_intelligence: true,
        gdpr_compliance: true,
        accuracy_scoring: true,
        batch_processing: true,
        ml_risk_detection: true
      },
      data_sources: ['ip-api.com', 'ipapi.co', 'internal_databases', 'threat_intelligence'],
      timestamp: new Date().toISOString()
    });
  });
  
  // Health Check
  app.get('/health', async (c) => {
    const health = {
      status: 'healthy',
      api_version: c.env?.API_VERSION || '2.0.0',
      checks: {
        api: 'ok',
        cache: c.env?.CACHE ? 'ok' : 'disabled',
        external_apis: 'ok'
      },
      performance: {
        region: c.req.header('CF-Ray')?.split('-')[1] || 'unknown',
        colo: c.req.header('CF-Ray') || 'unknown'
      },
      timestamp: new Date().toISOString()
    };
    
    return c.json(health);
  });
  
  // Batch processing
  app.post('/batch', async (c) => {
    try {
      const body = await c.req.json();
      const ips = body.ips || [];
      
      if (!Array.isArray(ips) || ips.length === 0) {
        return c.json({
          error: 'No IPs provided',
          code: 'EMPTY_IP_LIST'
        }, 400);
      }
      
      if (ips.length > 100) {
        return c.json({
          error: 'Maximum 100 IPs allowed per batch',
          code: 'BATCH_SIZE_EXCEEDED',
          max_allowed: 100,
          provided: ips.length
        }, 400);
      }
      
      // Process each IP with new services
      const cache = c.env?.CACHE || null;
      const ipDatabase = new IPDatabase(cache);
      
      const results = await Promise.all(
        ips.map(async (ip) => {
          try {
            if (!validateIp(ip)) {
              return { ip, error: 'Invalid IP format', code: 'INVALID_IP' };
            }
            
            const geoData = await ipDatabase.lookup(ip);
            if (!geoData) {
              return { ip, error: 'Data not found', code: 'DATA_NOT_FOUND' };
            }
            
            return { 
              ip, 
              data: {
                country: geoData.country,
                city: geoData.city,
                latitude: geoData.latitude,
                longitude: geoData.longitude,
                isp: geoData.isp
              }
            };
          } catch (error) {
            return { ip, error: error.message, code: 'LOOKUP_ERROR' };
          }
        })
      );
      
      return c.json({
        total: ips.length,
        processed: results.filter(r => !r.error).length,
        failed: results.filter(r => r.error).length,
        results
      });
      
    } catch (error) {
      return c.json({
        error: 'Batch processing failed',
        code: 'BATCH_ERROR',
        message: error.message
      }, 500);
    }
  });
}

// All helper functions now handled by imported modules
