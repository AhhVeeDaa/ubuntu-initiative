#!/bin/bash

# ============================================================================
# AGENTS SYSTEM - COMPLETE TEST SUITE
# Tests all 3 agents with real execution
# ============================================================================

echo "🧪 TESTING AGENTS SYSTEM"
echo "========================="
echo ""

DASHBOARD_URL="http://localhost:3001"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASSED=0
FAILED=0

# ============================================================================
# Test Agent Execution
# ============================================================================

test_agent() {
  local agent_id=$1
  local agent_name=$2
  
  echo "Testing $agent_name ($agent_id)..."
  echo "-----------------------------------"
  
  # Trigger agent
  echo -n "  1. Triggering agent... "
  trigger_response=$(curl -s -X POST "$DASHBOARD_URL/api/agents/trigger" \
    -H "Content-Type: application/json" \
    -d "{\"agentId\": \"$agent_id\"}")
  
  if [[ $trigger_response == *"runId"* ]] && [[ $trigger_response == *"success\":true"* ]]; then
    echo -e "${GREEN}✓${NC}"
    ((PASSED++))
    
    run_id=$(echo "$trigger_response" | grep -o '"runId":"[^"]*' | cut -d'"' -f4)
    echo "     Run ID: $run_id"
    
    # Wait for execution
    echo -n "  2. Waiting for execution (10s)... "
    sleep 10
    echo -e "${GREEN}✓${NC}"
    
    # Check metrics
    echo -n "  3. Checking metrics... "
    metrics_response=$(curl -s "$DASHBOARD_URL/api/agents/$agent_id/metrics")
    
    if [[ $metrics_response == *"totalRuns"* ]]; then
      total_runs=$(echo "$metrics_response" | grep -o '"totalRuns":[0-9]*' | cut -d':' -f2)
      success_rate=$(echo "$metrics_response" | grep -o '"successRate":[0-9.]*' | cut -d':' -f2)
      echo -e "${GREEN}✓${NC}"
      echo "     Total Runs: $total_runs"
      echo "     Success Rate: $success_rate%"
      ((PASSED++))
    else
      echo -e "${RED}✗${NC}"
      echo "     Response: $metrics_response"
      ((FAILED++))
    fi
    
  else
    echo -e "${RED}✗${NC}"
    echo "     Response: $trigger_response"
    ((FAILED++))
  fi
  
  echo ""
}

# ============================================================================
# Test Circuit Breaker
# ============================================================================

test_circuit_breaker() {
  echo "Testing Circuit Breaker..."
  echo "-------------------------"
  
  # Get states
  echo -n "  1. Getting circuit breaker states... "
  cb_response=$(curl -s "$DASHBOARD_URL/api/agents/admin/circuit-breaker")
  
  if [[ $cb_response == *"circuits"* ]]; then
    echo -e "${GREEN}✓${NC}"
    ((PASSED++))
    
    # Show states
    echo "$cb_response" | grep -o '"agent_[^"]*' | cut -d'"' -f2 | while read agent; do
      echo "     - $agent"
    done
  else
    echo -e "${RED}✗${NC}"
    ((FAILED++))
  fi
  
  echo ""
}

# ============================================================================
# Test Health Endpoint
# ============================================================================

test_health() {
  echo "Testing Health Endpoint..."
  echo "-------------------------"
  
  echo -n "  Fetching health data... "
  health_response=$(curl -s "$DASHBOARD_URL/api/agents/health")
  
  if [[ $health_response == *"agents"* ]]; then
    echo -e "${GREEN}✓${NC}"
    ((PASSED++))
    
    # Count agents
    agent_count=$(echo "$health_response" | grep -o '"agentId":"agent_' | wc -l)
    echo "     Monitoring $agent_count agents"
  else
    echo -e "${RED}✗${NC}"
    ((FAILED++))
  fi
  
  echo ""
}

# ============================================================================
# Run All Tests
# ============================================================================

echo "Starting comprehensive agent tests..."
echo ""

# Test all 3 agents
test_agent "agent_001_policy" "Policy Monitor"
test_agent "agent_002_funding" "Funding & Grants"
test_agent "agent_004_milestones" "Milestone Tracker"

# Test system endpoints
test_health
test_circuit_breaker

# ============================================================================
# Results
# ============================================================================

echo "========================="
echo "TEST RESULTS"
echo "========================="
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ ALL TESTS PASSED${NC}"
  echo ""
  echo "🎉 Agents system is fully operational!"
  echo ""
  echo "Next steps:"
  echo "  1. Check dashboard at http://localhost:3001/agents"
  echo "  2. View real-time events in the UI"
  echo "  3. Deploy to production when ready"
  exit 0
else
  echo -e "${RED}✗ SOME TESTS FAILED${NC}"
  echo ""
  echo "Please check:"
  echo "  - Both servers running (dashboard:3001, web:3000)"
  echo "  - Database migrations applied"
  echo "  - Environment variables configured"
  echo "  - Agent import paths correct"
  exit 1
fi
