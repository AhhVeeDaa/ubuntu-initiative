# Ubuntu Initiative Agent System

Multi-agent automation system for transparent governance and milestone tracking.

## Phase 2 Status: ✅ 5/8 Agents Deployed

### Deployed Agents
1. ✅ **Funding Agent** - Real-time donation processing, fraud detection
2. ✅ **Milestone Agent** - Evidence-based milestone validation  
3. ✅ **Policy Agent** - Policy tracking with relevance scoring
4. ✅ **Community Agent** - Sentiment analysis and insights
5. ✅ **Narrative Agent** - Content generation (advisory mode)

### Coming Soon
6. 🚧 **Research Synthesis Agent** - Academic paper curation
7. 🚧 **Chatbot Agent** (Inga GPT) - Enhanced Q&A
8. 🚧 **Due Diligence Agent** - Stakeholder vetting

## Automations

### Active
- ✅ **Daily Policy Update** (06:00 UTC) - Scans policy sources, auto-publishes routine updates
- ✅ **Weekly Community Insights** (Sunday 18:00 UTC) - Sentiment analysis report

### Planned
- Weekly funding opportunities digest
- Milestone completion announcements
- Monthly transparency report
- Real-time donation counter updates

## Quick Start

### 1. Install Dependencies
```bash
cd packages/agents
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Test Agents
```bash
# Test all agents
npm run test:phase2

# Test individual agents
node src/cli.js test:policy
node src/cli.js test:community
node src/cli.js test:narrative
```

### 4. Run Automations Locally
```bash
# Daily policy update
node src/automations/daily-policy-update.js

# Weekly community insights
node src/automations/weekly-insights.js
```

## Testing

```bash
# Phase 1 agents (Funding, Milestone)
npm test

# Phase 2 agents (Policy, Community, Narrative)
node src/test-phase2.js

# All tests
npm test && node src/test-phase2.js
```

**Current Status**: 12/12 tests passing ✅

## Deployment

### GitHub Actions (Recommended)
Automations run on schedule via `.github/workflows/agents.yml`

**Manual Trigger**:
1. Go to Actions tab in GitHub
2. Select "Ubuntu Initiative Agents"
3. Click "Run workflow"
4. Choose automation to run

### Required Secrets
Configure in GitHub Settings > Secrets:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `GEMINI_API_KEY`

### Vercel Serverless (Alternative)
Deploy as API routes for webhook triggers.

## Agent Details

### Policy Agent
**Purpose**: Monitor policy changes affecting hydropower, AI sovereignty, infrastructure

**Features**:
- Keyword-based relevance scoring (0-1)
- Auto-publish if relevance <0.8
- High-impact detection and review queue
- Category classification (energy, infrastructure, governance, etc.)

**Test**: `node src/cli.js test:policy`

### Community Agent
**Purpose**: Analyze community sentiment across platforms

**Features**:
- Sentiment analysis (-1 to 1 scale)
- Category classification (funding, progress, question, concern)
- Weekly insights report generation
- Alert on negative trends
- Complete anonymization

**Test**: `node src/cli.js test:community`

### Narrative Agent
**Purpose**: Generate consistent, culturally-aware messaging

**Features**:
- AI-powered content generation
- Prohibited terms detection (future phases, promises)
- Superlative validation (requires data support)
- Evidence link verification
- 100% human approval required (advisory mode)

**Test**: `node src/cli.js test:narrative`

## Safety Features

### Confidence Gating
- >0.9 - Auto-publish
- 0.7-0.9 - Human review (medium priority)
- <0.7 - Reject or urgent review

### Audit Trail
Every action logged with:
- Input/output data
- Confidence score
- Reasoning text
- Timestamp

### Human Oversight
- Approval queue for uncertain outputs
- Priority levels (low, medium, high, urgent)
- Feedback loop for continuous improvement

## Architecture

```
packages/agents/
├── src/
│   ├── agents/
│   │   ├── funding-agent.js       (Phase 1)
│   │   ├── milestone-agent.js     (Phase 1)
│   │   ├── policy-agent.js        (Phase 2)
│   │   ├── community-agent.js     (Phase 2)
│   │   └── narrative-agent.js     (Phase 2)
│   ├── automations/
│   │   ├── daily-policy-update.js
│   │   └── weekly-insights.js
│   ├── base-agent.js
│   ├── cli.js
│   ├── test.js                    (Phase 1 tests)
│   └── test-phase2.js             (Phase 2 tests)
└── package.json
```

## Usage Examples

### Generate Policy Insights
```javascript
import { PolicyAgent } from './agents/policy-agent.js';

const agent = new PolicyAgent();
const results = await agent.run();
// Processes policies, calculates relevance, queues high-impact items
```

### Analyze Community Sentiment
```javascript
import { CommunityAgent } from './agents/community-agent.js';

const agent = new CommunityAgent();
const insights = await agent.generateWeeklyInsights();
// Returns: avg_sentiment, trend, top_category, alerts
```

### Generate Milestone Announcement
```javascript
import { NarrativeAgent } from './agents/narrative-agent.js';

const agent = new NarrativeAgent();
const result = await agent.generateMilestoneAnnouncement(milestone);
// Creates draft, validates content, queues for approval
```

## Performance

- **Funding Agent**: <100ms (real-time webhook)
- **Milestone Agent**: <200ms (validation + DB write)
- **Policy Agent**: ~2-5s (fetch + process multiple sources)
- **Community Agent**: ~1-3s (analyze signals + generate insights)
- **Narrative Agent**: ~3-5s (AI generation + validation)

## Monitoring

### Dashboard
View at `/dashboard` (requires auth):
- Agent activity logs
- Approval queue
- Milestone statistics
- Real-time updates

### Database Queries
```sql
-- Recent agent activity
SELECT * FROM private.agent_audit_log 
ORDER BY timestamp DESC LIMIT 20;

-- Approval queue status
SELECT item_type, status, COUNT(*) 
FROM private.approval_queue 
GROUP BY item_type, status;

-- Policy relevance distribution
SELECT 
  ROUND(relevance_score, 1) as score,
  COUNT(*) 
FROM public.policy_events 
GROUP BY score 
ORDER BY score DESC;
```

## Development

### Adding a New Agent

1. Create agent file in `src/agents/`
2. Extend `BaseAgent` class
3. Implement `run()` method
4. Add tests to `test-phase2.js`
5. Update CLI with new commands

Example:
```javascript
import { BaseAgent } from '../base-agent.js';

export class MyAgent extends BaseAgent {
    constructor() {
        super('agent_xxx_name', { /* config */ });
    }

    async run() {
        // Your logic here
    }
}
```

### Creating an Automation

1. Create file in `src/automations/`
2. Import relevant agents
3. Implement main function
4. Add to GitHub Actions workflow

## Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit pull request

## Documentation

- **DEPLOYMENT_GUIDE.md** - Complete deployment walkthrough
- **Architecture JSON** - Full system design in artifacts
- **API Reference** - See base-agent.js JSDoc comments

## License

MIT

---

**Status**: Phase 2 Complete - 5/8 Agents + 2/12 Automations  
**Tests**: 12/12 passing ✅  
**Next**: Research Synthesis + Chatbot Enhancement + Remaining Automations
