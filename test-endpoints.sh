#!/bin/bash

# Comprehensive API Endpoint Testing Script
# Tests all endpoints with various IP inputs using curl

BASE_URL="http://localhost:5000"

# Test IPs
VALID_IPS=("8.8.8.8" "1.1.1.1" "142.250.185.46")
INVALID_IPS=("999.999.999.999" "256.1.1.1" "not-an-ip")
EDGE_IPS=("0.0.0.0" "127.0.0.1" "192.168.1.1" "10.0.0.1")

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
TOTAL=0
PASSED=0
FAILED=0

test_endpoint() {
    local name="$1"
    local path="$2"
    local ip="$3"
    local expect_error="$4"
    
    TOTAL=$((TOTAL + 1))
    
    local url="${BASE_URL}${path}"
    if [ -n "$ip" ] && [[ ! "$path" =~ ^/(status|health|ping|random-fact|my-ip|heatmap)$ ]]; then
        url="${url}?ip=${ip}"
    fi
    
    local response=$(curl -s -w "\n%{http_code}" "$url" 2>/dev/null)
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    if [ -z "$http_code" ] || [ "$http_code" = "000" ]; then
        echo -e "  ${RED}❌${NC} $name ($ip) - Server not responding"
        FAILED=$((FAILED + 1))
        return
    fi
    
    if [ "$expect_error" = "true" ]; then
        if [ "$http_code" = "400" ]; then
            echo -e "  ${GREEN}✅${NC} $name ($ip) - Correctly rejected (400)"
            PASSED=$((PASSED + 1))
        else
            echo -e "  ${YELLOW}⚠️${NC}  $name ($ip) - Should reject invalid IP but got $http_code"
            FAILED=$((FAILED + 1))
        fi
    else
        if [ "$http_code" = "200" ]; then
            local field_count=$(echo "$body" | jq -r 'keys | length' 2>/dev/null || echo "0")
            echo -e "  ${GREEN}✅${NC} $name ($ip) - $http_code - $field_count fields"
            PASSED=$((PASSED + 1))
        else
            echo -e "  ${RED}❌${NC} $name ($ip) - $http_code"
            FAILED=$((FAILED + 1))
        fi
    fi
}

echo "🧪 Starting Comprehensive API Endpoint Testing"
echo "================================================================================"
echo ""

# Core Endpoints
echo "📂 Testing CORE Endpoints"
echo "--------------------------------------------------------------------------------"
test_endpoint "Main IP Lookup" "/" "${VALID_IPS[0]}" "false"
test_endpoint "Main IP Lookup" "/" "${INVALID_IPS[0]}" "true"
test_endpoint "Alternative API" "/api" "${VALID_IPS[0]}" "false"
test_endpoint "API Status" "/status" "" "false"
test_endpoint "Health Check" "/health" "" "false"

# Security Endpoints
echo ""
echo "📂 Testing SECURITY Endpoints"
echo "--------------------------------------------------------------------------------"
test_endpoint "VPN Detection" "/vpn-detect" "${VALID_IPS[0]}" "false"
test_endpoint "VPN Detection" "/vpn-detect" "${VALID_IPS[1]}" "false"
test_endpoint "VPN Detection" "/vpn-detect" "${INVALID_IPS[0]}" "true"
test_endpoint "Proxy Detection" "/proxy-detection" "${VALID_IPS[0]}" "false"
test_endpoint "Tor Detection" "/tor-detection" "${VALID_IPS[0]}" "false"
test_endpoint "Threat Intel" "/threat-intel" "${VALID_IPS[0]}" "false"
test_endpoint "Advanced Threat Intel" "/threat-intel-advanced" "${VALID_IPS[0]}" "false"
test_endpoint "Risk Score" "/risk-score" "${VALID_IPS[0]}" "false"
test_endpoint "Abuse Check" "/abuse-check" "${VALID_IPS[0]}" "false"
test_endpoint "Reputation" "/reputation" "${VALID_IPS[0]}" "false"
test_endpoint "Bot Detection" "/bot-detection" "${VALID_IPS[0]}" "false"
test_endpoint "Botnet Detection" "/botnet-detection" "${VALID_IPS[0]}" "false"
test_endpoint "Residential Proxy" "/residential-proxy-detection" "${VALID_IPS[0]}" "false"
test_endpoint "Commercial VPN" "/vpn-commercial-detection" "${VALID_IPS[0]}" "false"
test_endpoint "Crypto Detection" "/crypto-detection" "${VALID_IPS[0]}" "false"
test_endpoint "Fraud Analysis" "/fraud-analysis" "${VALID_IPS[0]}" "false"
test_endpoint "Privacy Analysis" "/privacy-analysis" "${VALID_IPS[0]}" "false"

# Business Endpoints
echo ""
echo "📂 Testing BUSINESS Endpoints"
echo "--------------------------------------------------------------------------------"
test_endpoint "Company Detection" "/company-detection" "${VALID_IPS[0]}" "false"
test_endpoint "Business Enrichment" "/business-enrich" "${VALID_IPS[0]}" "false"
test_endpoint "ASN Risk" "/asn-risk" "${VALID_IPS[0]}" "false"

# Network Endpoints
echo ""
echo "📂 Testing NETWORK Endpoints"
echo "--------------------------------------------------------------------------------"
test_endpoint "Hosting Detection" "/hosting-detection" "${VALID_IPS[0]}" "false"
test_endpoint "Datacenter Enhanced" "/datacenter-enhanced" "${VALID_IPS[0]}" "false"
test_endpoint "Network Scan" "/network-scan" "${VALID_IPS[0]}" "false"
test_endpoint "Speed Test" "/speed-test" "${VALID_IPS[0]}" "false"
test_endpoint "Latency Test" "/latency-test" "${VALID_IPS[0]}" "false"
test_endpoint "Mobile Detection" "/mobile-network-detection" "${VALID_IPS[0]}" "false"
test_endpoint "IPv6 Support" "/ipv6-support" "${VALID_IPS[0]}" "false"
test_endpoint "5G Detection" "/5g-detection" "${VALID_IPS[0]}" "false"
test_endpoint "Satellite Detection" "/satellite-detection" "${VALID_IPS[0]}" "false"
test_endpoint "IoT Detection" "/iot-detection" "${VALID_IPS[0]}" "false"

# Enrichment Endpoints
echo ""
echo "📂 Testing ENRICHMENT Endpoints"
echo "--------------------------------------------------------------------------------"
test_endpoint "Weather" "/weather" "${VALID_IPS[0]}" "false"
test_endpoint "Currency" "/currency" "${VALID_IPS[0]}" "false"
test_endpoint "Local Data" "/local-data" "${VALID_IPS[0]}" "false"
test_endpoint "Astronomical" "/astronomical" "${VALID_IPS[0]}" "false"
test_endpoint "Astronomy" "/astronomy" "${VALID_IPS[0]}" "false"
test_endpoint "Climate" "/climate" "${VALID_IPS[0]}" "false"
test_endpoint "Heatmap" "/heatmap" "" "false"
test_endpoint "Zapier Webhook" "/zapier-webhook" "${VALID_IPS[0]}" "false"
test_endpoint "n8n Webhook" "/n8n-webhook" "${VALID_IPS[0]}" "false"

# Utility Endpoints
echo ""
echo "📂 Testing UTILITY Endpoints"
echo "--------------------------------------------------------------------------------"
test_endpoint "Ping" "/ping" "" "false"
test_endpoint "Random Fact" "/random-fact" "" "false"
test_endpoint "My IP" "/my-ip" "" "false"
test_endpoint "IP Calculator" "/ip-calculator" "${VALID_IPS[0]}" "false"
test_endpoint "IP Calculator" "/ip-calculator" "${EDGE_IPS[0]}" "false"

# Edge Cases
echo ""
echo "📂 Testing EDGE CASES"
echo "--------------------------------------------------------------------------------"
test_endpoint "Private IP (10.x)" "/" "${EDGE_IPS[3]}" "false"
test_endpoint "Private IP (192.168.x)" "/" "${EDGE_IPS[2]}" "false"
test_endpoint "Localhost" "/" "${EDGE_IPS[1]}" "false"
test_endpoint "Reserved IP (0.0.0.0)" "/" "${EDGE_IPS[0]}" "false"

# Summary
echo ""
echo "================================================================================"
echo "📊 TEST SUMMARY"
echo "================================================================================"
echo "Total Tests: $TOTAL"
echo -e "${GREEN}✅ Passed: $PASSED ($(awk "BEGIN {printf \"%.1f\", ($PASSED/$TOTAL)*100}")%)${NC}"
echo -e "${RED}❌ Failed: $FAILED ($(awk "BEGIN {printf \"%.1f\", ($FAILED/$TOTAL)*100}")%)${NC}"
echo ""
echo "================================================================================"
echo -e "🎯 Overall Success Rate: ${GREEN}$(awk "BEGIN {printf \"%.1f\", ($PASSED/$TOTAL)*100}")%${NC}"
echo "================================================================================"
