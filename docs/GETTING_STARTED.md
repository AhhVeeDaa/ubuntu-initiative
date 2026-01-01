# Ubuntu Initiative - Getting Started Guide

## What You Have Now

I've set up the complete project infrastructure for the Ubuntu Initiative system:

### Project Structure
```
ubuntu-initiative/
├── README.md                          # Project overview
├── packages/
│   ├── database/
│   │   └── schema.sql                 # Complete database schema
│   └── agents/
│       ├── README.md                  # Agent architecture docs
│       ├── agents/
│       │   └── research.js            # Research Intelligence Agent (starter)
│       ├── tools/                     # Agent tools (to be built)
│       └── config/                    # Agent configuration
├── apps/                              # Website and dashboard (to be built)
├── docs/                              # Documentation
└── scripts/                           # Automation scripts
```

### What's Built

✅ **Database Schema** - Complete PostgreSQL schema with:
- Milestones tracking
- Partnership pipeline
- Document library
- Activity logging
- Metrics tracking
- Communications log
- Agent task tracking
- Research storage
- Dashboard views
- Seed data for Phase 0

✅ **Agent Framework** - Structure for 6 core agents:
- Research Intelligence (started)
- Partnership Scout
- Document Engine
- Financial Modeler
- Communications Manager
- Website Publisher

✅ **Documentation** - Architecture and setup guides

## Next Steps

### Step 1: Set Up Development Environment (1-2 hours)

1. **Install Node.js** (if not already installed):
```bash
# Check if you have Node.js
node --version  # Should be 18+

# If not, install from https://nodejs.org
```

2. **Initialize the project**:
```bash
cd /Users/ahhveedaa/ubuntu-initiative
npm init -y
```

3. **Install core dependencies**:
```bash
npm install next@latest react@latest react-dom@latest
npm install @supabase/supabase-js
npm install @google/generative-ai
npm install tailwindcss postcss autoprefixer
```

### Step 2: Set Up Supabase (30 minutes)

1. **Create Supabase account**: 
   - Go to https://supabase.com
   - Sign up for free account

2. **Create new project**:
   - Name: "Ubuntu Initiative"
   - Database password: (save securely)
   - Region: Choose closest to you

3. **Run database setup**:
   - In Supabase dashboard, go to SQL Editor
   - Copy contents of `/packages/database/schema.sql`
   - Paste and execute

4. **Get connection details**:
   - Project Settings → API
   - Copy `URL` and `anon` key

5. **Create `.env.local` file**:
```bash
cd /Users/ahhveedaa/ubuntu-initiative
cat > .env.local << EOF
SUPABASE_URL=your-project-url
SUPABASE_KEY=your-anon-key
GOOGLE_AI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EOF
```

### Step 3: Set Up Google AI (20 minutes)

1. **Get Gemini API key**:
   - Go to https://makersuite.google.com/app/apikey
   - Create new API key
   - Add to `.env.local`

2. **Test Google Antigravity**:
   - You already have `.antigravity` directory
   - Follow codelabs at: https://codelabs.developers.google.com/getting-started-google-antigravity

### Step 4: Build the Public Website (Week 1)

1. **Create Next.js app**:
```bash
cd apps
npx create-next-app@latest web --typescript --tailwind --app
cd web
npm install
```

2. **Key pages to build**:
- Homepage with vision and live progress tracker
- Vision page (Ubuntu Blueprint formatted nicely)
- Progress page (real-time milestone tracking from database)
- Partners page
- Updates/blog
- About page

3. **Connect to database**:
```javascript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)
```

4. **Deploy to Vercel**:
```bash
npm install -g vercel
vercel
```

### Step 5: Build the Dashboard (Week 2)

1. **Create dashboard app**:
```bash
cd apps
npx create-next-app@latest dashboard --typescript --tailwind --app
cd dashboard
npm install
```

2. **Add authentication**:
```bash
npm install @supabase/auth-helpers-nextjs
```

3. **Key dashboard views**:
- Main command center (all metrics at a glance)
- Milestone tracker (Phase 0 progress)
- Partnership pipeline (CRM-style)
- Document library
- Agent activity monitor
- Communications hub

4. **Protected routes**:
```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  await supabase.auth.getSession()
  return res
}
```

### Step 6: Build the Agent Swarm (Week 3-4)

1. **Complete Research Agent**:
- Implement web scraping
- Connect to news APIs
- Store results in database
- Generate daily briefings

2. **Build remaining agents**:
- Partnership Scout
- Document Engine  
- Financial Modeler
- Communications Manager
- Website Publisher

3. **Create orchestrator**:
```javascript
// orchestrator.js
const schedule = require('node-schedule');

// Research runs daily at 6 AM
schedule.scheduleJob('0 6 * * *', async () => {
  await ResearchAgent.run();
});

// Partnership Scout runs weekly
schedule.scheduleJob('0 9 * * 1', async () => {
  await PartnershipAgent.run();
});
```

4. **Deploy agents**:
- Can run on Vercel Edge Functions
- Or separate Node.js server
- Or Google Cloud Functions

## Phase 0 Workflow

Once everything is set up, here's your daily workflow:

### Morning (30 minutes)
1. Check dashboard for overnight agent activity
2. Review research briefing from Research Agent
3. Check partnership pipeline for follow-ups needed
4. Review any communications received

### Midday (2-3 hours) 
1. Execute high-priority human tasks:
   - Partnership calls/meetings
   - Document reviews and approvals
   - Strategic decisions
   - Advisor consultations

2. Use agents for grunt work:
   - "Agent, draft outreach to [partner name]"
   - "Agent, research [specific topic]"
   - "Agent, update financial model with [new assumptions]"

### Evening (30 minutes)
1. Review agent outputs from day
2. Approve website updates
3. Plan next day priorities
4. Update dashboard with progress

### Weekly (2-3 hours)
1. Review full Phase 0 progress
2. Update metrics and KPIs
3. Adjust agent priorities
4. Generate investor/partner updates

## Success Metrics

Track these weekly:

✅ **Phase 0 Progress**: % of milestones completed  
✅ **Partnerships**: Number in each pipeline stage  
✅ **Capital**: $ committed vs target  
✅ **Research**: Intelligence items gathered  
✅ **Communications**: Outreach sent, responses received  
✅ **Website**: Traffic and engagement  
✅ **Timeline**: On track vs delays  

## Getting Help

- Technical issues: Check `/docs/troubleshooting.md`
- Agent configuration: Check `/packages/agents/README.md`
- Database questions: Check `/packages/database/schema.sql` comments

## What You Should Do First

**Today:**
1. Read through the full database schema
2. Understand the agent architecture
3. Set up Supabase account and run schema

**This Week:**
1. Complete development environment setup
2. Get Gemini API key working
3. Build basic Next.js site (homepage only)

**Next 2 Weeks:**
1. Complete public website
2. Build dashboard MVP
3. Deploy first agent (Research)

**By End of Month:**
- Public website live
- Dashboard operational
- 2-3 agents running
- First real partnerships identified

## Remember

**You're not building this alone.**  
**The agents do the grunt work.**  
**You focus on vision, strategy, relationships.**  

**Build the tool that builds the dream.** 🛠️⚡🌍

---

*Project initialized: January 1, 2026*  
*Phase 0 begins: Day 1*
