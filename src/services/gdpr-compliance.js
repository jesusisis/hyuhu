/**
 * GDPR COMPLIANCE - Converted from gdpr_compliance.py
 * GDPR compliance indicators and checks
 */

export class GDPRCompliance {
  constructor() {
    this.gdprCountries = new Set([
      // EU member states
      'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
      'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
      'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
      // EEA countries
      'IS', 'LI', 'NO',
      // Other GDPR-equivalent countries
      'GB', 'CH'
    ]);
    
    this.dataProtectionLaws = {
      'US': { law: 'CCPA', name: 'California Consumer Privacy Act', scope: 'State-level' },
      'BR': { law: 'LGPD', name: 'Lei Geral de Proteção de Dados', scope: 'Federal' },
      'CA': { law: 'PIPEDA', name: 'Personal Information Protection Act', scope: 'Federal' },
      'AU': { law: 'Privacy Act', name: 'Privacy Act 1988', scope: 'Federal' },
      'JP': { law: 'APPI', name: 'Act on Protection of Personal Information', scope: 'Federal' },
      'KR': { law: 'PIPA', name: 'Personal Information Protection Act', scope: 'Federal' },
      'IN': { law: 'DPDP', name: 'Digital Personal Data Protection Act', scope: 'Federal' },
      'ZA': { law: 'POPIA', name: 'Protection of Personal Information Act', scope: 'Federal' }
    };
  }
  
  /**
   * Get GDPR compliance info for a country
   */
  getComplianceInfo(countryCode) {
    const isGdprCountry = this.gdprCountries.has(countryCode);
    const hasDataProtection = this.dataProtectionLaws[countryCode];
    
    const result = {
      gdprApplicable: isGdprCountry,
      countryCode,
      requiresConsent: isGdprCountry || countryCode === 'US',
      dataProtectionLaw: null,
      privacyLevel: 'standard'
    };
    
    if (isGdprCountry) {
      result.dataProtectionLaw = 'GDPR';
      result.privacyLevel = 'high';
    } else if (hasDataProtection) {
      result.dataProtectionLaw = hasDataProtection.law;
      result.dataProtectionLawName = hasDataProtection.name;
      result.privacyLevel = 'medium';
    }
    
    return result;
  }
}

export const gdprCompliance = new GDPRCompliance();
