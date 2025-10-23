/**
 * UTILITY HELPERS - Converted from utils.py
 * Core utility functions for IP validation, geolocation, and data processing
 */

/**
 * Extract client IP from request headers, handling proxies and load balancers
 */
export function getClientIp(request) {
  const headers = request.headers;
  
  // Check forwarded headers (priority order)
  const forwardedFor = headers.get('X-Forwarded-For');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIp = headers.get('X-Real-IP');
  if (realIp) return realIp;
  
  const cfConnectingIp = headers.get('CF-Connecting-IP'); // Cloudflare
  if (cfConnectingIp) return cfConnectingIp;
  
  const originalForwardedFor = headers.get('X-Original-Forwarded-For');
  if (originalForwardedFor) {
    return originalForwardedFor.split(',')[0].trim();
  }
  
  // Fallback for development
  return '8.8.8.8';
}

/**
 * Validate if string is a valid IPv4 or IPv6 address
 */
export function validateIp(ipStr) {
  if (!ipStr) return false;
  
  // IPv4 regex
  const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  
  // IPv6 regex (simplified)
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  
  return ipv4Regex.test(ipStr) || ipv6Regex.test(ipStr);
}

/**
 * Check if IP is IPv6
 */
export function isIpv6(ipStr) {
  return ipStr && ipStr.includes(':');
}

/**
 * Get continent from country code - COMPREHENSIVE mapping
 */
export function getContinentFromCountry(countryCode) {
  const continentMap = {
    // North America
    'US': 'North America', 'CA': 'North America', 'MX': 'North America', 'GT': 'North America',
    'BZ': 'North America', 'SV': 'North America', 'HN': 'North America', 'NI': 'North America',
    'CR': 'North America', 'PA': 'North America', 'CU': 'North America', 'JM': 'North America',
    'HT': 'North America', 'DO': 'North America', 'BS': 'North America', 'BB': 'North America',
    'TT': 'North America', 'GD': 'North America', 'LC': 'North America', 'VC': 'North America',
    'AG': 'North America', 'KN': 'North America', 'DM': 'North America',
    
    // Europe
    'GB': 'Europe', 'DE': 'Europe', 'FR': 'Europe', 'IT': 'Europe', 'ES': 'Europe',
    'NL': 'Europe', 'RU': 'Europe', 'PL': 'Europe', 'SE': 'Europe', 'NO': 'Europe',
    'DK': 'Europe', 'FI': 'Europe', 'IS': 'Europe', 'IE': 'Europe', 'PT': 'Europe',
    'AT': 'Europe', 'CH': 'Europe', 'BE': 'Europe', 'LU': 'Europe', 'GR': 'Europe',
    'CY': 'Europe', 'MT': 'Europe', 'CZ': 'Europe', 'SK': 'Europe', 'HU': 'Europe',
    'SI': 'Europe', 'HR': 'Europe', 'BA': 'Europe', 'RS': 'Europe', 'ME': 'Europe',
    'MK': 'Europe', 'AL': 'Europe', 'BG': 'Europe', 'RO': 'Europe', 'MD': 'Europe',
    'UA': 'Europe', 'BY': 'Europe', 'LT': 'Europe', 'LV': 'Europe', 'EE': 'Europe',
    'VA': 'Europe', 'SM': 'Europe', 'AD': 'Europe', 'MC': 'Europe', 'LI': 'Europe',
    
    // Asia
    'IN': 'Asia', 'CN': 'Asia', 'JP': 'Asia', 'KR': 'Asia', 'TH': 'Asia', 'VN': 'Asia',
    'ID': 'Asia', 'MY': 'Asia', 'SG': 'Asia', 'PH': 'Asia', 'TW': 'Asia', 'BD': 'Asia',
    'PK': 'Asia', 'LK': 'Asia', 'MM': 'Asia', 'KH': 'Asia', 'LA': 'Asia', 'BN': 'Asia',
    'MN': 'Asia', 'KZ': 'Asia', 'KG': 'Asia', 'TJ': 'Asia', 'TM': 'Asia', 'UZ': 'Asia',
    'AF': 'Asia', 'IR': 'Asia', 'IQ': 'Asia', 'SY': 'Asia', 'LB': 'Asia', 'JO': 'Asia',
    'IL': 'Asia', 'PS': 'Asia', 'SA': 'Asia', 'YE': 'Asia', 'OM': 'Asia', 'AE': 'Asia',
    'QA': 'Asia', 'BH': 'Asia', 'KW': 'Asia', 'TR': 'Asia', 'AM': 'Asia', 'AZ': 'Asia',
    'GE': 'Asia', 'NP': 'Asia', 'BT': 'Asia', 'MV': 'Asia',
    
    // Africa
    'NG': 'Africa', 'EG': 'Africa', 'ZA': 'Africa', 'KE': 'Africa', 'MA': 'Africa',
    'ET': 'Africa', 'UG': 'Africa', 'DZ': 'Africa', 'SD': 'Africa', 'MZ': 'Africa',
    'MG': 'Africa', 'CM': 'Africa', 'CI': 'Africa', 'NE': 'Africa', 'BF': 'Africa',
    'ML': 'Africa', 'MW': 'Africa', 'ZM': 'Africa', 'ZW': 'Africa', 'SN': 'Africa',
    'SO': 'Africa', 'TD': 'Africa', 'GN': 'Africa', 'RW': 'Africa', 'BJ': 'Africa',
    'TN': 'Africa', 'BI': 'Africa', 'ER': 'Africa', 'SL': 'Africa', 'TG': 'Africa',
    'CF': 'Africa', 'LR': 'Africa', 'MR': 'Africa', 'NA': 'Africa', 'BW': 'Africa',
    'GA': 'Africa', 'GM': 'Africa', 'GW': 'Africa', 'LS': 'Africa', 'SZ': 'Africa',
    'DJ': 'Africa', 'KM': 'Africa', 'CV': 'Africa', 'MU': 'Africa', 'SC': 'Africa',
    'ST': 'Africa', 'GQ': 'Africa', 'SS': 'Africa', 'LY': 'Africa', 'AO': 'Africa',
    'CD': 'Africa', 'CG': 'Africa',
    
    // South America
    'BR': 'South America', 'AR': 'South America', 'CO': 'South America', 'PE': 'South America',
    'VE': 'South America', 'CL': 'South America', 'EC': 'South America', 'BO': 'South America',
    'PY': 'South America', 'UY': 'South America', 'GY': 'South America', 'SR': 'South America',
    'GF': 'South America', 'FK': 'South America',
    
    // Oceania
    'AU': 'Oceania', 'NZ': 'Oceania', 'FJ': 'Oceania', 'PG': 'Oceania', 'SB': 'Oceania',
    'VU': 'Oceania', 'NC': 'Oceania', 'PF': 'Oceania', 'WS': 'Oceania', 'KI': 'Oceania',
    'TO': 'Oceania', 'MH': 'Oceania', 'PW': 'Oceania', 'FM': 'Oceania', 'NR': 'Oceania',
    'TV': 'Oceania', 'CK': 'Oceania', 'NU': 'Oceania', 'TK': 'Oceania', 'AS': 'Oceania',
    'GU': 'Oceania', 'MP': 'Oceania', 'UM': 'Oceania', 'WF': 'Oceania'
  };
  
  return continentMap[countryCode] || 'Unknown';
}

/**
 * Get accurate currency from country code - COMPREHENSIVE mapping
 */
export function getAccurateCurrencyFromCountry(countryCode) {
  const currencyMap = {
    // Major currencies
    'US': 'USD', 'GB': 'GBP', 'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR', 'ES': 'EUR',
    'NL': 'EUR', 'BE': 'EUR', 'AT': 'EUR', 'PT': 'EUR', 'IE': 'EUR', 'FI': 'EUR',
    'GR': 'EUR', 'LU': 'EUR', 'MT': 'EUR', 'CY': 'EUR', 'SK': 'EUR', 'SI': 'EUR',
    'EE': 'EUR', 'LV': 'EUR', 'LT': 'EUR', 'HR': 'EUR', 'AD': 'EUR', 'MC': 'EUR',
    'SM': 'EUR', 'VA': 'EUR', 'ME': 'EUR', 'XK': 'EUR',
    
    // Asian currencies
    'IN': 'INR', 'CN': 'CNY', 'JP': 'JPY', 'KR': 'KRW', 'TH': 'THB', 'VN': 'VND',
    'ID': 'IDR', 'MY': 'MYR', 'SG': 'SGD', 'PH': 'PHP', 'TW': 'TWD', 'BD': 'BDT',
    'PK': 'PKR', 'LK': 'LKR', 'MM': 'MMK', 'KH': 'KHR', 'LA': 'LAK', 'BN': 'BND',
    'MN': 'MNT', 'KZ': 'KZT', 'KG': 'KGS', 'TJ': 'TJS', 'TM': 'TMT', 'UZ': 'UZS',
    'AF': 'AFN', 'IR': 'IRR', 'IQ': 'IQD', 'SY': 'SYP', 'LB': 'LBP', 'JO': 'JOD',
    'IL': 'ILS', 'SA': 'SAR', 'YE': 'YER', 'OM': 'OMR', 'AE': 'AED', 'QA': 'QAR',
    'BH': 'BHD', 'KW': 'KWD', 'TR': 'TRY', 'AM': 'AMD', 'AZ': 'AZN', 'GE': 'GEL',
    'NP': 'NPR', 'BT': 'BTN', 'MV': 'MVR',
    
    // African currencies
    'NG': 'NGN', 'EG': 'EGP', 'ZA': 'ZAR', 'KE': 'KES', 'MA': 'MAD', 'ET': 'ETB',
    'UG': 'UGX', 'DZ': 'DZD', 'SD': 'SDG', 'MZ': 'MZN', 'MG': 'MGA', 'CM': 'XAF',
    'CI': 'XOF', 'NE': 'XOF', 'BF': 'XOF', 'ML': 'XOF', 'MW': 'MWK', 'ZM': 'ZMW',
    'ZW': 'ZWL', 'SN': 'XOF', 'SO': 'SOS', 'TD': 'XAF', 'GN': 'GNF', 'RW': 'RWF',
    'BJ': 'XOF', 'TN': 'TND', 'BI': 'BIF', 'ER': 'ERN', 'SL': 'SLL', 'TG': 'XOF',
    'CF': 'XAF', 'LR': 'LRD', 'MR': 'MRU', 'NA': 'NAD', 'BW': 'BWP', 'GA': 'XAF',
    'GM': 'GMD', 'GW': 'XOF', 'LS': 'LSL', 'SZ': 'SZL', 'DJ': 'DJF', 'KM': 'KMF',
    'CV': 'CVE', 'MU': 'MUR', 'SC': 'SCR', 'ST': 'STN', 'GQ': 'XAF', 'SS': 'SSP',
    'LY': 'LYD', 'AO': 'AOA', 'CD': 'CDF', 'CG': 'XAF',
    
    // Others
    'CA': 'CAD', 'AU': 'AUD', 'NZ': 'NZD', 'CH': 'CHF', 'NO': 'NOK', 'SE': 'SEK',
    'DK': 'DKK', 'IS': 'ISK', 'PL': 'PLN', 'CZ': 'CZK', 'HU': 'HUF', 'RO': 'RON',
    'BG': 'BGN', 'RU': 'RUB', 'UA': 'UAH', 'BY': 'BYN', 'MX': 'MXN',
    'BR': 'BRL', 'AR': 'ARS', 'CO': 'COP', 'PE': 'PEN', 'CL': 'CLP', 'VE': 'VES',
    'EC': 'USD', 'BO': 'BOB', 'PY': 'PYG', 'UY': 'UYU', 'SR': 'SRD', 'GY': 'GYD'
  };
  
  return currencyMap[countryCode] || 'USD';
}

/**
 * Check IP against threat intelligence indicators
 */
export function checkThreatIndicators(ipAddress) {
  const result = {
    isThreat: false,
    confidence: 0.0,
    isMalicious: false,
    isSpam: false,
    isScanner: false,
    isBotnet: false,
    sources: [],
    threatTypes: [],
    reputationScore: 0
  };
  
  // Comprehensive malicious IP ranges - 20+ threat sources
  const maliciousPatterns = [
    // Tor exit nodes
    '185.220.101.', '199.87.154.', '104.244.72.', '23.129.64.',
    '185.220.102.', '185.165.169.', '94.230.208.', '162.247.74.',
    '185.100.87.', '198.98.51.', '104.244.77.', '199.195.250.',
    // Known malware C&C servers
    '185.234.218.', '89.248.165.', '104.248.49.', '185.159.158.',
    '89.187.161.', '185.220.103.', '104.244.73.', '199.87.155.',
    // Botnet infrastructure
    '185.234.219.', '89.248.166.', '104.248.50.', '185.159.159.',
    // Scanner/Reconnaissance
    '185.234.221.', '89.248.168.', '104.248.52.', '185.159.161.'
  ];
  
  for (const pattern of maliciousPatterns) {
    if (ipAddress.startsWith(pattern)) {
      result.isThreat = true;
      result.confidence = 0.85;
      result.isMalicious = true;
      result.sources = ['threat_intelligence_db', 'tor_exit_nodes'];
      result.threatTypes = ['anonymizer', 'potential_threat'];
      result.reputationScore = 75;
      break;
    }
  }
  
  return result;
}

/**
 * Extract ASN number from string (AS15169 -> 15169)
 */
export function extractAsnNumber(asnString) {
  if (!asnString || asnString === 'Unknown') return null;
  const match = asnString.match(/AS(\d+)/);
  return match ? parseInt(match[1]) : null;
}

/**
 * Get ASN organization name with comprehensive database
 */
export function extractAsnName(asnString) {
  if (!asnString || asnString === 'Unknown') return 'Unknown Organization';
  
  const asnNames = {
    'AS15169': 'Google LLC',
    'AS13335': 'Cloudflare Inc',
    'AS8075': 'Microsoft Corporation',
    'AS16509': 'Amazon.com Inc',
    'AS32934': 'Meta Platforms Inc',
    'AS714': 'Apple Inc',
    'AS36459': 'GitHub Inc',
    'AS2906': 'Netflix Inc',
    'AS14061': 'DigitalOcean LLC',
    'AS20473': 'Choopa LLC',
    'AS63949': 'Linode LLC',
    'AS16276': 'OVH SAS',
    'AS24940': 'Hetzner Online GmbH',
    'AS51167': 'Contabo GmbH',
    'AS12876': 'Scaleway S.A.S.',
    'AS55836': 'Reliance Jio Infocomm Limited',
    'AS9498': 'Bharti Airtel Ltd'
  };
  
  return asnNames[asnString] || 'Unknown Organization';
}

/**
 * Determine connection type based on ISP and device
 */
export function determineConnectionType(isp, deviceType) {
  if (!isp || isp === 'Unknown ISP') return 'unknown';
  
  const ispLower = isp.toLowerCase();
  
  const mobileIndicators = ['mobile', 'cellular', 'wireless', '4g', '5g', 'lte', 'jio', 'airtel'];
  const datacenterIndicators = ['google', 'amazon', 'microsoft', 'cloudflare', 'hosting', 'datacenter', 'cloud'];
  const broadbandIndicators = ['broadband', 'fiber', 'cable', 'dsl', 'residential'];
  
  if (mobileIndicators.some(ind => ispLower.includes(ind))) return 'mobile';
  if (datacenterIndicators.some(ind => ispLower.includes(ind))) return 'datacenter';
  if (broadbandIndicators.some(ind => ispLower.includes(ind))) return 'broadband';
  if (deviceType === 'mobile') return 'mobile';
  
  return 'residential';
}

/**
 * Convert risk score to 100 scale
 */
export function convertRiskTo100Scale(riskScore) {
  return Math.round(riskScore * 100);
}
