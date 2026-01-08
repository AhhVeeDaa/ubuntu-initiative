#!/bin/bash

# ============================================================================
# AGENTS SYSTEM DEPLOYMENT VERIFICATION
# Run this script to verify all components are working
# ============================================================================

echo "🔍 AGENTS SYSTEM VERIFICATION"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

DASHBOARD_URL="http://localhost:3001"
WEB_URL="http://localhost:3000"
PASSED=0
FAILED=0

# ============================================================================
# Test Functions
# ============================================================================

test_endpoint() {
  local name=$1
  local url=$2
  local expected_key=$3
  
  echo -n "Testing $name... "
  
  response=$(curl -s -w "\n%{http_code}" "$url")
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [ "$http_code" -eq 200 ]; then
    if [[ $body == *"$expected_key"* ]]; then
      echo -e "${GREEN}✓ PASS${NC}"
      ((PASSED++))
      return 0
    else
      echo -e "${RED}✗ FAIL${NC} (missing key: $expected_key)"
      echo "  Response: $body"
      ((FAILED++))
      return 1
    fi
  else
    echo -e "${RED}✗ FAIL${NC} (HTTP $http_code)"
    echo "  Response: $body"
    ((FAILED++))
    return 1
  fi
}

test_trigger() {
  local agent_id=$1
  
  echo -n "Testing agent trigger ($agent_id)... "
  
  response=$(curl -s -X POST "$DASHBOARD_URL/api/agents/trigger" \
    -H "Content-Type: application/json" \
    -d "{\"agentId\": \"$agent_id\"}")
  
  if [[ $response == *"runId"* ]] && [[ $response == *"success\":true"* ]]; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
    
    # Extract runId
    run_id=$(echo "$response" | grep -o '"runId":"[^"]*' | cut -d'"' -f4)
    echo "  Run ID: $run_id"
    
    return 0
  else
    echo -e "${RED}✗ FAIL${NC}"
    echo "  Response: $response"
    ((FAILED++))
    return 1
  fi
}

# ============================================================================
# Run Tests
# ============================================================================

echo "1. Testing Dashboard APIs"
echo "-------------------------"
test_endpoint "Health Check" "$DASHBOARD_URL/api/agents/health" "success"
test_endpoint "SLA Metrics" "$DASHBOARD_URL/api/agents/sla" "sla"
test_endpoint "Agent Metrics" "$DASHBOARD_URL/api/agents/agent_002_funding/metrics" "metrics"
echo ""

echo "2. Testing Web APIs"
echo "-------------------"
test_endpoint "Public Audit Log" "$WEB_URL/api/agents/audit-log" "logs"
echo ""

echo "3. Testing Agent Execution"
echo "--------------------------"
test_trigger "agent_002_funding"
echo ""

echo "4. Testing Real-Time Stream"
echo "---------------------------"
echo -n "Testing SSE connection... "

# Test SSE stream (will timeout after 3 seconds)
sse_response=$(timeout 3 curl -s -N "$DASHBOARD_URL/api/agents/stream" 2>/dev/null || true)

if [[ $sse_response == *"data:"* ]] && [[ $sse_response == *"connected"* ]]; then
  echo -e "${GREEN}✓ PASS${NC}"
  ((PASSED++))
else
  echo -e "${RED}✗ FAIL${NC}"
  echo "  SSE stream not responding correctly"
  echo "  Response: ${sse_response:0:200}..."
  ((FAILED++))
fi
echo ""

# ============================================================================
# Check Database Tables
# ============================================================================

echo "5. Checking Database"
echo "--------------------"

if command -v psql &> /dev/null; then
  echo "Note: Manual database check required"
  echo "Run: psql ... -c \"SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename LIKE 'agent%';\""
  echo -e "${YELLOW}⚠ SKIP${NC} (psql not configured)"
else
  echo -e "${YELLOW}⚠ SKIP${NC} (psql not installed)"
fi
echo ""

# ============================================================================
# Results
# ============================================================================

echo "================================"
echo "VERIFICATION RESULTS"
echo "================================"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ ALL TESTS PASSED${NC}"
  echo "The agents system is ready for deployment!"
  exit 0
else
  echo -e "${RED}✗ SOME TESTS FAILED${NC}"
  echo "Please fix the failing tests before deployment."
  echo ""
  echo "Common fixes:"
  echo "  - Ensure both servers are running (dashboard:3001, web:3000)"
  echo "  - Run database migration: supabase db push"
  echo "  - Check environment variables in .env.local"
  echo "  - Fix agent import paths in agent-factory.ts"
  exit 1
fi
