# 🚀 UBUNTU INITIATIVE - FULL AGENT ACTIVATION GUIDE

## 🎯 Mission: Bring All 8 Agents Online & Operational

**Status**: Agents are configured and healthy locally. Need to activate production workflows.

**Timeline**: 2-3 hours for complete activation

---

## 📊 CURRENT STATUS

### ✅ What's Already Done

1. **All 8 Agents Built** - Complete implementations:
   - PolicyAgent (monitors DRC regulations)
   - CommunityAgent (social sentiment tracking)
   - NarrativeAgent (content generation)
   - FundingAgent (grant opportunities)
   - ChatbotAgent (Inga GPT Q&A)
   - MilestoneAgent (project progress)
   - ResearchAgent (academic synthesis)
   - DueDiligenceAgent (stakeholder vetting)

2. **Environment Configured**:
   - ✅ SUPABASE_URL: Connected
   - ✅ SUPABASE_SERVICE_KEY: Valid
   - ✅ GEMINI_API_KEY: Active
   - ✅ Local testing: 8/8 agents ready

3. **Database Schema**: All tables exist
4. **Web Dashboard**: Built and ready
5. **CLI Tools**: Fully functional

### 🔧 What Needs Activation

1. **Production Deployment** - Deploy agents to Vercel
2. **Cron Scheduling** - Automate daily/weekly runs
3. **Webhook Integration** - Real-time triggers
4. **Monitoring Setup** - Track agent performance
5. **Public Interfaces** - Activate chatbot and dashboards

---

## 🗺️ ACTIVATION ROADMAP

### Phase 1: Foundation (30 min)
- Verify Vercel environment variables
- Test API endpoints
- Activate agent status dashboard

### Phase 2: Core Automation (45 min)
- Deploy cron jobs for scheduled agents
- Set up PolicyAgent daily monitoring
- Configure ResearchAgent weekly synthesis

### Phase 3: Interactive Systems (30 min)
- Activate ChatbotAgent (Inga GPT)
- Enable MilestoneAgent tracking
- Connect FundingAgent to grant databases

### Phase 4: Intelligence Layer (30 min)
- Launch CommunityAgent social listening
- Activate NarrativeAgent content pipeline
- Enable DueDiligenceAgent vetting system

---

## 📋 DETAILED ACTIVATION STEPS

### PHASE 1: FOUNDATION

#### Step 1.1: Verify Vercel Environment (5 min)

**Dashboard App**: https://vercel.com/avida-s-projects/ubuntu-initiative-dashboard

Check these variables exist:
```
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY (not SUPABASE_SERVICE_KEY!)
GOOGLE_AI_API_KEY
```

**Web App**: https://vercel.com/avida-s-projects/ubuntu-initiative-web

Check these variables exist:
```
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
GOOGLE_AI_API_KEY
CRON_SECRET (generate if missing: openssl rand -base64 32)
```

#### Step 1.2: Test Agent API (5 min)

```bash
# Test local agent status
cd /Users/ahhveedaa/ubuntu-initiative/packages/agents
npm run cli status

# Test production API
curl https://ubuntu-initiative-web.vercel.app/api/agents/status
```

**Expected**: JSON with 8 agents, status='healthy'

#### Step 1.3: Activate Dashboard (10 min)

1. Deploy latest dashboard:
```bash
cd /Users/ahhveedaa/ubuntu-initiative/apps/dashboard
vercel --prod
```

2. Visit: `https://ubuntu-initiative-dashboard.vercel.app/agents`

3. Verify all 8 agents show "ready" status

#### Step 1.4: Database Verification (10 min)

Go to Supabase SQL Editor and run:

```sql
-- Check all agent tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%agent%' OR table_name LIKE 'policy%';

-- Verify RLS policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';

-- Test write permissions
INSERT INTO agent_audit_log (
  agent_id, 
  action_type, 
  details
) VALUES (
  'agent_001_policy',
  'system_test',
  '{"message": "Testing write permissions"}'::jsonb
);

SELECT * FROM agent_audit_log ORDER BY created_at DESC LIMIT 1;
```

✅ **CHECKPOINT 1**: Foundation is solid

---

### PHASE 2: CORE AUTOMATION

#### Step 2.1: Deploy PolicyAgent Cron (15 min)

**Purpose**: Monitor DRC government policy changes daily at 6am UTC

1. Verify cron configuration exists:
```bash
cd /Users/ahhveedaa/ubuntu-initiative/apps/web
cat vercel.json | grep -A 5 "crons"
```

Should see:
```json
{
  "crons": [{
    "path": "/api/agents/cron",
    "schedule": "0 6 * * *"
  }]
}
```

2. Deploy web app with cron:
```bash
cd /Users/ahhveedaa/ubuntu-initiative/apps/web
vercel --prod
```

3. Verify cron is active:
   - Go to Vercel Dashboard > ubuntu-initiative-web
   - Click Settings > Cron Jobs
   - Should see cron listed with schedule

4. Test manual trigger:
```bash
curl -X POST https://ubuntu-initiative-web.vercel.app/api/agents/policy \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

5. Check results in Supabase:
```sql
SELECT * FROM agent_runs 
WHERE agent_id = 'agent_001_policy' 
ORDER BY created_at DESC LIMIT 1;
```

#### Step 2.2: Deploy ResearchAgent Weekly (15 min)

**Purpose**: Synthesize academic papers every Monday at 9am UTC

1. Add weekly cron to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/agents/cron",
      "schedule": "0 6 * * *"
    },
    {
      "path": "/api/agents/research",
      "schedule": "0 9 * * 1"
    }
  ]
}
```

2. Create research agent API:
```bash
# Create file: apps/web/app/api/agents/research/route.ts
```

3. Deploy:
```bash
cd /Users/ahhveedaa/ubuntu-initiative/apps/web
vercel --prod
```

4. Test manually:
```bash
cd /Users/ahhveedaa/ubuntu-initiative/packages/agents
npm run cli run research
```

#### Step 2.3: Verify Automation (15 min)

1. Check agent_runs table:
```sql
SELECT 
  agent_id,
  status,
  items_processed,
  created_at
FROM agent_runs
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

2. Monitor Vercel function logs:
   - Vercel Dashboard > ubuntu-initiative-web
   - Click Logs tab
   - Filter by "/api/agents"

3. Set up alerts (optional):
   - Vercel Dashboard > Settings > Notifications
   - Enable "Failed Function Invocations"

✅ **CHECKPOINT 2**: Automation is running

---

### PHASE 3: INTERACTIVE SYSTEMS

#### Step 3.1: Activate Inga GPT Chatbot (15 min)

**Purpose**: Public Q&A interface for Ubuntu Initiative

1. Create chatbot API endpoint:
```typescript
// File: apps/web/app/api/chat/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ChatbotAgent } from '@ubuntu-initiative/agents';

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId } = await req.json();
    
    const agent = new ChatbotAgent();
    const response = await agent.processQuery(message, sessionId);
    
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
```

2. Create chatbot UI component:
```bash
# File: apps/web/app/chat/page.tsx
# Implement chat interface with message history
```

3. Test chatbot:
```bash
curl -X POST https://ubuntu-initiative-web.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the Ubuntu Initiative?", "sessionId": "test-123"}'
```

#### Step 3.2: Enable MilestoneAgent Tracking (10 min)

**Purpose**: Track Phase 0 milestones in real-time

1. Run manual milestone check:
```bash
cd /Users/ahhveedaa/ubuntu-initiative/packages/agents
npm run cli run milestone
```

2. Add to dashboard:
   - Display current phase progress
   - Show upcoming milestones
   - Alert on delays

3. Create progress API:
```typescript
// File: apps/web/app/api/progress/route.ts
export async function GET() {
  const agent = new MilestoneAgent();
  const progress = await agent.getCurrentProgress();
  return NextResponse.json(progress);
}
```

#### Step 3.3: Connect FundingAgent (5 min)

**Purpose**: Scan grant databases for opportunities

1. Configure grant sources in environment:
```
GRANTS_API_KEY=your-grants-gov-api-key
```

2. Run first scan:
```bash
npm run cli run funding
```

3. Review opportunities:
```sql
SELECT 
  title,
  funder,
  amount_usd,
  deadline,
  success_probability
FROM funding_opportunities
WHERE status = 'active'
ORDER BY success_probability DESC;
```

✅ **CHECKPOINT 3**: Interactive systems live

---

### PHASE 4: INTELLIGENCE LAYER

#### Step 4.1: Launch CommunityAgent (15 min)

**Purpose**: Monitor social sentiment about the project

1. Configure social media sources:
```
TWITTER_API_KEY=your-twitter-key
TWITTER_API_SECRET=your-twitter-secret
REDDIT_CLIENT_ID=your-reddit-id
```

2. Set up listening endpoints:
```bash
# Create webhook receiver for social mentions
# File: apps/web/app/api/webhooks/social/route.ts
```

3. Start monitoring:
```bash
npm run cli run community
```

4. View sentiment dashboard:
```sql
SELECT 
  DATE(created_at) as date,
  sentiment,
  COUNT(*) as mentions
FROM community_signals
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at), sentiment
ORDER BY date DESC;
```

#### Step 4.2: Activate NarrativeAgent (10 min)

**Purpose**: Generate transparent project updates

1. Create content generation API:
```typescript
// File: apps/web/app/api/content/generate/route.ts
export async function POST(req: NextRequest) {
  const { type, context } = await req.json();
  
  const agent = new NarrativeAgent();
  const content = await agent.generateContent(type, context);
  
  // Queue for human review
  return NextResponse.json({ 
    contentId: content.id,
    status: 'pending_review' 
  });
}
```

2. Add to approval queue workflow
3. Test generation:
```bash
curl -X POST https://ubuntu-initiative-web.vercel.app/api/content/generate \
  -H "Content-Type: application/json" \
  -d '{"type": "blog_post", "context": {"topic": "Phase 0 Progress"}}'
```

#### Step 4.3: Enable DueDiligenceAgent (5 min)

**Purpose**: Vet potential partners and stakeholders

1. Configure verification sources:
```
OPENCORPORATES_API_KEY=your-key
CLEARBIT_API_KEY=your-key
```

2. Create vetting API:
```typescript
// File: apps/web/app/api/vet/route.ts
export async function POST(req: NextRequest) {
  const { entity, entityType } = await req.json();
  
  const agent = new DueDiligenceAgent();
  const report = await agent.vetEntity(entity, entityType);
  
  return NextResponse.json(report);
}
```

3. Test vetting:
```bash
npm run cli run due-diligence
```

✅ **CHECKPOINT 4**: Intelligence layer active

---

## 🎯 FINAL ACTIVATION CHECKLIST

### Systems Check

- [ ] All 8 agents show "ready" in dashboard
- [ ] PolicyAgent cron running daily (check Vercel)
- [ ] ResearchAgent cron running weekly
- [ ] ChatbotAgent API responding to queries
- [ ] MilestoneAgent tracking Phase 0
- [ ] FundingAgent scanning opportunities
- [ ] CommunityAgent monitoring social channels
- [ ] NarrativeAgent generating content
- [ ] DueDiligenceAgent vetting entities

### Database Health

- [ ] agent_runs logging all executions
- [ ] agent_audit_log tracking all actions
- [ ] approval_queue capturing review items
- [ ] No errors in recent runs (past 24h)

### Monitoring Active

- [ ] Vercel function logs accessible
- [ ] Supabase logs visible
- [ ] Error alerts configured
- [ ] Performance metrics tracked

### Public Interfaces

- [ ] Agent dashboard live
- [ ] Chatbot accessible
- [ ] Progress tracker visible
- [ ] Policy feed updating

---

## 📊 POST-ACTIVATION MONITORING

### Daily Checks (5 min)

```sql
-- Check agent health
SELECT 
  agent_id,
  status,
  COUNT(*) as runs,
  AVG(execution_time_ms) as avg_time
FROM agent_runs
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY agent_id, status;

-- Check pending approvals
SELECT COUNT(*) FROM approval_queue WHERE status = 'pending';

-- Check recent errors
SELECT * FROM agent_audit_log 
WHERE action_type = 'error' 
AND created_at > NOW() - INTERVAL '24 hours';
```

### Weekly Review (15 min)

```sql
-- Agent performance report
SELECT 
  agent_id,
  COUNT(*) as total_runs,
  SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successes,
  SUM(CASE WHEN status = 'error' THEN 1 ELSE 0 END) as errors,
  ROUND(AVG(execution_time_ms)) as avg_ms
FROM agent_runs
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY agent_id;

-- Content approval metrics
SELECT 
  approved_by,
  COUNT(*) as approvals,
  AVG(confidence_score) as avg_confidence
FROM policy_updates
WHERE approved_at > NOW() - INTERVAL '7 days'
GROUP BY approved_by;
```

---

## 🚨 TROUBLESHOOTING GUIDE

### Issue: Agent shows "not ready"
**Fix:**
1. Check environment variables in Vercel
2. Verify Supabase connection
3. Test Gemini API key validity
4. Review agent_audit_log for errors

### Issue: Cron not triggering
**Fix:**
1. Verify cron is listed in Vercel dashboard
2. Check CRON_SECRET matches in code and env
3. Review function logs for errors
4. Test manual trigger first

### Issue: Database connection fails
**Fix:**
1. Verify SUPABASE_SERVICE_ROLE_KEY (not SERVICE_KEY!)
2. Check RLS policies allow service role
3. Test connection with simple query
4. Review Supabase logs

### Issue: Gemini API errors
**Fix:**
1. Check API quota remaining
2. Verify API key format correct
3. Test with simple prompt
4. Review rate limiting settings

---

## 🎉 SUCCESS CRITERIA

Your agent system is **FULLY OPERATIONAL** when:

✅ All 8 agents executing successfully  
✅ Cron jobs running on schedule  
✅ Public chatbot responding to queries  
✅ Dashboard showing real-time data  
✅ Approval workflow functioning  
✅ No errors in past 24 hours  
✅ Monitoring and alerts active  

**You will have achieved:**
- Complete AI automation for project oversight
- Real-time policy monitoring
- Intelligent stakeholder engagement
- Automated progress tracking
- Transparent content generation
- **Africa's first sovereign AI management system**

---

## 🚀 NEXT LEVEL: OPTIMIZATION

After 1 week of operation:

1. **Tune Agent Parameters**:
   - Adjust confidence thresholds
   - Refine relevance scoring
   - Optimize API call frequency

2. **Expand Data Sources**:
   - Add more policy monitoring sources
   - Connect to additional grant databases
   - Integrate more research repositories

3. **Enhance Intelligence**:
   - Train custom models on DRC-specific data
   - Build specialized embeddings
   - Create domain-specific classifiers

4. **Scale Operations**:
   - Add more specialized agents
   - Implement agent collaboration
   - Build agent swarm capabilities

---

**Built for the Ubuntu Initiative**  
**Powering Africa's AI Infrastructure Revolution**  
**🌍 Transparency • Accountability • Congolese Values 🇨🇩**

---

*Last Updated: January 6, 2026*
*Status: Ready for Full Activation*
