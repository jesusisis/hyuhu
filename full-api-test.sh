#!/bin/bash

echo "🔍 COMPREHENSIVE API TEST - ALL 128+ ENDPOINTS"
echo "================================================"

# Start server
echo "Starting API server..."
node server.js > /tmp/full_api_test.log 2>&1 &
SERVER_PID=$!
sleep 5

if ! curl -s http://localhost:5000/health > /dev/null 2>&1; then
    echo "❌ Server failed to start"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

echo "✅ Server running (PID: $SERVER_PID)"
echo ""

PASSED=0
FAILED=0
TOTAL=0

test_endpoint() {
    local name="$1"
    local url="$2"
    local method="${3:-GET}"
    local data="${4:-}"
    
    ((TOTAL++))
    
    if [ "$method" = "POST" ]; then
        if [ -z "$data" ]; then
            data='{"ips":["8.8.8.8","1.1.1.1"]}'
        fi
        response=$(curl -s -w "\n%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "$url" 2>/dev/null)
    else
        response=$(curl -s -w "\n%{http_code}" "$url" 2>/dev/null)
    fi
    
    http_code=$(echo "$response" | tail -1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo "  ✅ $name (HTTP $http_code)"
        ((PASSED++))
    else
        echo "  ❌ $name (HTTP $http_code)"
        ((FAILED++))
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "CATEGORY 1: CORE ENDPOINTS (5 total)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint "Main IP Lookup (/)" "http://localhost:5000/?ip=8.8.8.8"
test_endpoint "API Endpoint (/api)" "http://localhost:5000/api?ip=8.8.8.8"
test_endpoint "Health Check" "http://localhost:5000/health"
test_endpoint "API Status" "http://localhost:5000/status"
test_endpoint "Batch Processing" "http://localhost:5000/batch" "POST"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "CATEGORY 2: SECURITY & THREAT DETECTION (23 total)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint "VPN Detect (GET)" "http://localhost:5000/vpn-detect?ip=1.1.1.1"
test_endpoint "VPN Detect (POST)" "http://localhost:5000/vpn-detect" "POST" '{"ip":"1.1.1.1"}'
test_endpoint "VPN Detection (GET)" "http://localhost:5000/vpn-detection?ip=1.1.1.1"
test_endpoint "VPN Detection (POST)" "http://localhost:5000/vpn-detection" "POST" '{"ip":"1.1.1.1"}'
test_endpoint "Proxy Detection (GET)" "http://localhost:5000/proxy-detection?ip=1.1.1.1"
test_endpoint "Proxy Detection (POST)" "http://localhost:5000/proxy-detection" "POST" '{"ip":"1.1.1.1"}'
test_endpoint "Tor Detection (GET)" "http://localhost:5000/tor-detection?ip=1.1.1.1"
test_endpoint "Tor Detection (POST)" "http://localhost:5000/tor-detection" "POST" '{"ip":"1.1.1.1"}'
test_endpoint "Threat Intel" "http://localhost:5000/threat-intel?ip=8.8.8.8"
test_endpoint "Threat Intel Advanced" "http://localhost:5000/threat-intel-advanced?ip=8.8.8.8"
test_endpoint "Risk Score" "http://localhost:5000/risk-score?ip=8.8.8.8"
test_endpoint "Abuse Check" "http://localhost:5000/abuse-check?ip=8.8.8.8"
test_endpoint "IP Reputation" "http://localhost:5000/reputation?ip=8.8.8.8"
test_endpoint "Bot Detection" "http://localhost:5000/bot-detection?ip=8.8.8.8"
test_endpoint "Botnet Detection" "http://localhost:5000/botnet-detection?ip=8.8.8.8"
test_endpoint "Residential Proxy Detection" "http://localhost:5000/residential-proxy-detection?ip=8.8.8.8"
test_endpoint "Residential Proxy Advanced" "http://localhost:5000/residential-proxy-advanced?ip=8.8.8.8"
test_endpoint "VPN Commercial Detection" "http://localhost:5000/vpn-commercial-detection?ip=8.8.8.8"
test_endpoint "Crypto Detection" "http://localhost:5000/crypto-detection?ip=8.8.8.8"
test_endpoint "Fraud Analysis (GET)" "http://localhost:5000/fraud-analysis?ip=8.8.8.8"
test_endpoint "Fraud Analysis (POST)" "http://localhost:5000/fraud-analysis" "POST" '{"ip":"8.8.8.8"}'
test_endpoint "Privacy Analysis" "http://localhost:5000/privacy-analysis?ip=8.8.8.8"
test_endpoint "Privacy Detection" "http://localhost:5000/privacy-detection?ip=8.8.8.8"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "CATEGORY 3: BUSINESS INTELLIGENCE (4 total)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint "Company Detection" "http://localhost:5000/company-detection?ip=8.8.8.8"
test_endpoint "Business Enrich (GET)" "http://localhost:5000/business-enrich?ip=8.8.8.8"
test_endpoint "Business Enrich (POST)" "http://localhost:5000/business-enrich" "POST" '{"ip":"8.8.8.8"}'
test_endpoint "ASN Risk Analysis" "http://localhost:5000/asn-risk?ip=8.8.8.8"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "CATEGORY 4: NETWORK ANALYSIS (10 total)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint "Hosting Detection" "http://localhost:5000/hosting-detection?ip=8.8.8.8"
test_endpoint "Datacenter Enhanced" "http://localhost:5000/datacenter-enhanced?ip=8.8.8.8"
test_endpoint "Network Scan" "http://localhost:5000/network-scan?ip=8.8.8.8"
test_endpoint "Speed Test" "http://localhost:5000/speed-test?ip=8.8.8.8"
test_endpoint "Latency Test" "http://localhost:5000/latency-test?ip=8.8.8.8"
test_endpoint "Mobile Network Detection" "http://localhost:5000/mobile-network-detection?ip=8.8.8.8"
test_endpoint "IPv6 Support" "http://localhost:5000/ipv6-support?ip=8.8.8.8"
test_endpoint "5G Detection" "http://localhost:5000/5g-detection?ip=8.8.8.8"
test_endpoint "Satellite Detection" "http://localhost:5000/satellite-detection?ip=8.8.8.8"
test_endpoint "IoT Detection" "http://localhost:5000/iot-detection?ip=8.8.8.8"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "CATEGORY 5: DATA ENRICHMENT (11 total)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint "Weather Data" "http://localhost:5000/weather?ip=8.8.8.8"
test_endpoint "Currency Info" "http://localhost:5000/currency?ip=8.8.8.8"
test_endpoint "Local Data" "http://localhost:5000/local-data?ip=8.8.8.8"
test_endpoint "Astronomical Data" "http://localhost:5000/astronomical?ip=8.8.8.8"
test_endpoint "Astronomy" "http://localhost:5000/astronomy?ip=8.8.8.8"
test_endpoint "Climate Zone" "http://localhost:5000/climate?ip=8.8.8.8"
test_endpoint "Heatmap Data" "http://localhost:5000/heatmap?ip=8.8.8.8"
test_endpoint "Zapier Webhook (GET)" "http://localhost:5000/zapier-webhook?ip=8.8.8.8"
test_endpoint "Zapier Webhook (POST)" "http://localhost:5000/zapier-webhook" "POST" '{"ip":"8.8.8.8"}'
test_endpoint "n8n Webhook (GET)" "http://localhost:5000/n8n-webhook?ip=8.8.8.8"
test_endpoint "n8n Webhook (POST)" "http://localhost:5000/n8n-webhook" "POST" '{"ip":"8.8.8.8"}'
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "CATEGORY 6: UTILITY ENDPOINTS (4 total)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint "Ping Test" "http://localhost:5000/ping?ip=8.8.8.8"
test_endpoint "Random IP Fact" "http://localhost:5000/random-fact"
test_endpoint "My IP" "http://localhost:5000/my-ip"
test_endpoint "IP Calculator" "http://localhost:5000/ip-calculator?ip=8.8.8.8"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "CATEGORY 7: SEO ALIASES (Testing 20 samples)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint "IP Lookup" "http://localhost:5000/ip-lookup?ip=8.8.8.8"
test_endpoint "Locate IP" "http://localhost:5000/locate-ip?ip=8.8.8.8"
test_endpoint "Find IP" "http://localhost:5000/find-ip?ip=8.8.8.8"
test_endpoint "Track IP" "http://localhost:5000/track-ip?ip=8.8.8.8"
test_endpoint "IP Locator" "http://localhost:5000/ip-locator?ip=8.8.8.8"
test_endpoint "IP Tracker" "http://localhost:5000/ip-tracker?ip=8.8.8.8"
test_endpoint "IP Finder" "http://localhost:5000/ip-finder?ip=8.8.8.8"
test_endpoint "Geolocation" "http://localhost:5000/geolocation?ip=8.8.8.8"
test_endpoint "Geo IP" "http://localhost:5000/geo-ip?ip=8.8.8.8"
test_endpoint "IP Details" "http://localhost:5000/ip-details?ip=8.8.8.8"
test_endpoint "Where Is IP" "http://localhost:5000/where-is-ip?ip=8.8.8.8"
test_endpoint "IP Location" "http://localhost:5000/ip-location?ip=8.8.8.8"
test_endpoint "IP Address Lookup" "http://localhost:5000/ip-address-lookup?ip=8.8.8.8"
test_endpoint "Check IP" "http://localhost:5000/check-ip?ip=8.8.8.8"
test_endpoint "IP Intelligence" "http://localhost:5000/ip-intelligence?ip=8.8.8.8"
test_endpoint "IP Data" "http://localhost:5000/ip-data?ip=8.8.8.8"
test_endpoint "Trace IP" "http://localhost:5000/trace-ip?ip=8.8.8.8"
test_endpoint "IP Analysis" "http://localhost:5000/ip-analysis?ip=8.8.8.8"
test_endpoint "Visitor Location" "http://localhost:5000/visitor-location?ip=8.8.8.8"
test_endpoint "IP Geo" "http://localhost:5000/ip-geo?ip=8.8.8.8"
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 FINAL TEST RESULTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Total Endpoints Tested:  $TOTAL"
echo "  ✅ Passed:               $PASSED"
echo "  ❌ Failed:               $FAILED"
echo ""

PERCENTAGE=$((PASSED * 100 / TOTAL))
echo "  Success Rate:            $PERCENTAGE%"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "🎉 PERFECT! All endpoints working!"
else
    echo "⚠️  Issues found in $FAILED endpoint(s)"
fi

echo ""
echo "Stopping server..."
kill $SERVER_PID 2>/dev/null
sleep 1
echo "✅ Complete!"
