/**
 * CONNECTION CLASSIFIER - Converted from connection_classifier.py
 * Unified connection type classification
 */

export class ConnectionClassifier {
  /**
   * Classify connection type based on geo data and threat data
   */
  classify(geoData, threatData = {}) {
    const isp = (geoData.isp || '').toLowerCase();
    
    let connectionType = 'unknown';
    let connectionCategory = 'residential';
    
    // Mobile carrier detection
    const mobileIndicators = ['mobile', 'cellular', '4g', '5g', 'lte', 'wireless'];
    if (mobileIndicators.some(ind => isp.includes(ind))) {
      connectionType = 'mobile';
      connectionCategory = 'mobile';
    }
    // Datacenter/hosting detection
    else if (isp.includes('hosting') || isp.includes('datacenter') || isp.includes('cloud')) {
      connectionType = 'datacenter';
      connectionCategory = 'business';
    }
    // Broadband detection
    else if (isp.includes('broadband') || isp.includes('fiber') || isp.includes('cable')) {
      connectionType = 'broadband';
      connectionCategory = 'residential';
    }
    // VPN detection
    else if (threatData.isVpn || isp.includes('vpn')) {
      connectionType = 'vpn';
      connectionCategory = 'anonymizer';
    }
    else {
      connectionType = 'residential';
      connectionCategory = 'residential';
    }
    
    return {
      connectionType,
      connectionCategory,
      isMobile: connectionType === 'mobile',
      isDatacenter: connectionType === 'datacenter',
      isResidential: connectionType === 'residential',
      isBusiness: connectionCategory === 'business'
    };
  }
}

export const connectionClassifier = new ConnectionClassifier();
