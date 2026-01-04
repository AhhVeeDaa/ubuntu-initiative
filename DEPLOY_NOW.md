# 🚀 DEPLOY NOW - POLICY AGENT

## ✅ CODE COMMITTED & PUSHED

All code has been committed to `main` branch and pushed to GitHub.

---

## 📋 DEPLOYMENT CHECKLIST

### 1. DATABASE SETUP (5 minutes)

#### Step 1.1: Open Supabase
1. Go to: https://supabase.com/dashboard
2. Select: **Ubuntu Initiative** project
3. Click: **SQL Editor** (left sidebar)

#### Step 1.2: Run Migration
1. Open file: `/supabase/migrations/002_policy_agent.sql`
2. Copy **ALL** contents (283 lines)
3. Paste into Supabase SQL Editor
4. Click: **RUN** button
5. Wait for success message

#### Step 1.3: Verify Tables
Run this query:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('policy_updates', 'agent_runs', 'agent_audit_log', 'approval_queue', 'policy_corrections');
```

**Expected:** 5 rows returned

✅ **CHECKPOINT:** Database is ready

---

### 2. ENVIRONMENT VARIABLES (3 minutes)

#### Step 2.1: Generate CRON_SECRET
```bash
# Run in terminal:
openssl rand -base64 32

# Copy the output (e.g., "h3k4j5h6k7j8h9k0...")
```

#### Step 2.2: Get SUPABASE_SERVICE_KEY
1. Go to: Supabase Dashboard
2. Click: **Project Settings** (gear icon)
3. Click: **API** tab
4. Find: **service_role** key
5. Click: **Reveal** and **Copy**

⚠️ **WARNING:** This key has admin access. Never expose client-side.

#### Step 2.3: Add to Vercel - WEB APP
1. Go to: https://vercel.com/dashboard
2. Select: **ubuntu-initiative-web** project
3. Click: **Settings** tab
4. Click: **Environment Variables**
5. Add two variables:

```
Key: CRON_SECRET
Value: <paste-your-generated-secret>
Environments: Production

Key: SUPABASE_SERVICE_KEY  
Value: <paste-your-service-role-key>
Environments: Production
```

#### Step 2.4: Add to Vercel - DASHBOARD APP
1. Select: **ubuntu-initiative-dashboard** project
2. Click: **Settings** > **Environment Variables**
3. Add one variable:

```
Key: SUPABASE_SERVICE_KEY
Value: <paste-your-service-role-key>
Environments: Production
```

✅ **CHECKPOINT:** Environment variables configured

---

### 3. DEPLOY APPLICATIONS (5 minutes)

#### Step 3.1: Deploy Web App
```bash
cd /Users/ahhveedaa/ubuntu-initiative/apps/web
vercel --prod
```

**Wait for:**
- ✅ Building
- ✅ Deploying
- ✅ Success message with URL

#### Step 3.2: Deploy Dashboard App
```bash
cd /Users/ahhveedaa/ubuntu-initiative/apps/dashboard
vercel --prod
```

**Wait for:**
- ✅ Building
- ✅ Deploying
- ✅ Success message with URL

#### Step 3.3: Verify Cron Job
1. Go to: Vercel Dashboard
2. Select: **ubuntu-initiative-web**
3. Click: **Settings** > **Cron Jobs**
4. Should see:
   - Path: `/api/agents/cron`
   - Schedule: `0 6 * * *` (6am UTC daily)

✅ **CHECKPOINT:** Both apps deployed

---

### 4. TEST AGENT (5 minutes)

#### Step 4.1: Trigger Manual Run
```bash
# Replace with your actual domain
curl -X POST https://ubuntu-initiative-web.vercel.app/api/agents/policy
```

**Expected Response:**
```json
{
  "success": true,
  "status": "success",
  "runId": "some-uuid",
  "itemsProcessed": 1
}
```

If you get an error, check Vercel function logs.

#### Step 4.2: Verify in Supabase
Go to Supabase Dashboard > Table Editor

**Check agent_runs:**
```sql
SELECT * FROM agent_runs ORDER BY created_at DESC LIMIT 1;
```
Should see: status='success', items_processed=1

**Check policy_updates:**
```sql
SELECT id, headline, status, relevance_score, confidence_score 
FROM policy_updates ORDER BY created_at DESC LIMIT 1;
```
Should see: status='pending', headline exists

**Check approval_queue:**
```sql
SELECT id, priority, status FROM approval_queue WHERE status = 'pending';
```
Should see: 1 pending item

✅ **CHECKPOINT:** Agent executed successfully

---

### 5. TEST DASHBOARD (3 minutes)

#### Step 5.1: Open Dashboard
Go to: https://ubuntu-initiative-dashboard.vercel.app/agents/policy

**Should see:**
- Pending Review: 1
- Approved: 0
- Rejected: 0
- Last Run status: success

#### Step 5.2: Test Approval Queue
1. Click: **Approval Queue** in sidebar
2. Should see: 1 pending policy update
3. Click on the item to view details
4. Verify:
   - Headline displays
   - Summary displays
   - Confidence & relevance scores shown
   - Source link works

✅ **CHECKPOINT:** Dashboard is operational

---

### 6. TEST APPROVAL WORKFLOW (2 minutes)

#### Step 6.1: Approve Policy Update
1. In Approval Queue, select the pending item
2. Review the content
3. Click: **"Approve & Publish"**
4. Confirm when prompted

#### Step 6.2: Verify Approval
Go to Supabase:
```sql
SELECT id, status, approved_at, approved_by 
FROM policy_updates 
WHERE status = 'approved';
```
Should see: 1 row with status='approved'

#### Step 6.3: Check Public Display
Go to: https://ubuntu-initiative-web.vercel.app/policy

**Should see:**
- 1 approved policy update
- Headline, summary, scores
- Source link works
- Verification details expandable

✅ **CHECKPOINT:** Full workflow operational

---

## ✅ FINAL VERIFICATION

### Run This Checklist:

- [ ] Database has 5 new tables
- [ ] Environment variables set in Vercel
- [ ] Web app deployed successfully
- [ ] Dashboard app deployed successfully
- [ ] Cron job configured (visible in Vercel)
- [ ] Manual trigger returns success
- [ ] agent_runs has 1 row with status='success'
- [ ] policy_updates has 1 row with status='pending'
- [ ] approval_queue has 1 pending item
- [ ] Dashboard loads without errors
- [ ] Policy Agent page shows correct stats
- [ ] Approval Queue displays pending items
- [ ] Approve button works
- [ ] Approved item shows on /policy page
- [ ] Public page shows confidence scores
- [ ] Source links are functional

---

## 🎉 SUCCESS!

If all checkboxes are checked, the Policy Agent is **LIVE IN PRODUCTION**.

### What Happens Next:

1. **Tomorrow at 6am UTC:** Agent will run automatically
2. **Check Vercel Cron Logs:** Verify scheduled execution
3. **Monitor Approval Queue:** Review new policy updates
4. **Approve Relevant Items:** Publish to public feed

### Monitoring Commands:

```sql
-- Check daily runs
SELECT * FROM agent_runs 
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- Check pending approvals
SELECT COUNT(*) FROM approval_queue WHERE status = 'pending';

-- Check approved items
SELECT COUNT(*) FROM policy_updates WHERE status = 'approved';

-- Check error rate
SELECT 
  status, 
  COUNT(*) 
FROM agent_runs 
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY status;
```

---

## 🚨 TROUBLESHOOTING

### Issue: Manual trigger returns 401
**Fix:** CRON_SECRET mismatch - verify in Vercel settings

### Issue: Manual trigger returns 500
**Check:**
1. SUPABASE_SERVICE_KEY is set
2. GOOGLE_AI_API_KEY is set
3. Database tables exist
4. Check Vercel function logs

### Issue: Approval fails
**Check:**
1. SUPABASE_SERVICE_KEY has write permissions
2. approval_queue table exists
3. Foreign keys valid

### Issue: Dashboard shows "Loading forever"
**Check:**
1. Supabase connection works
2. Tables have data
3. Browser console for errors

---

## 📞 SUPPORT

If issues persist after troubleshooting:

1. Check Vercel function logs
2. Check Supabase logs  
3. Review agent_audit_log table
4. Test API endpoints with curl

---

**DEPLOYMENT TIME:** ~20 minutes  
**STATUS:** Ready to deploy  
**NEXT:** Monitor for 24 hours, then add more policy sources

🚀 **LET'S GO!**
