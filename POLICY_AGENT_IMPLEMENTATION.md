# Policy Agent Implementation - Remaining Steps

## ✅ COMPLETED

1. ✅ Database migration (`002_policy_agent.sql`)
2. ✅ Agent types (`types.ts`)
3. ✅ Gemini system prompt (`prompt.ts`)
4. ✅ Policy agent class (`index.ts`)
5. ✅ Manual trigger API (`/api/agents/policy`)
6. ✅ Cron trigger API (`/api/agents/cron`)
7. ✅ Vercel cron config (`vercel.json`)
8. ✅ Approval functions (`/lib/approval`)
9. ✅ Approval API (`/api/approval`)

## 🚧 REMAINING IMPLEMENTATION

### 1. Environment Variables

Add to `/apps/web/.env.local`:
```bash
CRON_SECRET=your-secure-random-string-here
SUPABASE_SERVICE_KEY=your-service-role-key-here
```

### 2. Database Migration

Run in Supabase SQL Editor:
```bash
# Copy contents of supabase/migrations/002_policy_agent.sql
# Paste and execute in Supabase Dashboard > SQL Editor
```

### 3. Dashboard Pages

See attached files in next message for complete implementation:
- `/apps/dashboard/app/agents/policy/page.tsx` - Policy Agent status
- `/apps/dashboard/app/approval/page.tsx` - Approval queue UI
- Update Sidebar navigation

### 4. Public Policy Page

- `/apps/web/app/policy/page.tsx` - Public transparency page

### 5. Test Execution

```bash
# Manual trigger (development)
curl -X POST http://localhost:3000/api/agents/policy

# Check Supabase tables
- agent_runs
- policy_updates
- agent_audit_log
- approval_queue

# Test approval workflow in dashboard
http://localhost:3001/approval
```

### 6. Deploy

```bash
cd apps/web
vercel --prod

# Set environment variables in Vercel Dashboard
CRON_SECRET=...
SUPABASE_SERVICE_KEY=...
```

## 📋 VALIDATION CHECKLIST

Use this to verify everything works:

- [ ] Database tables created (check Supabase)
- [ ] Manual agent trigger returns success
- [ ] Data written to policy_updates
- [ ] Approval queue has pending items
- [ ] Dashboard loads without errors
- [ ] Approve button works
- [ ] Reject button works
- [ ] Approved items appear on /policy page
- [ ] Cron job scheduled in Vercel

## 🔍 TROUBLESHOOTING

**Agent won't run:**
- Check SUPABASE_SERVICE_KEY is set
- Check GOOGLE_AI_API_KEY is set
- Check database migration ran successfully

**Approval fails:**
- Verify SUPABASE_SERVICE_KEY has write permissions
- Check approval_queue table exists
- Check policy_updates foreign key constraints

**Cron not triggering:**
- Verify CRON_SECRET matches in Vercel settings
- Check vercel.json is deployed
- View cron logs in Vercel Dashboard

## NEXT: DASHBOARD UI FILES

See following messages for complete dashboard page implementations.
