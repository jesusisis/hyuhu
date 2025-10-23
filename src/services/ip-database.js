/**
 * IP DATABASE - Converted from ip_database.py
 * IP geolocation database handler with fallback data and external API integration
 */

import { getAccurateCurrencyFromCountry } from '../utils/helpers.js';

export class IPDatabase {
  constructor(kvNamespace) {
    this.kv = kvNamespace; // For caching API responses
    this.fallbackData = this._getFallbackData();
  }
  
  /**
   * Fallback data for common IPs
   */
  _getFallbackData() {
    return {
      '8.8.8.8': {
        country: 'United States', country_code: 'US', region: 'California',
        region_code: 'CA', city: 'Mountain View', zip_code: '94043',
        latitude: 37.4056, longitude: -122.0775, timezone: 'America/Los_Angeles',
        currency: 'USD', isp: 'Google LLC', asn: 'AS15169', confidence: 0.95
      },
      '1.1.1.1': {
        country: 'United States', country_code: 'US', region: 'California',
        region_code: 'CA', city: 'San Francisco', zip_code: '94107',
        latitude: 37.7621, longitude: -122.3971, timezone: 'America/Los_Angeles',
        currency: 'USD', isp: 'Cloudflare Inc', asn: 'AS13335', confidence: 0.95
      },
      '208.67.222.222': {
        country: 'United States', country_code: 'US', region: 'California',
        region_code: 'CA', city: 'San Jose', zip_code: '95101',
        latitude: 37.3382, longitude: -121.8863, timezone: 'America/Los_Angeles',
        currency: 'USD', isp: 'Cisco OpenDNS LLC', asn: 'AS36692', confidence: 0.95
      },
      // IPv6 addresses
      '2001:4860:4860::8888': {
        country: 'United States', country_code: 'US', region: 'California',
        region_code: 'CA', city: 'Mountain View', zip_code: '94043',
        latitude: 37.4056, longitude: -122.0775, timezone: 'America/Los_Angeles',
        currency: 'USD', isp: 'Google LLC', asn: 'AS15169', confidence: 0.95
      },
      '2606:4700:4700::1111': {
        country: 'United States', country_code: 'US', region: 'California',
        region_code: 'CA', city: 'San Francisco', zip_code: '94107',
        latitude: 37.7621, longitude: -122.3971, timezone: 'America/Los_Angeles',
        currency: 'USD', isp: 'Cloudflare Inc', asn: 'AS13335', confidence: 0.95
      }
    };
  }
  
  /**
   * Lookup IP geolocation data - fetch from external APIs
   */
  async lookup(ip) {
    try {
      // Try to fetch from external API (real-time data)
      const externalData = await this._fetchFromExternalApi(ip);
      if (externalData) {
        externalData.cachedAt = new Date().toISOString();
        externalData.dataSource = 'real-time_api';
        console.log(`✅ Using REAL-TIME data for ${ip}: ${externalData.city}, ${externalData.country}`);
        
        // Cache in KV for future use (if KV is available)
        if (this.kv) {
          await this.kv.put(`ip:${ip}`, JSON.stringify(externalData), {
            expirationTtl: 86400 // 24 hours
          });
        }
        
        return externalData;
      }
      
      // Check KV cache (from previous API calls) - only if KV is available
      if (this.kv) {
        const cached = await this.kv.get(`ip:${ip}`, { type: 'json' });
        if (cached) {
          console.log(`📦 Using cached data for ${ip}`);
          return cached;
        }
      }
      
      // Check fallback data for known IPs
      if (this.fallbackData[ip]) {
        const result = { ...this.fallbackData[ip] };
        result.cachedAt = new Date().toISOString();
        result.dataSource = 'fallback_data';
        console.log(`⚠️ Using FALLBACK data for ${ip}`);
        return result;
      }
      
      // Estimate based on IP ranges
      const estimated = this._estimateLocation(ip);
      if (estimated) {
        estimated.cachedAt = new Date().toISOString();
        estimated.dataSource = 'estimated';
        console.log(`⚠️ Using ESTIMATED data for ${ip}`);
        return estimated;
      }
      
      return null;
    } catch (e) {
      console.error(`Error looking up IP ${ip}:`, e);
      return null;
    }
  }
  
  /**
   * Fetch geolocation data from external API
   */
  async _fetchFromExternalApi(ip) {
    const apis = [
      {
        name: 'ip-api.com',
        url: `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`,
        parser: (data) => this._parseIpapiResponse(data, ip)
      },
      {
        name: 'ipapi.co',
        url: `https://ipapi.co/${ip}/json/`,
        parser: (data) => this._parseIpapicoResponse(data, ip)
      }
    ];
    
    for (const api of apis) {
      try {
        const response = await fetch(api.url, { 
          headers: { 'User-Agent': 'CloudflareWorker/1.0' },
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        
        if (!response.ok) continue;
        
        const data = await response.json();
        const result = api.parser(data);
        
        if (result) {
          console.log(`✅ Fetched data from ${api.name} for ${ip}`);
          return result;
        }
      } catch (e) {
        console.warn(`⚠️ ${api.name} failed for ${ip}:`, e.message);
        continue;
      }
    }
    
    console.error(`❌ All external APIs failed for ${ip}`);
    return null;
  }
  
  /**
   * Parse ip-api.com response
   */
  _parseIpapiResponse(data, ip) {
    if (data.status !== 'success') return null;
    
    return {
      country: data.country || 'Unknown',
      country_code: data.countryCode || 'XX',
      region: data.regionName || 'Unknown',
      region_code: data.region || '',
      city: data.city || 'Unknown',
      zip_code: data.zip || '',
      latitude: parseFloat(data.lat) || 0.0,
      longitude: parseFloat(data.lon) || 0.0,
      timezone: data.timezone || 'UTC',
      currency: 'USD', // Will be fixed by accuracy enhancements
      isp: data.isp || 'Unknown ISP',
      org: data.org || data.isp || 'Unknown',
      asn: data.as ? data.as.split(' ')[0] : 'Unknown',
      confidence: 0.95,
      api_source: 'ip-api.com'
    };
  }
  
  /**
   * Parse ipapi.co response
   */
  _parseIpapicoResponse(data, ip) {
    if (data.error) return null;
    
    return {
      country: data.country_name || 'Unknown',
      country_code: data.country_code || 'XX',
      region: data.region || 'Unknown',
      region_code: data.region_code || 'XX',
      city: data.city || 'Unknown',
      zip_code: data.postal || '',
      latitude: parseFloat(data.latitude) || 0.0,
      longitude: parseFloat(data.longitude) || 0.0,
      timezone: data.timezone || 'UTC',
      currency: data.currency || 'USD',
      isp: data.org || 'Unknown ISP',
      org: data.org || 'Unknown',
      asn: data.asn || 'Unknown',
      confidence: 0.9,
      api_source: 'ipapi.co'
    };
  }
  
  /**
   * Estimate location based on IP ranges
   */
  _estimateLocation(ip) {
    // Simplified estimation - in production use proper GeoIP database
    const firstOctet = parseInt(ip.split('.')[0]);
    
    // Basic ranges estimation
    if (firstOctet >= 1 && firstOctet <= 126) {
      return this._createEstimate('United States', 'US', 37.0902, -95.7129);
    } else if (firstOctet >= 128 && firstOctet <= 191) {
      return this._createEstimate('Europe', 'EU', 50.1109, 8.6821);
    } else {
      return this._createEstimate('Asia', 'AS', 34.0522, 100.4966);
    }
  }
  
  _createEstimate(country, countryCode, lat, lon) {
    return {
      country,
      country_code: countryCode,
      region: 'Unknown',
      region_code: '',
      city: 'Unknown',
      zip_code: '',
      latitude: lat,
      longitude: lon,
      timezone: 'UTC',
      currency: getAccurateCurrencyFromCountry(countryCode),
      isp: 'Unknown ISP',
      org: 'Unknown',
      asn: 'Unknown',
      confidence: 0.3
    };
  }
}
