/**
 * IP ADDRESS CLASSIFIER - Converted from ip_classifier.py
 * Comprehensive IP address classification and validation
 * Supports IPv4, IPv6, reserved, private, public, and special-purpose IPs
 */

// IP range checking utilities
function ipToNumber(ip) {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
}

function isIpInRange(ip, cidr) {
  const [range, bits = 32] = cidr.split('/');
  const mask = ~(2 ** (32 - parseInt(bits)) - 1);
  return (ipToNumber(ip) & mask) === (ipToNumber(range) & mask);
}

class IPClassifier {
  constructor() {
    // Documentation ranges (RFC 5737)
    this.DOCUMENTATION_RANGES = [
      '192.0.2.0/24',      // TEST-NET-1
      '198.51.100.0/24',   // TEST-NET-2
      '203.0.113.0/24'     // TEST-NET-3
    ];
    
    // Private IP ranges (RFC 1918)
    this.PRIVATE_RANGES = [
      '10.0.0.0/8',
      '172.16.0.0/12',
      '192.168.0.0/16'
    ];
    
    // Special purpose ranges
    this.SPECIAL_RANGES = {
      loopback: ['127.0.0.0/8'],
      link_local: ['169.254.0.0/16'],
      multicast: ['224.0.0.0/4'],
      reserved: ['240.0.0.0/4']
    };
  }
  
  /**
   * Validate and classify an IP address
   */
  validateAndClassify(ipStr) {
    try {
      // Determine IP version
      const isIpv6 = ipStr.includes(':');
      const version = isIpv6 ? 6 : 4;
      
      const classification = {
        valid: true,
        ip: ipStr,
        version,
        isIpv4: version === 4,
        isIpv6: version === 6,
        type: null,
        canGeolocate: true,
        message: null,
        specialPurpose: null
      };
      
      if (version === 4) {
        Object.assign(classification, this._classifyIpv4(ipStr));
      } else {
        Object.assign(classification, this._classifyIpv6(ipStr));
      }
      
      return classification;
    } catch (e) {
      return {
        valid: false,
        ip: ipStr,
        error: `Invalid IP address: ${e.message}`,
        canGeolocate: false
      };
    }
  }
  
  /**
   * Classify IPv4 address
   */
  _classifyIpv4(ip) {
    // Documentation/Testing IPs
    for (const range of this.DOCUMENTATION_RANGES) {
      if (isIpInRange(ip, range)) {
        return {
          type: 'documentation',
          canGeolocate: false,
          message: 'Reserved for documentation/testing (RFC 5737)',
          specialPurpose: 'TEST-NET',
          networkRange: range
        };
      }
    }
    
    // Private IPs
    for (const range of this.PRIVATE_RANGES) {
      if (isIpInRange(ip, range)) {
        return {
          type: 'private',
          canGeolocate: false,
          message: 'Private network IP address (RFC 1918)',
          specialPurpose: 'Private Network',
          networkRange: range
        };
      }
    }
    
    // Loopback
    if (isIpInRange(ip, '127.0.0.0/8')) {
      return {
        type: 'loopback',
        canGeolocate: false,
        message: 'Loopback address (localhost)',
        specialPurpose: 'Loopback',
        networkRange: '127.0.0.0/8'
      };
    }
    
    // Link-local
    if (isIpInRange(ip, '169.254.0.0/16')) {
      return {
        type: 'link_local',
        canGeolocate: false,
        message: 'Link-local address (APIPA)',
        specialPurpose: 'Link-Local',
        networkRange: '169.254.0.0/16'
      };
    }
    
    // Multicast
    if (isIpInRange(ip, '224.0.0.0/4')) {
      return {
        type: 'multicast',
        canGeolocate: false,
        message: 'Multicast address',
        specialPurpose: 'Multicast',
        networkRange: '224.0.0.0/4'
      };
    }
    
    // Reserved
    if (isIpInRange(ip, '240.0.0.0/4')) {
      return {
        type: 'reserved',
        canGeolocate: false,
        message: 'Reserved for future use',
        specialPurpose: 'Reserved',
        networkRange: '240.0.0.0/4'
      };
    }
    
    // Broadcast
    if (ip === '255.255.255.255') {
      return {
        type: 'broadcast',
        canGeolocate: false,
        message: 'Broadcast address',
        specialPurpose: 'Broadcast'
      };
    }
    
    // Public IP (can be geolocated)
    return {
      type: 'public',
      canGeolocate: true,
      message: 'Public IP address',
      specialPurpose: null
    };
  }
  
  /**
   * Classify IPv6 address
   */
  _classifyIpv6(ip) {
    const ipLower = ip.toLowerCase();
    
    // Loopback ::1
    if (ipLower === '::1' || ipLower === '0:0:0:0:0:0:0:1') {
      return {
        type: 'loopback',
        canGeolocate: false,
        message: 'IPv6 loopback address (::1)',
        specialPurpose: 'Loopback'
      };
    }
    
    // Link-local fe80::/10
    if (ipLower.startsWith('fe80:')) {
      return {
        type: 'link_local',
        canGeolocate: false,
        message: 'IPv6 link-local address',
        specialPurpose: 'Link-Local',
        networkRange: 'fe80::/10'
      };
    }
    
    // Private/Unique Local fc00::/7
    if (ipLower.startsWith('fc') || ipLower.startsWith('fd')) {
      return {
        type: 'private',
        canGeolocate: false,
        message: 'IPv6 unique local address',
        specialPurpose: 'Private/ULA',
        networkRange: 'fc00::/7'
      };
    }
    
    // Multicast ff00::/8
    if (ipLower.startsWith('ff')) {
      return {
        type: 'multicast',
        canGeolocate: false,
        message: 'IPv6 multicast address',
        specialPurpose: 'Multicast',
        networkRange: 'ff00::/8'
      };
    }
    
    // Documentation 2001:db8::/32
    if (ipLower.startsWith('2001:db8:')) {
      return {
        type: 'documentation',
        canGeolocate: false,
        message: 'IPv6 documentation address (RFC 3849)',
        specialPurpose: 'Documentation',
        networkRange: '2001:db8::/32'
      };
    }
    
    // Public IPv6
    return {
      type: 'public',
      canGeolocate: true,
      message: 'Public IPv6 address',
      specialPurpose: null
    };
  }
  
  /**
   * Generate appropriate response for special IP addresses
   */
  getSpecialResponse(ipStr, classification) {
    if (!classification.valid) {
      return {
        error: true,
        ip: ipStr,
        message: classification.error || 'Invalid IP address',
        type: 'invalid',
        canGeolocate: false
      };
    }
    
    if (!classification.canGeolocate) {
      const response = {
        ip: classification.ip,
        ipVersion: `IPv${classification.version}`,
        type: classification.type,
        specialPurpose: classification.specialPurpose,
        message: classification.message,
        canGeolocate: false,
        geolocationAvailable: false
      };
      
      if (classification.networkRange) {
        response.networkRange = classification.networkRange;
      }
      
      // Add helpful information based on type
      if (classification.type === 'documentation') {
        response.usage = 'Used in documentation and examples only. Never appears on the Internet.';
        response.rfc = 'RFC 5737 (IPv4) or RFC 3849 (IPv6)';
      } else if (classification.type === 'private') {
        response.usage = 'Used within private networks. Not routable on the Internet.';
        response.rfc = 'RFC 1918 (IPv4) or RFC 4193 (IPv6)';
      } else if (classification.type === 'loopback') {
        response.usage = 'Loopback address. Routes traffic to the local machine.';
        response.location = 'localhost (your computer)';
      } else if (classification.type === 'link_local') {
        response.usage = 'Link-local address. Used for local network only.';
      }
      
      return response;
    }
    
    // Public IP - can proceed with geolocation
    return null;
  }
}

// Create and export global instance
export const ipClassifier = new IPClassifier();
