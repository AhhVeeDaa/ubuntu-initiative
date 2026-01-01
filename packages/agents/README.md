# Ubuntu Initiative Agent Swarm

This directory contains the agentic AI framework integrating with Google Antigravity.

## Agent Architecture

```
Agent Swarm
├── orchestrator.js       # Main orchestration layer
├── agents/
│   ├── research.js       # Research Intelligence Agent
│   ├── partnerships.js   # Partnership Scout Agent
│   ├── documents.js      # Document Engine Agent
│   ├── financials.js     # Financial Modeler Agent
│   ├── communications.js # Communications Manager Agent
│   └── publisher.js      # Website Publisher Agent
├── tools/
│   ├── web-scraping.js   # Web scraping utilities
│   ├── email.js          # Email integration
│   ├── calendar.js       # Calendar management
│   └── documents.js      # Document generation
└── config/
    └── agents.json       # Agent configuration
```

## Agent Definitions

### Research Intelligence Agent
**Purpose**: Monitor and analyze information about Inga, DRC, African energy, AI trends  
**Inputs**: Search queries, RSS feeds, news sources  
**Outputs**: Intelligence briefings, risk alerts, opportunity identification  
**Schedule**: Runs daily at 6 AM UTC

### Partnership Scout Agent  
**Purpose**: Identify and qualify potential partners  
**Inputs**: Partner criteria, industry databases  
**Outputs**: Partner profiles, outreach recommendations  
**Schedule**: Runs weekly on Mondays

### Document Engine Agent
**Purpose**: Draft and refine documents  
**Inputs**: Templates, data, requirements  
**Outputs**: MOUs, pitch decks, studies, reports  
**Schedule**: On-demand

### Financial Modeler Agent
**Purpose**: Build and maintain financial projections  
**Inputs**: Assumptions, market data, scenarios  
**Outputs**: Financial models, investor materials  
**Schedule**: Updates weekly

### Communications Manager Agent
**Purpose**: Draft and track outreach  
**Inputs**: Partner info, templates, context  
**Outputs**: Emails, follow-ups, meeting summaries  
**Schedule**: On-demand + daily follow-up checks

### Website Publisher Agent
**Purpose**: Update public website with curated progress  
**Inputs**: Dashboard activities, approved updates  
**Outputs**: Website content updates  
**Schedule**: Daily at 9 AM UTC

## Setup

1. Install dependencies:
```bash
npm install @google/generative-ai
```

2. Configure Google Antigravity:
```bash
export GOOGLE_AI_API_KEY="your-key-here"
```

3. Test agents:
```bash
node orchestrator.js --test
```

## Usage

```javascript
const { ResearchAgent } = require('./agents/research');

const agent = new ResearchAgent();
await agent.run({
  topic: 'inga dam updates',
  sources: ['news', 'government', 'academic']
});
```

## Integration with Dashboard

Agents write outputs to the database tables:
- `research` table for intelligence gathered
- `agent_tasks` table for task tracking
- `activities` table for activity logging
- `documents` table for generated content

Dashboard displays agent outputs in real-time.
