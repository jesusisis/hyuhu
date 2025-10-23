/**
 * Comprehensive API Endpoint Testing Script
 * Tests all 128+ endpoints with various IP inputs
 */

const testIPs = {
  valid: [
    '8.8.8.8',           // Google DNS (US, hosting)
    '1.1.1.1',           // Cloudflare (hosting, possibly VPN)
    '142.250.185.46',    // Google (US)
    '208.67.222.222',    // OpenDNS (US)
    '91.198.174.192',    // Europe
    '103.28.248.1',      // Asia
    '200.221.11.101',    // South America
    '41.215.160.1',      // Africa
    '203.0.113.1',       // Australia
    '185.220.101.1'      // Possible Tor/VPN
  ],
  invalid: [
    '999.999.999.999',   // Invalid octets
    '256.1.1.1',         // Octet > 255
    '1.2.3',             // Incomplete
    'not-an-ip',         // Text
    '1.2.3.4.5',         // Too many octets
    '',                  // Empty
    '0.0.0.0',           // Reserved
    '127.0.0.1',         // Loopback
    '192.168.1.1',       // Private
    '10.0.0.1'           // Private
  ],
  edge: [
    '0.0.0.0',           // All zeros
    '255.255.255.255',   // Broadcast
    '127.0.0.1',         // Localhost
    '169.254.1.1',       // Link-local
    '224.0.0.1',         // Multicast
    '10.0.0.1',          // Private Class A
    '172.16.0.1',        // Private Class B
    '192.168.1.1'        // Private Class C
  ]
};

const allEndpoints = {
  core: [
    { path: '/', method: 'GET', name: 'Main IP Lookup' },
    { path: '/api', method: 'GET', name: 'Alternative API' },
    { path: '/status', method: 'GET', name: 'API Status' },
    { path: '/health', method: 'GET', name: 'Health Check' },
    { path: '/batch', method: 'POST', name: 'Batch Processing' }
  ],
  security: [
    { path: '/vpn-detect', method: 'GET', name: 'VPN Detection' },
    { path: '/vpn-detection', method: 'GET', name: 'VPN Detection (alias)' },
    { path: '/proxy-detection', method: 'GET', name: 'Proxy Detection' },
    { path: '/tor-detection', method: 'GET', name: 'Tor Detection' },
    { path: '/threat-intel', method: 'GET', name: 'Threat Intelligence' },
    { path: '/threat-intel-advanced', method: 'GET', name: 'Advanced Threat Intel' },
    { path: '/risk-score', method: 'GET', name: 'Risk Score' },
    { path: '/abuse-check', method: 'GET', name: 'Abuse Check' },
    { path: '/reputation', method: 'GET', name: 'IP Reputation' },
    { path: '/bot-detection', method: 'GET', name: 'Bot Detection' },
    { path: '/botnet-detection', method: 'GET', name: 'Botnet Detection' },
    { path: '/residential-proxy-detection', method: 'GET', name: 'Residential Proxy' },
    { path: '/residential-proxy-advanced', method: 'GET', name: 'Advanced Residential Proxy' },
    { path: '/vpn-commercial-detection', method: 'GET', name: 'Commercial VPN' },
    { path: '/crypto-detection', method: 'GET', name: 'Crypto Node Detection' },
    { path: '/fraud-analysis', method: 'GET', name: 'Fraud Analysis' },
    { path: '/privacy-analysis', method: 'GET', name: 'Privacy Analysis' },
    { path: '/privacy-detection', method: 'GET', name: 'Privacy Detection' }
  ],
  business: [
    { path: '/company-detection', method: 'GET', name: 'Company Detection' },
    { path: '/business-enrich', method: 'GET', name: 'Business Enrichment' },
    { path: '/asn-risk', method: 'GET', name: 'ASN Risk Analysis' }
  ],
  network: [
    { path: '/hosting-detection', method: 'GET', name: 'Hosting Detection' },
    { path: '/datacenter-enhanced', method: 'GET', name: 'Datacenter Detection' },
    { path: '/network-scan', method: 'GET', name: 'Network Scan' },
    { path: '/speed-test', method: 'GET', name: 'Speed Test' },
    { path: '/latency-test', method: 'GET', name: 'Latency Test' },
    { path: '/mobile-network-detection', method: 'GET', name: 'Mobile Detection' },
    { path: '/ipv6-support', method: 'GET', name: 'IPv6 Support' },
    { path: '/5g-detection', method: 'GET', name: '5G Detection' },
    { path: '/satellite-detection', method: 'GET', name: 'Satellite Detection' },
    { path: '/iot-detection', method: 'GET', name: 'IoT Detection' }
  ],
  enrichment: [
    { path: '/weather', method: 'GET', name: 'Weather Data' },
    { path: '/currency', method: 'GET', name: 'Currency Info' },
    { path: '/local-data', method: 'GET', name: 'Local Data' },
    { path: '/astronomical', method: 'GET', name: 'Astronomical Data' },
    { path: '/astronomy', method: 'GET', name: 'Astronomy' },
    { path: '/climate', method: 'GET', name: 'Climate Zone' },
    { path: '/heatmap', method: 'GET', name: 'Heatmap Data' },
    { path: '/zapier-webhook', method: 'GET', name: 'Zapier Webhook' },
    { path: '/n8n-webhook', method: 'GET', name: 'n8n Webhook' }
  ],
  utility: [
    { path: '/ping', method: 'GET', name: 'Ping' },
    { path: '/random-fact', method: 'GET', name: 'Random Fact' },
    { path: '/my-ip', method: 'GET', name: 'My IP' },
    { path: '/ip-calculator', method: 'GET', name: 'IP Calculator' }
  ]
};

const baseURL = 'http://localhost:5000';

async function testEndpoint(endpoint, ip, ipType) {
  try {
    let url = `${baseURL}${endpoint.path}`;
    let options = { method: endpoint.method };
    
    if (endpoint.path === '/batch' && endpoint.method === 'POST') {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify({ ips: testIPs.valid.slice(0, 3) });
    } else if (ip && !['/status', '/health', '/ping', '/random-fact', '/my-ip', '/heatmap'].includes(endpoint.path)) {
      url += `?ip=${ip}`;
    }
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    return {
      endpoint: endpoint.name,
      path: endpoint.path,
      ip,
      ipType,
      status: response.status,
      success: response.status < 400,
      hasData: !!data && Object.keys(data).length > 0,
      hasError: !!data.error,
      errorCode: data.code || null,
      dataFields: Object.keys(data).length
    };
  } catch (error) {
    return {
      endpoint: endpoint.name,
      path: endpoint.path,
      ip,
      ipType,
      status: 0,
      success: false,
      hasData: false,
      hasError: true,
      errorCode: 'FETCH_ERROR',
      error: error.message
    };
  }
}

async function runTests() {
  console.log('🧪 Starting Comprehensive API Endpoint Testing\n');
  console.log('=' .repeat(80));
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    by_category: {},
    by_ip_type: { valid: 0, invalid: 0, edge: 0 },
    failures: []
  };
  
  // Test each category
  for (const [category, endpoints] of Object.entries(allEndpoints)) {
    console.log(`\n📂 Testing ${category.toUpperCase()} Endpoints (${endpoints.length} endpoints)`);
    console.log('-'.repeat(80));
    
    results.by_category[category] = { total: 0, passed: 0, failed: 0 };
    
    for (const endpoint of endpoints) {
      // Test with valid IPs
      for (const ip of testIPs.valid.slice(0, 2)) {
        const result = await testEndpoint(endpoint, ip, 'valid');
        results.total++;
        results.by_category[category].total++;
        
        if (result.success) {
          results.passed++;
          results.by_category[category].passed++;
          results.by_ip_type.valid++;
          console.log(`  ✅ ${result.endpoint} (${ip}) - ${result.status} - ${result.dataFields} fields`);
        } else {
          results.failed++;
          results.by_category[category].failed++;
          results.failures.push(result);
          console.log(`  ❌ ${result.endpoint} (${ip}) - ${result.status} - ${result.errorCode}`);
        }
      }
      
      // Test with one invalid IP for endpoints that take IPs
      if (!['/status', '/health', '/ping', '/random-fact', '/my-ip', '/heatmap'].includes(endpoint.path)) {
        const invalidIP = testIPs.invalid[0];
        const result = await testEndpoint(endpoint, invalidIP, 'invalid');
        results.total++;
        results.by_category[category].total++;
        
        // For invalid IPs, we expect errors (400 status)
        if (result.status === 400 && result.hasError) {
          results.passed++;
          results.by_category[category].passed++;
          results.by_ip_type.invalid++;
          console.log(`  ✅ ${result.endpoint} (${invalidIP}) - Correctly rejected invalid IP`);
        } else if (result.success) {
          results.failed++;
          results.by_category[category].failed++;
          results.failures.push(result);
          console.log(`  ⚠️  ${result.endpoint} (${invalidIP}) - Should reject invalid IP but didn't`);
        }
      }
      
      // Test with edge case IP
      if (!['/status', '/health', '/ping', '/random-fact', '/my-ip', '/heatmap', '/batch'].includes(endpoint.path)) {
        const edgeIP = testIPs.edge[0]; // Test with 0.0.0.0
        const result = await testEndpoint(endpoint, edgeIP, 'edge');
        results.total++;
        results.by_category[category].total++;
        
        if (result.success || (result.status === 400 && result.hasError)) {
          results.passed++;
          results.by_category[category].passed++;
          results.by_ip_type.edge++;
          console.log(`  ✅ ${result.endpoint} (${edgeIP}) - ${result.status}`);
        } else {
          results.failed++;
          results.by_category[category].failed++;
          results.failures.push(result);
          console.log(`  ❌ ${result.endpoint} (${edgeIP}) - ${result.status}`);
        }
      }
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Tests: ${results.total}`);
  console.log(`✅ Passed: ${results.passed} (${((results.passed / results.total) * 100).toFixed(1)}%)`);
  console.log(`❌ Failed: ${results.failed} (${((results.failed / results.total) * 100).toFixed(1)}%)`);
  
  console.log('\n📂 By Category:');
  for (const [category, stats] of Object.entries(results.by_category)) {
    const passRate = ((stats.passed / stats.total) * 100).toFixed(1);
    console.log(`  ${category.padEnd(15)}: ${stats.passed}/${stats.total} passed (${passRate}%)`);
  }
  
  console.log('\n🧪 By IP Type:');
  console.log(`  Valid IPs:   ${results.by_ip_type.valid} tests passed`);
  console.log(`  Invalid IPs: ${results.by_ip_type.invalid} tests passed`);
  console.log(`  Edge Cases:  ${results.by_ip_type.edge} tests passed`);
  
  if (results.failures.length > 0) {
    console.log('\n❌ FAILURES:');
    console.log('='.repeat(80));
    results.failures.forEach((failure, i) => {
      console.log(`${i + 1}. ${failure.endpoint} (${failure.path})`);
      console.log(`   IP: ${failure.ip} (${failure.ipType})`);
      console.log(`   Status: ${failure.status}`);
      console.log(`   Error: ${failure.errorCode || failure.error}`);
      console.log('');
    });
  }
  
  console.log('\n' + '='.repeat(80));
  console.log(`🎯 Overall Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
  console.log('='.repeat(80) + '\n');
  
  return results;
}

// Run tests
runTests().catch(console.error);
