/**
 * Utility Routes
 * Ping, random facts, my-ip, ip-calculator
 */

import { getClientIP, validateIP } from '../utils/ip-lookup.js';

export function registerUtilityRoutes(app) {
  
  // Ping
  app.get('/ping', async (c) => {
    return c.json({
      status: 'pong',
      timestamp: new Date().toISOString()
    });
  });
  
  // Random Fact
  app.get('/random-fact', async (c) => {
    const facts = [
      "IPv4 has 4.3 billion possible addresses",
      "The first IP address ever assigned was 1.0.0.0",
      "8.8.8.8 is Google's public DNS server",
      "IPv6 has 340 undecillion possible addresses",
      "The IP address 127.0.0.1 is always localhost",
      "Private IP ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16",
      "Cloudflare's 1.1.1.1 is one of the fastest DNS resolvers",
      "The first domain ever registered was symbolics.com in 1985"
    ];
    
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    
    return c.json({
      fact: randomFact,
      category: 'ip_networking',
      timestamp: new Date().toISOString()
    });
  });
  
  // My IP
  app.get('/my-ip', async (c) => {
    const ip = getClientIP(c);
    
    return c.json({
      ip,
      your_ip_address: ip,
      detected_from: 'CF-Connecting-IP header',
      timestamp: new Date().toISOString()
    });
  });
  
  // IP Calculator
  app.get('/ip-calculator', async (c) => {
    const ip = c.req.query('ip') || getClientIP(c);
    
    if (!validateIP(ip)) {
      return c.json({
        error: 'Invalid IP address',
        code: 'INVALID_IP'
      }, 400);
    }
    
    // Calculate IP details
    const parts = ip.split('.');
    const isPrivate = isPrivateIP(ip);
    const isLoopback = ip === '127.0.0.1' || ip === '::1';
    
    let binary = '';
    let integer = 0;
    
    if (parts.length === 4) {
      binary = parts.map(p => parseInt(p).toString(2).padStart(8, '0')).join('.');
      integer = parts.reduce((acc, p, i) => acc + (parseInt(p) << (8 * (3 - i))), 0) >>> 0;
    }
    
    return c.json({
      ip,
      binary,
      hex: integer.toString(16).toUpperCase(),
      integer,
      is_private: isPrivate,
      is_loopback: isLoopback,
      is_multicast: isMulticast(ip),
      is_reserved: isReservedIP(ip),
      timestamp: new Date().toISOString()
    });
  });
}

// Helper functions
function isPrivateIP(ip) {
  const parts = ip.split('.').map(Number);
  
  return (
    parts[0] === 10 ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168)
  );
}

function isMulticast(ip) {
  const firstOctet = parseInt(ip.split('.')[0]);
  return firstOctet >= 224 && firstOctet <= 239;
}

function isReservedIP(ip) {
  const parts = ip.split('.').map(Number);
  
  return (
    parts[0] === 0 ||
    parts[0] === 127 ||
    parts[0] === 169 && parts[1] === 254 ||
    (parts[0] === 192 && parts[1] === 0 && parts[2] === 0) ||
    (parts[0] === 192 && parts[1] === 0 && parts[2] === 2) ||
    parts[0] >= 240
  );
}
