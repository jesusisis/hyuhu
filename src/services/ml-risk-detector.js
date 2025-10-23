/**
 * ML RISK DETECTOR - Converted from ml_risk_detector.py
 * AI-powered risk detection for IP addresses with enhanced VPN/proxy detection
 */

export class MLRiskDetector {
  constructor() {
    this.vpnPatterns = this._loadVpnPatterns();
    this.suspiciousAsns = this._loadSuspiciousAsns();
    this.legitimateDnsAsns = this._loadLegitimateDnsAsns();
    this.torExitNodes = this._loadTorExitNodes();
    this.knownVpnAsns = this._loadKnownVpnAsns();
    
    this.riskWeights = {
      vpnIndicator: 0.35,
      suspiciousAsn: 0.30,
      torExit: 0.50,
      proxyPattern: 0.40,
      geographicAnomaly: 0.15,
      knownVpnAsn: 0.40,
      hostingProvider: 0.25,
      botBehavior: 0.60,
      mobileNetwork: -0.10
    };
  }
  
  _loadVpnPatterns() {
    const patterns = [
      /\bvpn\b/i, /nordvpn/i, /expressvpn/i, /surfshark/i, /cyberghost/i, /purevpn/i,
      /hotspot.*shield/i, /tunnelbear/i, /windscribe/i, /protonvpn/i,
      /\bproxy\b/i, /proxies/i, /anonymous.*proxy/i, /tor.*exit/i, /tor.*relay/i,
      /\bhosting\b/i, /datacenter/i, /data.*center/i, /cloud.*hosting/i,
      /digital.*ocean/i, /amazon.*aws/i, /google.*cloud/i, /microsoft.*azure/i,
      /linode/i, /vultr/i, /\bovh\b/i, /hetzner/i, /scaleway/i
    ];
    return patterns;
  }
  
  _loadSuspiciousAsns() {
    return new Set([
      'AS6939', 'AS209', 'AS174', 'AS3356', 'AS1299', 'AS701',
      'AS14061', 'AS20473', 'AS63949', 'AS16276', 'AS24940',
      'AS16509', 'AS8075', 'AS51167', 'AS8100', 'AS12876'
    ]);
  }
  
  _loadLegitimateDnsAsns() {
    return new Set([
      'AS15169',  // Google DNS
      'AS13335',  // Cloudflare DNS
      'AS36692',  // OpenDNS
      'AS19281',  // Quad9
      'AS1101'    // IBM Quad9
    ]);
  }
  
  _loadKnownVpnAsns() {
    return {
      'AS6939': 'Hurricane Electric (VPN Infrastructure)',
      'AS14061': 'DigitalOcean (VPN Hosting)',
      'AS20473': 'Choopa/Vultr (VPN Hosting)',
      'AS63949': 'Linode (VPN Hosting)',
      'AS16276': 'OVH SAS (VPN Hosting)',
      'AS24940': 'Hetzner Online (VPN Hosting)',
      'AS51167': 'Contabo (VPN Hosting)',
      'AS12876': 'Scaleway (VPN Hosting)'
    };
  }
  
  _loadTorExitNodes() {
    return new Set([
      '185.220.101.1', '185.220.101.2', '185.220.102.8',
      '185.100.87.202', '199.249.230.68', '45.141.215.100',
      '199.87.154.255', '23.129.64.1', '162.247.74.200'
    ]);
  }
  
  /**
   * Analyze IP risk with comprehensive checks
   */
  analyzeIpRisk(ip, isp = '', asn = '', country = '', hostname = '', deviceType = '') {
    const features = this._extractFeatures(ip, isp, asn, country, hostname);
    const riskScore = this._calculateAdvancedRiskScore(features);
    const classification = this._classifyRisk(riskScore);
    
    return {
      riskScore: Math.min(Math.max(riskScore, 0), 1),
      riskLevel: classification.level,
      riskCategory: classification.category,
      isVpn: features.vpnDetected,
      isTor: features.isTor,
      isProxy: features.isProxy,
      isHosting: features.isHosting,
      isBot: false,
      isMalicious: riskScore > 0.7,
      confidence: features.confidence,
      factors: features.detectionFactors,
      vpnService: features.vpnService || null,
      anonymityLevel: this._calculateAnonymityLevel(features)
    };
  }
  
  _extractFeatures(ip, isp, asn, country, hostname) {
    const ispLower = (isp || '').toLowerCase();
    const hostnameLower = (hostname || '').toLowerCase();
    
    const features = {
      vpnDetected: false,
      isTor: false,
      isProxy: false,
      isHosting: false,
      detectionFactors: [],
      confidence: 0.5,
      vpnService: null
    };
    
    // Check Tor exit nodes
    if (this.torExitNodes.has(ip)) {
      features.isTor = true;
      features.vpnDetected = true;
      features.detectionFactors.push('tor_exit_node');
      features.confidence = 0.95;
    }
    
    // Check VPN patterns in ISP name
    for (const pattern of this.vpnPatterns) {
      if (pattern.test(ispLower) || pattern.test(hostnameLower)) {
        features.vpnDetected = true;
        features.detectionFactors.push('vpn_pattern_match');
        features.confidence = Math.max(features.confidence, 0.75);
        break;
      }
    }
    
    // Check suspicious ASNs
    if (asn && this.suspiciousAsns.has(asn)) {
      features.vpnDetected = true;
      features.detectionFactors.push('suspicious_asn');
      features.confidence = Math.max(features.confidence, 0.70);
    }
    
    // Check known VPN ASNs
    if (asn && this.knownVpnAsns[asn]) {
      features.vpnDetected = true;
      features.vpnService = this.knownVpnAsns[asn];
      features.detectionFactors.push('known_vpn_asn');
      features.confidence = Math.max(features.confidence, 0.80);
    }
    
    // Check if legitimate service
    if (this._isLegitimateService(isp, asn)) {
      features.vpnDetected = false;
      features.detectionFactors = ['legitimate_service'];
      features.confidence = 0.90;
    }
    
    // Check hosting/datacenter patterns
    const hostingPatterns = [/hosting/i, /datacenter/i, /cloud/i, /server/i, /vps/i];
    if (hostingPatterns.some(p => p.test(ispLower))) {
      features.isHosting = true;
      features.detectionFactors.push('hosting_provider');
    }
    
    return features;
  }
  
  _isLegitimateService(isp, asn) {
    if (!isp || !asn) return false;
    
    const ispLower = isp.toLowerCase();
    const legitimatePatterns = ['google', 'cloudflare', 'opendns', 'quad9', 'amazon cloudfront'];
    
    return legitimatePatterns.some(p => ispLower.includes(p)) || 
           this.legitimateDnsAsns.has(asn);
  }
  
  _calculateAdvancedRiskScore(features) {
    let score = 0;
    
    if (features.isTor) score += this.riskWeights.torExit;
    if (features.vpnDetected) score += this.riskWeights.vpnIndicator;
    if (features.isProxy) score += this.riskWeights.proxyPattern;
    if (features.isHosting) score += this.riskWeights.hostingProvider;
    if (features.detectionFactors.includes('suspicious_asn')) {
      score += this.riskWeights.suspiciousAsn;
    }
    
    return Math.min(score, 1.0);
  }
  
  _classifyRisk(riskScore) {
    if (riskScore >= 0.7) {
      return { level: 'high', category: 'high_risk' };
    } else if (riskScore >= 0.4) {
      return { level: 'medium', category: 'medium_risk' };
    } else {
      return { level: 'low', category: 'low_risk' };
    }
  }
  
  _calculateAnonymityLevel(features) {
    if (features.isTor) return 'very_high';
    if (features.vpnDetected) return 'high';
    if (features.isProxy) return 'medium';
    if (features.isHosting) return 'low';
    return 'none';
  }
}
