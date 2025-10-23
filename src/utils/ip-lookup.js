/**
 * IP Lookup Utilities
 * Fetches IP geolocation data from multiple free sources
 */

/**
 * Get client IP from request
 */
export function getClientIP(c) {
  // Cloudflare provides the client IP in headers
  return c.req.header('CF-Connecting-IP') || 
         c.req.header('X-Forwarded-For')?.split(',')[0] || 
         c.req.header('X-Real-IP') ||
         '8.8.8.8'; // fallback
}

/**
 * Validate IP address format
 */
export function validateIP(ip) {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

/**
 * Fetch IP geolocation data from ip-api.com (free)
 */
export async function fetchIPData(ip) {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=66846719`);
    const data = await response.json();
    
    if (data.status === 'fail') {
      throw new Error(data.message || 'IP lookup failed');
    }
    
    return {
      ip: data.query,
      country: data.country,
      country_code: data.countryCode,
      region: data.regionName,
      region_code: data.region,
      city: data.city,
      zip_code: data.zip,
      latitude: data.lat,
      longitude: data.lon,
      timezone: data.timezone,
      isp: data.isp,
      org: data.org,
      asn: data.as,
      mobile: data.mobile,
      proxy: data.proxy,
      hosting: data.hosting,
      currency: data.currency,
      continent: data.continent,
      continent_code: data.continentCode,
      district: data.district,
      offset: data.offset,
      data_source: 'ip-api.com',
      cached_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('IP lookup error:', error);
    throw error;
  }
}

/**
 * Get IP data with caching
 */
export async function getIPData(c, ip, cache = null) {
  // Check cache first
  if (cache) {
    const cached = await cache.get(`ip:${ip}`);
    if (cached) {
      const data = JSON.parse(cached);
      data.cached = true;
      return data;
    }
  }
  
  // Fetch fresh data
  const data = await fetchIPData(ip);
  
  // Cache for 1 hour
  if (cache) {
    await cache.put(`ip:${ip}`, JSON.stringify(data), {
      expirationTtl: 3600
    });
  }
  
  data.cached = false;
  return data;
}

/**
 * Calculate accuracy radius based on IP type
 */
export function calculateAccuracy(geoData) {
  let radiusKm = 200;
  
  if (geoData.hosting) {
    radiusKm = 50; // Datacenter IPs are more accurate
  } else if (geoData.mobile) {
    radiusKm = 500; // Mobile IPs can roam
  } else if (geoData.proxy) {
    radiusKm = 5000; // Proxies can be anywhere
  }
  
  return {
    accuracy_radius_km: radiusKm,
    accuracy_radius_miles: Math.round(radiusKm * 0.621371),
    confidence_score: geoData.hosting ? 90 : geoData.mobile ? 60 : 75
  };
}

/**
 * Detect special IPs (private, loopback, etc.)
 */
export function isSpecialIP(ip) {
  const parts = ip.split('.');
  
  // Loopback
  if (ip === '127.0.0.1' || ip === '::1') {
    return { type: 'loopback', can_geolocate: false };
  }
  
  // Private IPs
  if (
    parts[0] === '10' ||
    (parts[0] === '172' && parseInt(parts[1]) >= 16 && parseInt(parts[1]) <= 31) ||
    (parts[0] === '192' && parts[1] === '168')
  ) {
    return { type: 'private', can_geolocate: false };
  }
  
  // Documentation IPs
  if (parts[0] === '192' && parts[1] === '0' && parts[2] === '2') {
    return { type: 'documentation', can_geolocate: false };
  }
  
  return { type: 'public', can_geolocate: true };
}
