# 🚀 QUICK START - Apply Agent System Redesign

## ⚡ 5-Minute Setup

### Step 1: Apply Database Schema (2 minutes)

```bash
# Option A: Supabase Dashboard (Recommended)
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click "SQL Editor" in left sidebar
4. Copy contents of: packages/database/schema/agent_system.sql
5. Paste into editor
6. Click "Run"
7. ✅ Done! Tables created.

# Option B: Command Line
cd /Users/ahhveedaa/ubuntu-initiative
psql "postgresql://[your-supabase-connection-string]" < packages/database/schema/agent_system.sql
```

### Step 2: Verify Environment Variables (1 minute)

```bash
# Dashboard: apps/dashboard/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Web: apps/web/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Step 3: Test Locally (2 minutes)

```bash
# Terminal 1 - Dashboard
cd apps/dashboard
npm run dev
# Opens on http://localhost:3001

# Terminal 2 - Web
cd apps/web
npm run dev
# Opens on http://localhost:3000

# Test:
# 1. Visit http://localhost:3000/agents (public - no buttons)
# 2. Visit http://localhost:3001/agents (admin - trigger buttons)
# 3. Click "Run Agent" in dashboard
# 4. Watch real-time updates! ✅
```

### Step 4: Deploy to Production (30 seconds)

```bash
# If connected to Vercel via Git:
git add .
git commit -m "feat: agent system redesign with real-time monitoring"
git push origin main

# Or manual deploy:
cd apps/dashboard && vercel --prod
cd apps/web && vercel --prod
```

---

## 🎯 What to Test

### Dashboard (http://localhost:3001/agents)

1. ✅ Connection status shows "connected" (green dot)
2. ✅ Click "Run Agent" on any agent
3. ✅ Status changes to "running" with spinner
4. ✅ Live Activity feed shows events in real-time
5. ✅ After ~3 seconds, status changes to "idle" with green checkmark
6. ✅ Click agent card to see detailed metrics
7. ✅ Performance panel shows total runs, success rate, etc.

### Public Site (http://localhost:3000/agents)

1. ✅ Page shows agent capabilities (NO trigger buttons)
2. ✅ Trust signals visible (Human Oversight, Audit Trail, etc.)
3. ✅ Public Audit Log section visible (empty initially)
4. ✅ IAAN principle explained at bottom
5. ✅ No operational controls anywhere

---

## 🐛 Quick Fixes

### "Connection: disconnected" in Dashboard

```bash
# Enable Supabase Realtime:
1. Go to Supabase Dashboard > Settings > API
2. Scroll to "Realtime"
3. Enable "Realtime" toggle
4. Click "Save"
5. Refresh dashboard
```

### "No events showing" after trigger

```bash
# Check database:
1. Go to Supabase > Table Editor
2. Open "agent_events" table
3. Should see rows appearing
4. If not, check browser console for errors
```

### Trigger button does nothing

```bash
# Check API endpoint:
curl -X POST http://localhost:3001/api/agents/trigger \
  -H "Content-Type: application/json" \
  -d '{"agentId":"agent_001_policy"}'

# Should return: {"success":true,"runId":"..."}
```

---

## 📋 Verification Checklist

After setup, verify:

- [ ] Database tables created (agent_runs, agent_events, agent_metrics, agent_public_audit_log)
- [ ] Environment variables set in both apps
- [ ] Dashboard shows connection status as "connected"
- [ ] Clicking "Run Agent" triggers execution
- [ ] Live Activity feed updates in real-time
- [ ] Metrics panel shows data when agent is selected
- [ ] Public site has NO trigger buttons
- [ ] Public site shows trust signals and transparency info

---

## 🎉 Success!

If all checkboxes are ✅, you're done!

The agent system is now:
- ✅ Database-backed (real data)
- ✅ Real-time monitored (SSE stream)
- ✅ Properly separated (public vs admin)
- ✅ Production-ready

**Next:** Integrate actual agent code in `apps/dashboard/app/api/agents/trigger/route.ts`

See `AGENTS_REDESIGN_COMPLETE.md` for full documentation.
