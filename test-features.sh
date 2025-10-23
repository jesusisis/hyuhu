#!/bin/bash
echo "===== IP GEOLOCATION API - COMPREHENSIVE FEATURE TEST ====="
echo ""

# Test Core Endpoints
echo "📍 TESTING CORE ENDPOINTS (5 endpoints)..."
echo "1. Main IP lookup (/):"
curl -s http://localhost:5000/?ip=8.8.8.8 | jq -c 'keys' 2>/dev/null || echo "  ⚠️  No response"

echo ""
echo "2. API endpoint (/api):"
curl -s http://localhost:5000/api?ip=1.1.1.1 | jq -c '.ip' 2>/dev/null || echo "  ⚠️  No response"

echo ""
echo "3. Status endpoint (/status):"
curl -s http://localhost:5000/status | jq -c '.status' 2>/dev/null || echo "  ⚠️  No response"

echo ""
echo "4. Health check (/health):"
curl -s http://localhost:5000/health | jq -c '.status' 2>/dev/null || echo "  ⚠️  No response"

echo ""
echo "5. Batch processing (/batch):"
curl -s -X POST http://localhost:5000/batch \
  -H "Content-Type: application/json" \
  -d '{"ips":["8.8.8.8","1.1.1.1"]}' | jq -c '.results | length' 2>/dev/null || echo "  ⚠️  No response"

echo ""
echo ""
echo "🔒 TESTING SECURITY ENDPOINTS (23 endpoints)..."
echo "6. VPN detection (/vpn-detect):"
curl -s http://localhost:5000/vpn-detect?ip=1.1.1.1 | jq -c '.is_vpn' 2>/dev/null || echo "  ⚠️  No response"

echo ""
echo "7. Proxy detection (/proxy-detection):"
curl -s http://localhost:5000/proxy-detection?ip=8.8.8.8 | jq -c '.is_proxy' 2>/dev/null || echo "  ⚠️  No response"

echo ""
echo "8. Tor detection (/tor-detection):"
curl -s http://localhost:5000/tor-detection?ip=8.8.8.8 | jq -c '.is_tor' 2>/dev/null || echo "  ⚠️  No response"

echo ""
echo "9. Threat intel (/threat-intel):"
curl -s http://localhost:5000/threat-intel?ip=8.8.8.8 | jq -c '.threat_level' 2>/dev/null || echo "  ⚠️  No response"

echo ""
echo "10. Risk score (/risk-score):"
curl -s http://localhost:5000/risk-score?ip=8.8.8.8 | jq -c '.risk_score' 2>/dev/null || echo "  ⚠️  No response"

echo ""
echo "11. Bot detection (/bot-detection):"
curl -s http://localhost:5000/bot-detection?ip=8.8.8.8 | jq -c '.is_bot' 2>/dev/null || echo "  ⚠️  No response"

echo ""
echo "12. Fraud analysis (/fraud-analysis):"
curl -s http://localhost:5000/fraud-analysis?ip=8.8.8.8 | jq -c '.fraud_score' 2>/dev/null || echo "  ⚠️  No response"

echo ""
echo ""
echo "💼 TESTING BUSINESS ENDPOINTS (4 endpoints)..."
echo "13. Company detection (/company-detection):"
curl -s http://localhost:5000/company-detection?ip=8.8.8.8 | jq -c '.company' 2>/dev/null || echo "  ⚠️  No response"

echo ""
echo "14. Business enrichment (/business-enrich):"
curl -s http://localhost:5000/business-enrich?ip=8.8.8.8 | jq -c '.organization' 2>/dev/null || echo "  ⚠️  No response"

echo ""
echo ""
echo "🌐 TESTING NETWORK ENDPOINTS (10 endpoints)..."
echo "15. Hosting detection (/hosting-detection):"
curl -s http://localhost:5000/hosting-detection?ip=8.8.8.8 | jq -c '.is_hosting' 2>/dev/null || echo "  ⚠️  No response"

echo ""
echo "16. Datacenter enhanced (/datacenter-enhanced):"
curl -s http://localhost:5000/datacenter-enhanced?ip=8.8.8.8 | jq -c '.is_datacenter' 2>/dev/null || echo "  ⚠️  No response"

echo ""
echo "17. Mobile network detection (/mobile-network-detection):"
curl -s http://localhost:5000/mobile-network-detection?ip=8.8.8.8 | jq -c '.is_mobile' 2>/dev/null || echo "  ⚠️  No response"

echo ""
echo ""
echo "🌤️ TESTING ENRICHMENT ENDPOINTS (11 endpoints)..."
echo "18. Weather data (/weather):"
curl -s http://localhost:5000/weather?ip=8.8.8.8 | jq -c '.temperature' 2>/dev/null || echo "  ⚠️  No response"

echo ""
echo "19. Currency info (/currency):"
curl -s http://localhost:5000/currency?ip=8.8.8.8 | jq -c '.currency_code' 2>/dev/null || echo "  ⚠️  No response"

echo ""
echo "20. Local data (/local-data):"
curl -s http://localhost:5000/local-data?ip=8.8.8.8 | jq -c '.local_time' 2>/dev/null || echo "  ⚠️  No response"

echo ""
echo ""
echo "🛠️ TESTING UTILITY ENDPOINTS (4 endpoints)..."
echo "21. Ping test (/ping):"
curl -s http://localhost:5000/ping | jq -c '.message' 2>/dev/null || echo "  ⚠️  No response"

echo ""
echo "22. My IP (/my-ip):"
curl -s http://localhost:5000/my-ip | jq -c '.ip' 2>/dev/null || echo "  ⚠️  No response"

echo ""
echo ""
echo "🎯 TESTING SEO ALIAS ENDPOINTS (71+ endpoints)..."
echo "23. Regional alias (/ip-lookup-us):"
curl -s http://localhost:5000/ip-lookup-us?ip=8.8.8.8 | jq -c '.ip' 2>/dev/null || echo "  ⚠️  No response"

echo ""
echo "24. Industry alias (/ecommerce-ip-check):"
curl -s http://localhost:5000/ecommerce-ip-check?ip=8.8.8.8 | jq -c '.ip' 2>/dev/null || echo "  ⚠️  No response"

echo ""
echo ""
echo "===== TEST SUMMARY COMPLETE ====="
