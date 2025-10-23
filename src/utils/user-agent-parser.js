/**
 * USER AGENT PARSER - Converted from user_agent_parser.py
 * Parse user agent strings to extract device, browser, and OS information
 */

class UserAgentParser {
  constructor() {
    // Browser detection patterns
    this.browsers = {
      chrome: /Chrome\/(\d+)/,
      firefox: /Firefox\/(\d+)/,
      safari: /Version\/(\d+).*Safari/,
      edge: /Edg\/(\d+)/,
      opera: /OPR\/(\d+)/,
      ie: /MSIE (\d+)|Trident.*rv:(\d+)/
    };
    
    // OS detection patterns
    this.operatingSystems = {
      windows: /Windows NT ([\d.]+)/,
      macos: /Mac OS X ([\d_]+)/,
      ios: /iPhone OS ([\d_]+)|iPad.*OS ([\d_]+)/,
      android: /Android ([\d.]+)/,
      linux: /Linux/,
      chromeos: /CrOS/
    };
    
    // Device type patterns
    this.devices = {
      mobile: /Mobile|iPhone|iPod|Android.*Mobile/,
      tablet: /iPad|Android(?!.*Mobile)|Tablet/,
      desktop: /Windows|Macintosh|Linux/
    };
  }
  
  /**
   * Parse user agent string
   */
  parse(userAgent) {
    if (!userAgent) {
      return {
        deviceType: 'unknown',
        browserName: 'unknown',
        browserVersion: 'unknown',
        osName: 'unknown',
        osVersion: 'unknown',
        isMobile: false,
        isTablet: false,
        isDesktop: false,
        isBot: false
      };
    }
    
    const uaLower = userAgent.toLowerCase();
    
    // Detect bot/crawler
    const botPatterns = ['bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python-requests'];
    const isBot = botPatterns.some(pattern => uaLower.includes(pattern));
    
    // Detect device type
    let deviceType = 'desktop'; // default
    let isMobile = false;
    let isTablet = false;
    let isDesktop = false;
    
    if (this.devices.mobile.test(userAgent)) {
      deviceType = 'mobile';
      isMobile = true;
    } else if (this.devices.tablet.test(userAgent)) {
      deviceType = 'tablet';
      isTablet = true;
    } else if (this.devices.desktop.test(userAgent)) {
      deviceType = 'desktop';
      isDesktop = true;
    }
    
    // Detect browser
    let browserName = 'unknown';
    let browserVersion = 'unknown';
    
    for (const [browser, pattern] of Object.entries(this.browsers)) {
      const match = userAgent.match(pattern);
      if (match) {
        browserName = browser;
        browserVersion = match[1] || match[2] || 'unknown';
        break;
      }
    }
    
    // Detect OS
    let osName = 'unknown';
    let osVersion = 'unknown';
    
    for (const [os, pattern] of Object.entries(this.operatingSystems)) {
      const match = userAgent.match(pattern);
      if (match) {
        osName = os;
        osVersion = match[1] || match[2] || 'unknown';
        if (osName === 'macos' && osVersion !== 'unknown') {
          osVersion = osVersion.replace(/_/g, '.');
        }
        break;
      }
    }
    
    return {
      deviceType,
      browserName,
      browserVersion,
      osName,
      osVersion,
      isMobile,
      isTablet,
      isDesktop,
      isBot,
      userAgent
    };
  }
}

// Create and export global instance
export const userAgentParser = new UserAgentParser();
