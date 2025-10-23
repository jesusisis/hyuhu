#!/bin/bash

echo "🚀 Starting IP Geolocation API Test Suite"
echo "=========================================="

# Start the server in background
echo "Starting API server on port 5000..."
node server.js > /tmp/api_test.log 2>&1 &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Check if server started
if ! curl -s http://localhost:5000/health > /dev/null 2>&1; then
    echo "❌ Server failed to start"
    cat /tmp/api_test.log
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

echo "✅ Server started successfully (PID: $SERVER_PID)"
echo ""

# Test counters
PASSED=0
FAILED=0

# Function to test an endpoint
test_endpoint() {
    local name="$1"
    local url="$2"
    local method="${3:-GET}"
    
    echo -n "Testing $name... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$url" 2>/dev/null)
    else
        response=$(curl -s -X POST -w "\n%{http_code}" -H "Content-Type: application/json" -d '{"ips":["8.8.8.8","1.1.1.1"]}' "$url" 2>/dev/null)
    fi
    
    http_code=$(echo "$response" | tail -1)
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo "✅ PASS (HTTP $http_code)"
        ((PASSED++))
        return 0
    else
        echo "❌ FAIL (HTTP $http_code)"
        ((FAILED++))
        return 1
    fi
}

echo "📋 Testing API Endpoints:"
echo ""

# Core Endpoints
echo "=== CORE ENDPOINTS ===" 
test_endpoint "Main IP Lookup" "http://localhost:5000/?ip=8.8.8.8"
test_endpoint "API Endpoint" "http://localhost:5000/api?ip=8.8.8.8"
test_endpoint "Health Check" "http://localhost:5000/health"
test_endpoint "Status" "http://localhost:5000/status"
test_endpoint "Batch Processing" "http://localhost:5000/batch" "POST"
echo ""

# Security Endpoints
echo "=== SECURITY ENDPOINTS ==="
test_endpoint "VPN Detection" "http://localhost:5000/vpn-detect?ip=1.1.1.1"
test_endpoint "Proxy Detection" "http://localhost:5000/proxy-detection?ip=1.1.1.1"
test_endpoint "Tor Detection" "http://localhost:5000/tor-detection?ip=1.1.1.1"
test_endpoint "Threat Intel" "http://localhost:5000/threat-intel?ip=8.8.8.8"
test_endpoint "Risk Score" "http://localhost:5000/risk-score?ip=8.8.8.8"
test_endpoint "Bot Detection" "http://localhost:5000/bot-detection?ip=8.8.8.8"
test_endpoint "Fraud Analysis" "http://localhost:5000/fraud-analysis?ip=8.8.8.8"
echo ""

# Business Endpoints
echo "=== BUSINESS ENDPOINTS ==="
test_endpoint "Company Detection" "http://localhost:5000/company-detection?ip=8.8.8.8"
test_endpoint "Business Enrich" "http://localhost:5000/business-enrich?ip=8.8.8.8"
test_endpoint "ASN Risk" "http://localhost:5000/asn-risk?ip=8.8.8.8"
echo ""

# Network Endpoints
echo "=== NETWORK ENDPOINTS ==="
test_endpoint "Hosting Detection" "http://localhost:5000/hosting-detection?ip=8.8.8.8"
test_endpoint "Datacenter Enhanced" "http://localhost:5000/datacenter-enhanced?ip=8.8.8.8"
test_endpoint "Network Scan" "http://localhost:5000/network-scan?ip=8.8.8.8"
test_endpoint "Speed Test" "http://localhost:5000/speed-test?ip=8.8.8.8"
test_endpoint "Latency Test" "http://localhost:5000/latency-test?ip=8.8.8.8"
test_endpoint "5G Detection" "http://localhost:5000/5g-detection?ip=8.8.8.8"
echo ""

# Enrichment Endpoints
echo "=== ENRICHMENT ENDPOINTS ==="
test_endpoint "Weather Data" "http://localhost:5000/weather?ip=8.8.8.8"
test_endpoint "Currency Info" "http://localhost:5000/currency?ip=8.8.8.8"
test_endpoint "Local Data" "http://localhost:5000/local-data?ip=8.8.8.8"
test_endpoint "Astronomical" "http://localhost:5000/astronomical?ip=8.8.8.8"
test_endpoint "Climate" "http://localhost:5000/climate?ip=8.8.8.8"
test_endpoint "Heatmap" "http://localhost:5000/heatmap?ip=8.8.8.8"
echo ""

# Utility Endpoints
echo "=== UTILITY ENDPOINTS ==="
test_endpoint "Ping Test" "http://localhost:5000/ping?ip=8.8.8.8"
test_endpoint "Random Fact" "http://localhost:5000/random-fact"
test_endpoint "My IP" "http://localhost:5000/my-ip"
test_endpoint "IP Calculator" "http://localhost:5000/ip-calculator?ip=8.8.8.8"
echo ""

# Sample Aliases
echo "=== SAMPLE ALIASES ==="
test_endpoint "IP Lookup (Alias)" "http://localhost:5000/ip-lookup?ip=8.8.8.8"
test_endpoint "Geolocate (Alias)" "http://localhost:5000/geolocate?ip=8.8.8.8"
test_endpoint "IP Info (Alias)" "http://localhost:5000/ip-info?ip=8.8.8.8"
echo ""

# Print summary
echo "=========================================="
echo "📊 TEST SUMMARY"
echo "=========================================="
echo "✅ Passed: $PASSED"
echo "❌ Failed: $FAILED"
echo "📝 Total:  $((PASSED + FAILED))"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "🎉 All tests passed!"
else
    echo "⚠️  Some tests failed. Check the results above."
fi

# Clean up
echo ""
echo "Stopping server..."
kill $SERVER_PID 2>/dev/null
sleep 1

echo "✅ Test suite complete!"
