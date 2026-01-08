# 🚀 AGENTS SYSTEM - QUICK START

## In 3 Minutes: Get Agents Running

### Step 1: Database Migration (30 seconds)
```bash
cd /Users/ahhveedaa/ubuntu-initiative
supabase db push
```

Or manually:
```bash
psql -h your-db.supabase.co -U postgres -d postgres \
  -f supabase/migrations/004_agent_system_complete.sql
```

### Step 2: Verify Environment (10 seconds)
```bash
# Dashboard
cat apps/dashboard/.env.local | grep -E "SUPABASE|STRIPE|GOOGLE"

# Should see:
# NEXT_PUBLIC_SUPABASE_URL=...
# SUPABASE_SERVICE_ROLE_KEY=...
# STRIPE_SECRET_KEY=...
# GOOGLE_AI_API_KEY=...
```

### Step 3: Fix Import Paths (60 seconds)
```bash
# Open agent-factory.ts and verify import paths
code apps/dashboard/lib/agent-factory.ts
```

Look for lines 20-30 and adjust paths to match your structure:
```typescript
// Current (may need adjustment):
const { FundingGrantAgent } = await import('@/lib/agents/funding-grant-agent');

// Try this if above fails:
const { FundingGrantAgent } = await import('../../web/lib/agents/funding-grant-agent');
```

### Step 4: Start Servers (30 seconds)
```bash
# Terminal 1: Dashboard
cd apps/dashboard
npm run dev

# Terminal 2: Web (for agents)
cd apps/web
npm run dev
```

### Step 5: Test It! (30 seconds)
```bash
# Test trigger
curl -X POST http://localhost:3001/api/agents/trigger \
  -H "Content-Type: application/json" \
  -d '{"agentId": "agent_002_funding"}'

# Should return:
{
  "success": true,
  "runId": "abc-123",
  "status": "pending"
}
```

### Step 6: Watch Real-Time Stream
Open browser: `http://localhost:3001/agents`

Click "Run Agent" button → See events stream in real-time! 🎉

---

## Quick Test Commands

```bash
# Check health
curl http://localhost:3001/api/agents/health

# Check metrics
curl http://localhost:3001/api/agents/agent_002_funding/metrics

# Check SLA
curl http://localhost:3001/api/agents/sla

# Check public audit log
curl http://localhost:3000/api/agents/audit-log
```

---

## If Something Breaks

### Error: "Agent not available"
→ Check environment variables in `.env.local`

### Error: "Cannot find module"
→ Fix import paths in `agent-factory.ts` (Step 3)

### Error: "relation does not exist"
→ Run database migration (Step 1)

### SSE not streaming
→ Check Supabase Realtime is enabled in project settings

---

## File Structure

```
apps/
├── dashboard/
│   ├── lib/
│   │   ├── agent-factory.ts       # Agent registry
│   │   ├── agent-retry.ts          # Error handling
│   │   └── agent-metrics.ts        # Metrics calculator
│   └── app/api/agents/
│       ├── trigger/route.ts        # Execute agents
│       ├── stream/route.ts         # SSE (unchanged)
│       ├── health/route.ts         # Health check
│       ├── sla/route.ts            # SLA metrics
│       └── [id]/metrics/route.ts   # Agent metrics
└── web/
    ├── lib/agents/
    │   ├── funding-grant-agent.ts  # Funding agent
    │   └── progress-milestone-agent.ts
    └── app/api/agents/
        └── audit-log/route.ts      # Public log

supabase/
└── migrations/
    └── 004_agent_system_complete.sql
```

---

## That's It!

The system is now:
- ✅ Executing real agent code
- ✅ Streaming events via SSE
- ✅ Calculating real metrics
- ✅ Handling errors with retry
- ✅ Protecting with circuit breaker

**Total setup time: ~3 minutes** 🚀
