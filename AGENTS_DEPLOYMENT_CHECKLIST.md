# 🚀 DEPLOYMENT CHECKLIST - Agent System Redesign

## Pre-Deployment

### Local Testing
- [ ] Database schema applied locally
- [ ] Environment variables set
- [ ] Dashboard runs on localhost:3001
- [ ] Web runs on localhost:3000
- [ ] Trigger button works in dashboard
- [ ] Real-time events appear
- [ ] Metrics display correctly
- [ ] Public site has NO trigger buttons
- [ ] Connection status shows "connected"
- [ ] No console errors

### Code Review
- [ ] All files committed to Git
- [ ] No sensitive data in code
- [ ] Environment variables documented
- [ ] README updated
- [ ] Documentation complete

---

## Deployment Steps

### Step 1: Database Setup (Production)

**Supabase Production Database:**

```sql
-- 1. Open Supabase Dashboard
--    https://supabase.com/dashboard

-- 2. Select Production Project

-- 3. Go to SQL Editor

-- 4. Copy entire contents of:
--    packages/database/schema/agent_system.sql

-- 5. Paste and click "Run"

-- 6. Verify tables created:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'agent%';

-- Should return 4 tables:
-- ✅ agent_runs
-- ✅ agent_events
-- ✅ agent_metrics
-- ✅ agent_public_audit_log

-- 7. Verify triggers:
SELECT trigger_name 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';

-- Should include:
-- ✅ update_agent_runs_updated_at
-- ✅ update_agent_metrics_updated_at
-- ✅ update_metrics_on_run_complete
```

**Checklist:**
- [ ] Schema applied successfully
- [ ] 4 tables exist
- [ ] 3 triggers created
- [ ] Initial metrics seeded
- [ ] No SQL errors

---

### Step 2: Enable Supabase Realtime

**Critical for SSE to work:**

```
1. Go to Supabase Dashboard > Settings > API
2. Scroll to "Realtime" section
3. Enable "Realtime" toggle
4. Click "Save"
5. Wait 30 seconds for changes to propagate
```

**Enable Realtime for Tables:**

```
1. Go to Database > Replication
2. Enable replication for:
   ✅ agent_events
   ✅ agent_runs
3. Click "Save"
```

**Checklist:**
- [ ] Realtime enabled in settings
- [ ] Replication enabled for agent_events
- [ ] Replication enabled for agent_runs
- [ ] Changes saved

---

### Step 3: Environment Variables

**Dashboard (apps/dashboard/.env.local):**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # IMPORTANT: Service role key

# App
NEXT_PUBLIC_APP_URL=https://dashboard.ubuntu-initiative.vercel.app
```

**Web (apps/web/.env.local):**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# App
NEXT_PUBLIC_APP_URL=https://ubuntu-initiative.vercel.app
```

**Vercel Environment Variables:**

```
1. Go to Vercel Dashboard
2. Select project (dashboard or web)
3. Settings > Environment Variables
4. Add all variables above
5. Select "Production" environment
6. Click "Save"
7. Repeat for other project
```

**Checklist:**
- [ ] Dashboard env vars set locally
- [ ] Web env vars set locally
- [ ] Dashboard env vars in Vercel
- [ ] Web env vars in Vercel
- [ ] Service role key set (dashboard only)
- [ ] All keys valid (test locally first)

---

### Step 4: Deploy to Vercel

**Option A: Git Push (Recommended)**

```bash
cd /Users/ahhveedaa/ubuntu-initiative

# Commit all changes
git add .
git commit -m "feat: complete agent system redesign with real-time monitoring"
git push origin main

# Vercel will auto-deploy both apps
# Check deployment status:
# https://vercel.com/dashboard
```

**Option B: Manual Deploy**

```bash
# Dashboard
cd apps/dashboard
vercel --prod

# Web
cd apps/web
vercel --prod
```

**Checklist:**
- [ ] Code committed to Git
- [ ] Pushed to main branch
- [ ] Vercel deployment started
- [ ] Dashboard deployment successful
- [ ] Web deployment successful
- [ ] No build errors
- [ ] Deployment URLs noted

---

### Step 5: Smoke Tests (Production)

**Dashboard Tests:**

```
URL: https://[your-dashboard].vercel.app/agents

1. ✅ Page loads without errors
2. ✅ Connection status shows "connecting" then "connected"
3. ✅ All 3 agents visible
4. ✅ Click "Run Agent" on agent_001_policy
5. ✅ Status changes to "running"
6. ✅ Live Activity feed shows events
7. ✅ After ~3 seconds, status changes to "idle"
8. ✅ Click agent card
9. ✅ Metrics panel appears
10. ✅ Metrics show data (Total Runs: 1, etc.)
```

**Web Tests:**

```
URL: https://[your-web].vercel.app/agents

1. ✅ Page loads without errors
2. ✅ Agent capability cards visible
3. ✅ Trust signals present (Human Oversight, etc.)
4. ✅ NO trigger buttons anywhere
5. ✅ Public Audit Trail section visible
6. ✅ IAAN principle at bottom
7. ✅ Transparency info per agent
```

**API Tests:**

```bash
# Test SSE stream
curl -N https://[dashboard].vercel.app/api/agents/stream
# Should show: data: {"type":"connected",...}

# Test trigger
curl -X POST https://[dashboard].vercel.app/api/agents/trigger \
  -H "Content-Type: application/json" \
  -d '{"agentId":"agent_001_policy","triggeredBy":"test"}'
# Should return: {"success":true,"runId":"..."}

# Test metrics
curl https://[dashboard].vercel.app/api/agents/agent_001_policy/metrics
# Should return JSON with metrics

# Test public audit
curl https://[web].vercel.app/api/agents/audit-log
# Should return: {"logs":[],"count":0}
```

**Checklist:**
- [ ] All dashboard tests pass
- [ ] All web tests pass
- [ ] All API tests return expected results
- [ ] No console errors
- [ ] Real-time updates working

---

### Step 6: Database Verification

**Check data was created:**

```sql
-- In Supabase SQL Editor (Production):

-- 1. Check run was created
SELECT * FROM agent_runs ORDER BY created_at DESC LIMIT 5;
-- Should show your test runs

-- 2. Check events logged
SELECT * FROM agent_events ORDER BY created_at DESC LIMIT 10;
-- Should show started, progress, completed events

-- 3. Check metrics updated
SELECT * FROM agent_metrics WHERE agent_id = 'agent_001_policy';
-- Should show:
-- total_runs: 1
-- successful_runs: 1
-- avg_execution_time_ms: ~3000

-- 4. Check public audit log (will be empty initially)
SELECT * FROM agent_public_audit_log ORDER BY created_at DESC;
-- Should be empty (populated manually later)
```

**Checklist:**
- [ ] agent_runs has entries
- [ ] agent_events has entries
- [ ] agent_metrics shows correct counts
- [ ] No database errors

---

### Step 7: Monitoring Setup

**Set up alerts:**

```
1. Supabase Logs
   - Dashboard > Logs
   - Set up email alerts for errors
   
2. Vercel Logs
   - Project > Logs
   - Monitor for API errors
   
3. Browser Monitoring
   - Use Sentry or similar
   - Track frontend errors
```

**Create monitoring dashboard:**

```
1. Supabase Postgres.app or pgAdmin
2. Create views for:
   - Agent run success rates
   - Average execution times
   - Error frequencies
3. Set up daily summary emails
```

**Checklist:**
- [ ] Supabase email alerts configured
- [ ] Vercel error monitoring active
- [ ] Frontend error tracking set up
- [ ] Daily summary scheduled

---

## Post-Deployment

### Immediate (First Hour)

- [ ] Monitor Vercel deployment logs
- [ ] Watch Supabase Realtime connections
- [ ] Check for any error spikes
- [ ] Test from different browsers
- [ ] Test from mobile devices

### First Day

- [ ] Run agent multiple times
- [ ] Verify metrics accuracy
- [ ] Check database growth rate
- [ ] Monitor SSE connection stability
- [ ] Review error logs

### First Week

- [ ] Analyze usage patterns
- [ ] Optimize slow queries
- [ ] Set up data retention policy
- [ ] Create backup schedule
- [ ] Document any issues

---

## Rollback Plan

If critical issues occur:

### Quick Rollback (Git)

```bash
# Find last good commit
git log --oneline

# Revert to it
git revert <commit-hash>
git push origin main

# Vercel will auto-deploy previous version
```

### Database Rollback

```sql
-- If needed, drop new tables:
DROP TABLE IF EXISTS agent_events CASCADE;
DROP TABLE IF EXISTS agent_runs CASCADE;
DROP TABLE IF EXISTS agent_metrics CASCADE;
DROP TABLE IF EXISTS agent_public_audit_log CASCADE;
```

### Manual File Restore

```bash
# Restore old files from backup
cp backup/apps/web/app/agents/page.tsx apps/web/app/agents/page.tsx
cp backup/apps/dashboard/app/agents/page.tsx apps/dashboard/app/agents/page.tsx

# Commit and push
git add .
git commit -m "rollback: revert agent system changes"
git push origin main
```

---

## Success Criteria

### Technical
- ✅ Database schema applied
- ✅ All API endpoints responding
- ✅ Real-time SSE working
- ✅ No build errors
- ✅ No runtime errors

### Functional
- ✅ Agents can be triggered
- ✅ Status updates in real-time
- ✅ Metrics calculate correctly
- ✅ Event feed shows activity
- ✅ Public site secure (no controls)

### Performance
- ✅ Page load <2s
- ✅ SSE connection <1s
- ✅ Agent execution completes
- ✅ Metrics query <100ms
- ✅ No memory leaks

---

## Deployment Sign-Off

Before marking as complete:

**Technical Lead:**
- [ ] Code reviewed
- [ ] Tests pass
- [ ] Documentation complete
- [ ] Signed: ________________

**Product Owner:**
- [ ] Requirements met
- [ ] User experience approved
- [ ] Security verified
- [ ] Signed: ________________

**DevOps:**
- [ ] Infrastructure ready
- [ ] Monitoring configured
- [ ] Backups scheduled
- [ ] Signed: ________________

---

## 🎉 Deployment Complete!

Once all checkboxes are ✅:

**Status:** PRODUCTION READY

**Deployed:** [Date]

**Version:** 2.0.0 (Agent System Redesign)

**Next Steps:**
1. Monitor for 48 hours
2. Gather user feedback
3. Integrate actual agent code
4. Implement approval workflow

---

## Support Contacts

**Issues?**
- Check: AGENTS_REDESIGN_COMPLETE.md (troubleshooting section)
- Review: Browser console, Vercel logs, Supabase logs

**Emergency Rollback:**
- Follow rollback plan above
- Contact team immediately

**Questions:**
- See documentation in project root
- Review AGENTS_QUICKSTART.md
