# POLICY AGENT - DEPLOYMENT GUIDE

## ✅ IMPLEMENTATION COMPLETE

All code has been written. Follow these steps to deploy.

---

## STEP 1: APPLY DATABASE MIGRATION (5 minutes)

### 1.1 Go to Supabase Dashboard
- Navigate to: https://supabase.com/dashboard
- Select your Ubuntu Initiative project
- Go to: **SQL Editor** (left sidebar)

### 1.2 Run Migration
1. Open file: `/supabase/migrations/002_policy_agent.sql`
2. Copy entire contents
3. Paste into SQL Editor
4. Click **RUN**
5. Verify success message

### 1.3 Verify Tables Created
Run this query:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('policy_updates', 'agent_runs', 'agent_audit_log', 'approval_queue', 'policy_corrections');
```

Should return 5 rows.

---

## STEP 2: SET ENVIRONMENT VARIABLES (3 minutes)

### 2.1 Generate CRON_SECRET
```bash
# Generate secure random string
openssl rand -base64 32
```

### 2.2 Get SUPABASE_SERVICE_KEY
- Go to Supabase Dashboard
- **Project Settings** > **API**
- Copy **service_role key** (starts with `eyJ...`)
- ⚠️ **NEVER commit this to git or expose client-side**

### 2.3 Add to Vercel (Web App)
- Go to: https://vercel.com/dashboard
- Select **ubuntu-initiative-web** project
- **Settings** > **Environment Variables**
- Add:
  ```
  CRON_SECRET=<your-generated-secret>
  SUPABASE_SERVICE_KEY=<your-service-role-key>
  ```

### 2.4 Add to Vercel (Dashboard App)
- Select **ubuntu-initiative-dashboard** project
- **Settings** > **Environment Variables**
- Add:
  ```
  SUPABASE_SERVICE_KEY=<your-service-role-key>
  ```

### 2.5 Local Development (Optional)
Add to `/apps/web/.env.local`:
```bash
CRON_SECRET=your-secret-here
SUPABASE_SERVICE_KEY=your-service-key-here
```

---

## STEP 3: DEPLOY TO VERCEL (5 minutes)

### 3.1 Deploy Web App
```bash
cd /Users/ahhveedaa/ubuntu-initiative/apps/web
vercel --prod
```

Wait for deployment to complete.

### 3.2 Deploy Dashboard App
```bash
cd /Users/ahhveedaa/ubuntu-initiative/apps/dashboard
vercel --prod
```

### 3.3 Verify Cron Job
1. Go to Vercel Dashboard
2. Select **ubuntu-initiative-web**
3. **Settings** > **Cron Jobs**
4. Should see: `/api/agents/cron` scheduled for `0 6 * * *`
5. If not visible, redeploy

---

## STEP 4: TEST AGENT EXECUTION (5 minutes)

### 4.1 Manual Trigger (Test)
```bash
# Replace with your actual domain
curl -X POST https://ubuntu-initiative-web.vercel.app/api/agents/policy

# Expected response:
{
  "success": true,
  "status": "success",
  "runId": "uuid-here",
  "itemsProcessed": 1
}
```

### 4.2 Verify in Supabase
```sql
-- Check agent ran
SELECT * FROM agent_runs ORDER BY created_at DESC LIMIT 1;

-- Check policy update created
SELECT id, headline, status, relevance_score, confidence_score 
FROM policy_updates ORDER BY created_at DESC LIMIT 1;

-- Check approval queue
SELECT id, priority, status FROM approval_queue WHERE status = 'pending';

-- Check audit log
SELECT action_type, COUNT(*) 
FROM agent_audit_log 
GROUP BY action_type;
```

Should see:
- 1 row in `agent_runs` with status='success'
- 1 row in `policy_updates` with status='pending'
- 1 row in `approval_queue` with status='pending'
- Multiple rows in `agent_audit_log`

---

## STEP 5: TEST APPROVAL WORKFLOW (5 minutes)

### 5.1 Access Dashboard
- Go to: https://ubuntu-initiative-dashboard.vercel.app/approval
- Should see 1 pending policy update

### 5.2 Review & Approve
1. Click on the pending item
2. Review headline, summary, scores
3. Click **"Approve & Publish"**
4. Confirm

### 5.3 Verify Public Display
- Go to: https://ubuntu-initiative-web.vercel.app/policy
- Should see the approved policy update
- Verify confidence scores display
- Click "View Source" to test link

### 5.4 Verify in Database
```sql
SELECT id, status, approved_at, approved_by 
FROM policy_updates 
WHERE status = 'approved';
```

---

## STEP 6: VERIFY CRON SCHEDULE (Optional)

The agent will run automatically at 6am UTC daily.

To test immediately:
1. Go to Vercel Dashboard
2. **Deployments** > Latest deployment
3. **Functions** > `/api/agents/cron`
4. Click **"Invoke"**
5. Check response

---

## ✅ VERIFICATION CHECKLIST

Run through this list:

- [ ] Database migration ran successfully
- [ ] 5 new tables exist in Supabase
- [ ] Environment variables set in Vercel
- [ ] Web app deployed successfully
- [ ] Dashboard app deployed successfully
- [ ] Cron job visible in Vercel settings
- [ ] Manual trigger returns success
- [ ] `agent_runs` table has row
- [ ] `policy_updates` table has row
- [ ] `approval_queue` has pending item
- [ ] `agent_audit_log` has multiple actions
- [ ] Dashboard loads without errors
- [ ] Approval queue page shows pending items
- [ ] Approve button works
- [ ] Approved item appears on `/policy` page
- [ ] Public page shows confidence scores
- [ ] Source links work

---

## 🎯 SUCCESS CRITERIA

**The Policy Agent is LIVE when:**

1. ✅ Agent runs automatically daily
2. ✅ Policy updates are queued for approval
3. ✅ Approvals work in dashboard
4. ✅ Approved items appear publicly
5. ✅ All audit logs are captured
6. ✅ No errors in Vercel logs

---

## 🚨 TROUBLESHOOTING

### Agent Returns 401 Unauthorized
**Issue:** CRON_SECRET mismatch
**Fix:** Verify secret matches in Vercel settings

### Agent Returns 500 Error
**Check:**
1. SUPABASE_SERVICE_KEY is set
2. GOOGLE_AI_API_KEY is set
3. Database tables exist
4. Check Vercel function logs

### Approval Fails
**Check:**
1. SUPABASE_SERVICE_KEY has write permissions
2. `approval_queue` table exists
3. Foreign key constraints valid

### Cron Not Running
**Fix:**
1. Verify `vercel.json` is deployed
2. Check Vercel > Settings > Cron Jobs
3. Wait 24 hours for first scheduled run
4. Use manual invoke to test immediately

### Dashboard Shows No Data
**Check:**
1. Agent has run at least once
2. Supabase connection works
3. Tables have data
4. RLS policies allow reads

---

## 📊 MONITORING

### Daily Checks (Week 1)
- Check `agent_runs` for new rows
- Monitor `approval_queue` count
- Review error logs in Vercel
- Verify public page updates

### Weekly Checks (Ongoing)
- Review approved vs rejected ratio
- Check average confidence scores
- Monitor API response times
- Review audit logs for anomalies

---

## 🔄 NEXT STEPS

1. **Week 1:** Monitor agent execution, fix any issues
2. **Week 2:** Add more policy sources to `fetchPolicySources()`
3. **Week 3:** Implement RSS feeds for automated ingestion
4. **Week 4:** Build public API for corrections

---

## 📞 SUPPORT

If issues persist:
1. Check Vercel function logs
2. Check Supabase logs
3. Review agent_audit_log table
4. Test API endpoints manually

---

**DEPLOYMENT TIME: ~20 minutes**
**POST-DEPLOYMENT MONITORING: 1 week**
**STATUS: PRODUCTION READY ✅**
