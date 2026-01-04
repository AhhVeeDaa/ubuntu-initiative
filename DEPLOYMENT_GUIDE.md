# Ubuntu Initiative Agent System - Deployment Guide

## 🎯 Overview

This guide covers deploying the multi-agent system for the Ubuntu Initiative, transforming the static site into a real-time, agent-driven public dashboard.

## ✅ What's Been Built

### 1. Database Schema (`supabase/migrations/001_initial_schema.sql`)
- ✅ Public tables: milestones, policies, donations (aggregated), knowledge base
- ✅ Private tables: full donation records, audit logs, approval queue, chat logs
- ✅ Row Level Security (RLS) policies
- ✅ Automated triggers for donation aggregation

### 2. Agent Infrastructure (`packages/agents/`)
- ✅ Base Agent class with common functionality
- ✅ Funding & Grant Agent (donation processing, fraud detection)
- ✅ Progress Milestone Agent (validation, confidence scoring)
- ✅ CLI for testing agents
- ✅ Unit tests (all passing)

### 3. Stripe Webhook (`supabase/functions/stripe-webhook/`)
- ✅ Processes payment_intent.succeeded events
- ✅ Auto-creates donation records
- ✅ Triggers aggregation for public stats
- ✅ Logs to audit trail

### 4. Dashboard UI (`apps/web/app/dashboard/`)
- ✅ Agent activity monitoring
- ✅ Approval queue management
- ✅ Milestone statistics
- ✅ Real-time updates

## 📋 Deployment Checklist

### Phase 1: Database Setup

1. **Deploy Schema to Supabase**
```bash
cd ubuntu-initiative

# Option A: Using Supabase CLI
supabase db push

# Option B: Manual
# 1. Go to Supabase Dashboard > SQL Editor
# 2. Copy contents of supabase/migrations/001_initial_schema.sql
# 3. Run the migration
```

2. **Verify Tables Created**
```sql
-- Run in Supabase SQL Editor
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'private';
```

3. **Configure RLS Policies**
```sql
-- Verify policies are enabled
SELECT tablename, policyname FROM pg_policies;
```

### Phase 2: Environment Configuration

1. **Supabase Environment Variables**
```bash
# In Supabase Dashboard > Project Settings > API
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ... (public anon key)
SUPABASE_SERVICE_KEY=eyJ... (service role key - KEEP SECRET!)
```

2. **Stripe Configuration**
```bash
# In Stripe Dashboard
STRIPE_SECRET_KEY=sk_live_... (or sk_test_ for testing)
STRIPE_PUBLISHABLE_KEY=pk_live_... (or pk_test_)
STRIPE_WEBHOOK_SECRET=whsec_... (from webhook endpoint)
```

3. **Gemini AI Configuration**
```bash
# From Google AI Studio
GEMINI_API_KEY=AIza...
```

### Phase 3: Deploy Stripe Webhook

1. **Deploy to Supabase Edge Functions**
```bash
cd ubuntu-initiative

# Deploy webhook function
supabase functions deploy stripe-webhook

# Set secrets
supabase secrets set STRIPE_SECRET_KEY=sk_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
supabase secrets set SUPABASE_URL=https://...
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

2. **Configure Stripe Webhook**
```
1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: https://your-project.supabase.co/functions/v1/stripe-webhook
3. Select events: payment_intent.succeeded
4. Copy webhook signing secret to STRIPE_WEBHOOK_SECRET
```

3. **Test Webhook**
```bash
# Using Stripe CLI
stripe trigger payment_intent.succeeded
```

### Phase 4: Deploy Agent System

**Option A: GitHub Actions (Recommended for scheduled jobs)**

Create `.github/workflows/agents.yml`:
```yaml
name: Run Agents

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:  # Manual trigger

jobs:
  run-milestone-agent:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: |
          cd packages/agents
          npm install
      - name: Run Milestone Agent
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
        run: |
          cd packages/agents
          node src/agents/milestone-agent.js
```

**Option B: Vercel Serverless Functions**

Create `apps/web/api/agents/milestone.ts`:
```typescript
import { MilestoneAgent } from '@/../../packages/agents/src/agents/milestone-agent';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const agent = new MilestoneAgent();
  const result = await agent.processMilestone(req.body);
  
  return res.status(200).json(result);
}
```

### Phase 5: Frontend Integration

1. **Update Environment Variables**
```bash
# In Vercel Dashboard or .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ... (server-side only)
```

2. **Deploy Dashboard**
```bash
cd apps/web
vercel --prod
```

3. **Test Dashboard**
- Visit `/dashboard` (requires authentication)
- Verify agent activity logs appear
- Check approval queue

### Phase 6: Testing End-to-End

1. **Test Donation Flow**
```bash
# Create test donation
stripe trigger payment_intent.succeeded

# Verify in Supabase
# 1. Check donations table (private schema)
# 2. Check donation_aggregates table (public schema)
# 3. Check agent_audit_log for funding agent entry
```

2. **Test Milestone Submission**
```bash
cd packages/agents
node src/cli.js test:milestone

# Or via API
curl -X POST https://your-site.vercel.app/api/agents/milestone \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Milestone",
    "description": "Testing milestone ingestion system...",
    "category": "technical",
    "completion_date": "2025-01-05",
    "evidence_url": "https://github.com/commit/123"
  }'
```

3. **Verify Public Display**
```bash
# Check if data appears on public site
# Visit https://your-site.vercel.app/progress
# Should see: Milestone timeline, donation thermometer
```

## 🔒 Security Checklist

- [ ] RLS policies enabled on all tables
- [ ] Service role key stored securely (never in client code)
- [ ] Stripe webhook secret configured
- [ ] HTTPS enabled on all endpoints
- [ ] CORS configured properly
- [ ] Rate limiting enabled (via Supabase)
- [ ] Audit logging active

## 📊 Monitoring

### View Agent Activity
```sql
-- Recent agent actions
SELECT agent_id, action_type, confidence_score, timestamp
FROM private.agent_audit_log
ORDER BY timestamp DESC
LIMIT 20;

-- Approval queue status
SELECT item_type, status, priority, COUNT(*)
FROM private.approval_queue
GROUP BY item_type, status, priority;
```

### Dashboard Access
- Internal Dashboard: `https://your-site.vercel.app/dashboard`
- Supabase Dashboard: `https://app.supabase.com/project/your-project`

## 🚀 Next Steps

### Immediate
1. Deploy remaining agents (Policy Agent, Community Signal Agent)
2. Set up automated email digests
3. Configure GitHub Actions for scheduled runs
4. Implement authentication for dashboard

### Short-term
5. Add Research Synthesis Agent
6. Build approval workflow UI
7. Create admin panel for agent configuration
8. Set up monitoring alerts

### Long-term
9. Deploy all 8 agents from architecture
10. Implement all 12 automations
11. Build public API for milestone submissions
12. Create mobile app integration

## 📝 Troubleshooting

### Webhook Not Receiving Events
```bash
# Test locally with Stripe CLI
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook
stripe trigger payment_intent.succeeded
```

### Agent Fails to Connect to Database
```bash
# Verify environment variables
echo $SUPABASE_URL
echo $SUPABASE_SERVICE_KEY

# Test connection
node -e "
  import { createClient } from '@supabase/supabase-js';
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const { data, error } = await supabase.from('milestone_events').select('count');
  console.log(data, error);
"
```

### Dashboard Shows No Data
```bash
# Check if tables have data
SELECT COUNT(*) FROM public.milestone_events;
SELECT COUNT(*) FROM private.agent_audit_log;

# Verify RLS policies allow read access
SELECT * FROM pg_policies WHERE tablename = 'milestone_events';
```

## 📧 Support

For issues:
1. Check logs: Supabase Dashboard > Logs
2. Review audit trail: `private.agent_audit_log` table
3. GitHub Issues: `github.com/ubuntu-initiative/issues`

---

**Status**: ✅ Phase 1 Complete (Foundation & 2 Agents Deployed)

**Next Deployment**: Policy Tracking Agent + Community Signal Agent
