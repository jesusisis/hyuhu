/**
 * RESPONSE FORMATTER - Converted from response_formatter.py and utils.py
 * Format API responses with all required fields
 */

import { getContinentFromCountry, getAccurateCurrencyFromCountry, determineConnectionType, extractAsnName } from './helpers.js';

/**
 * Format the complete API response
 */
export function formatResponse(ip, geoData, riskAnalysis, deviceType, options = {}) {
  const {
    includeAdvanced = false,
    cached = false,
    userAgent = null
  } = options;
  
  // Ensure safe defaults
  const safeGeoData = {
    country: geoData?.country || 'Unknown',
    country_code: geoData?.country_code || 'XX',
    region: geoData?.region || 'Unknown',
    city: geoData?.city || 'Unknown',
    isp: geoData?.isp || 'Unknown ISP',
    asn: geoData?.asn || 'Unknown',
    currency: geoData?.currency || 'USD',
    latitude: geoData?.latitude || 0.0,
    longitude: geoData?.longitude || 0.0,
    timezone: geoData?.timezone || 'UTC',
    continent: geoData?.continent || 'Unknown',
    ...geoData
  };
  
  const countryCode = safeGeoData.country_code;
  const currency = countryCode !== 'XX' ? getAccurateCurrencyFromCountry(countryCode) : safeGeoData.currency;
  const continent = getContinentFromCountry(countryCode);
  
  // Build response
  const response = {
    // Core identification
    ip,
    ip_version: ip.includes(':') ? 'IPv6' : 'IPv4',
    
    // Location data
    country: safeGeoData.country,
    country_code: countryCode,
    region: safeGeoData.region,
    region_code: safeGeoData.region_code || '',
    city: safeGeoData.city,
    zip_code: safeGeoData.zip_code || safeGeoData.postal || '',
    postal_code: safeGeoData.zip_code || safeGeoData.postal || '',
    latitude: safeGeoData.latitude,
    longitude: safeGeoData.longitude,
    continent,
    
    // Time and currency
    timezone: safeGeoData.timezone,
    utc_offset: safeGeoData.utc_offset || safeGeoData.timezone_offset || '+00:00',
    currency,
    languages: safeGeoData.languages || ['en'],
    
    // Network data
    isp: safeGeoData.isp,
    organization: safeGeoData.org || safeGeoData.isp,
    asn: safeGeoData.asn,
    asn_organization: extractAsnName(safeGeoData.asn),
    
    // Connection type
    connection_type: determineConnectionType(safeGeoData.isp, deviceType),
    usage_type: safeGeoData.usage_type || 'isp',
    
    // Device info
    device_type: deviceType || 'desktop',
    
    // Security/Risk data
    risk_score: riskAnalysis?.riskScore ? Math.round(riskAnalysis.riskScore * 100) : 0,
    risk_level: riskAnalysis?.riskLevel || 'low',
    is_vpn: riskAnalysis?.isVpn || false,
    is_tor: riskAnalysis?.isTor || false,
    is_proxy: riskAnalysis?.isProxy || false,
    is_hosting: riskAnalysis?.isHosting || false,
    is_bot: riskAnalysis?.isBot || false,
    
    // Metadata
    timestamp: new Date().toISOString(),
    cached,
    data_source: safeGeoData.data_source || safeGeoData.api_source || 'hybrid'
  };
  
  // Add advanced features if requested
  if (includeAdvanced) {
    response.advanced = {
      confidence: safeGeoData.confidence || 0.7,
      accuracy_radius_km: safeGeoData.accuracy_radius_km || 50,
      anonymity_level: riskAnalysis?.anonymityLevel || 'none',
      threat_types: riskAnalysis?.factors || []
    };
  }
  
  return response;
}
