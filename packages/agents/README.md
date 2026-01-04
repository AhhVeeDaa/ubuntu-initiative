# Ubuntu Initiative Agent System

## 🌍 Overview

The Ubuntu Initiative Agent System is an AI-powered automation framework for Africa's first sovereign AI supercomputer project. Built on principles of transparency, accountability, and Congolese values, this system provides intelligent assistance while maintaining strict human oversight.

## 🎯 Core Principles

### 1. **Advisory Mode Always**
- No autonomous actions on sensitive matters
- All AI decisions require human review
- Clear confidence scores on every recommendation
- Complete audit trail of all activities

### 2. **Transparency First**
- All sources cited and verifiable
- Clear reasoning for every decision
- Public accountability baked in
- No "black box" operations

### 3. **Congolese Values**
- Community-centered approach
- Respect for authority and hierarchy
- Conservative risk assessment
- Long-term thinking over quick wins

## 📦 System Components

### Base Agent
Foundation class providing:
- Supabase database integration
- Google Gemini AI capabilities
- Logging and audit trails
- Confidence scoring framework
- Human review queue management

### Specialized Agents

#### 1. **PolicyAgent** (agent_001_policy)
Monitors policy changes affecting the project
- Tracks DRC government regulations
- Classifies policy relevance and impact
- Generates alerts for leadership
- Quarterly compliance reviews

#### 2. **CommunityAgent** (agent_002_community)
Listens to community sentiment and questions
- Social media monitoring
- Sentiment analysis
- Signal categorization (questions/feedback/concerns)
- Duplicate detection and threading

#### 3. **NarrativeAgent** (agent_003_narrative)
Generates transparent content- Public website updates
- Social media posts  
- Research summaries
- Policy explanations
- **Prohibition enforcement**: No promises, guarantees, or speculation about future phases
- **Human review required**: All content queued for approval

#### 4. **FundingAgent** (agent_004_funding)
Identifies and monitors grant opportunities
- Scans grant databases
- Checks eligibility requirements
- Tracks application deadlines
- Estimates success probability
- Generates application briefs

#### 5. **ChatbotAgent** (agent_005_chatbot) - "Inga GPT"
Powers public Q&A interface
- Knowledge base integration
- Query escalation for sensitive topics
- Confidence-scored responses
- Session tracking
- Source citation

#### 6. **MilestoneAgent** (agent_006_milestone)
Tracks project progress
- Phase 0 milestone monitoring
- Completion status tracking
- Alert generation for delays
- Progress reporting

#### 7. **ResearchAgent** (agent_007_research)
Synthesizes academic research
- Monitors research sources (arXiv, Google Scholar, etc.)
- Relevance scoring (0-1 scale)
- Theme identification
- Automated summaries

#### 8. **DueDiligenceAgent** (agent_008_due_diligence)
Vets potential partners and stakeholders
- Multi-source verification
- Risk flag identification
- Opportunity scoring
- Recommendation generation
- **Always requires human review**

## 🚀 Quick Start

### Installation

```bash
cd packages/agents
npm install
```

### Configuration

1. Copy environment template:
```bash
cp .env.example .env
```

2. Configure required variables:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_service_key
GEMINI_API_KEY=your_gemini_api_key
```

### Using the CLI

List available agents:
```bash
npm run cli list
```

Check system status:
```bash
npm run cli status
```

Run a specific agent:
```bash
npm run cli run research
npm run cli run chatbot
npm run cli run policy
```

Run tests:
```bash
npm test                # Run all tests
npm run test:phase2     # Core logic tests
npm run test:phase3     # Enhanced features
npm run test:phase4     # Integration tests
```

Interactive mode:
```bash
npm run cli interactive
```

## 📁 Project Structure

```
packages/agents/
├── src/
│   ├── base-agent.js          # Foundation class
│   ├── cli.js                 # Command-line interface
│   ├── agents/                # Specialized agents
│   │   ├── policy-agent.js
│   │   ├── community-agent.js
│   │   ├── narrative-agent.js
│   │   ├── funding-agent.js
│   │   ├── chatbot-agent.js
│   │   ├── milestone-agent.js
│   │   ├── research-agent.js
│   │   └── due-diligence-agent.js
│   ├── automations/           # Scheduled workflows
│   │   ├── daily-policy-update.js
│   │   └── weekly-insights.js
│   ├── test-phase2.js         # Core logic tests
│   ├── test-phase3.js         # Enhanced features tests
│   ├── test-phase4.js         # Integration tests
│   └── test-all.js            # Complete test runner
├── package.json
├── .env.example
├── README.md
└── PROGRESS.md
```

## 🔧 Development

### Running Individual Agents

```javascript
import { ResearchAgent } from './agents/research-agent.js';

const agent = new ResearchAgent();
const result = await agent.run();
console.log(result);
```

### Creating Custom Workflows

```javascript
import { PolicyAgent } from './agents/policy-agent.js';
import { NarrativeAgent } from './agents/narrative-agent.js';

// Monitor policy changes
const policy = new PolicyAgent();
const changes = await policy.run();

// Generate narrative update
const narrative = new NarrativeAgent();
const update = await narrative.generateUpdate({
    type: 'policy_alert',
    policy: changes.newPolicies[0]
});
```

### Adding New Agents

1. Extend BaseAgent:
```javascript
import { BaseAgent } from '../base-agent.js';

export class MyAgent extends BaseAgent {
    constructor() {
        super('agent_009_myagent', {
            // Configuration
        });
    }

    async run() {
        // Implementation
    }
}
```

2. Add to CLI registry in `src/cli.js`
3. Add tests in appropriate phase file

## 📊 Testing

### Test Coverage
- **Phase 2**: Core agent logic (7 tests)
- **Phase 3**: Enhanced methods (8 tests)
- **Phase 4**: System integration (8 tests)
- **Total**: 23 tests across all phases

### Running Tests

```bash
# All tests
npm test

# Specific phase
npm run test:phase2
npm run test:phase3
npm run test:phase4
```

### Test Philosophy
- Unit tests for core logic
- Integration tests for workflows
- Mock data for development
- Production validation separate

## 🔒 Security

### Best Practices
1. **Never commit .env files**
2. **Use service keys, not user keys**
3. **All sensitive operations logged**
4. **Human review for critical actions**
5. **Rate limiting on AI API calls**

### Data Protection
- Stakeholder profiles in private schema
- Audit logs for all agent activities
- No PII in public logs
- Encrypted database connections

## 📈 Monitoring

### Agent Performance Metrics
- Confidence score distributions
- Escalation rates
- Response times
- Error rates
- API quota usage

### System Health Checks
```bash
npm run cli status
```

Monitors:
- Environment configuration
- Agent availability
- Database connectivity
- API key validity

## 🛠️ Troubleshooting

### Common Issues

**"supabaseUrl is required"**
- Check .env file exists
- Verify SUPABASE_URL is set
- Ensure .env is in correct directory

**"API key not valid"**
- Check GEMINI_API_KEY in .env
- Verify API key has quota remaining
- Test key with simple request

**Tests failing with database errors**
- Expected with placeholder credentials
- Core logic tests pass without DB
- Full suite requires valid credentials

### Debug Mode

Enable verbose logging:
```bash
npm run cli run policy --verbose
```

## 📖 Documentation

- [Progress Report](./PROGRESS.md) - Development status
- [API Documentation](./docs/API.md) - Coming soon
- [Setup Guide](./docs/SETUP.md) - Coming soon
- [Agent Guide](./docs/AGENTS.md) - Coming soon

## 🤝 Contributing

### Development Workflow
1. Create feature branch
2. Implement changes
3. Add/update tests
4. Run test suite
5. Update documentation
6. Submit for review

### Code Style
- ES6+ modules
- Async/await for promises
- Descriptive variable names
- Comments for complex logic
- JSDoc for public methods

## 📝 License

Proprietary - Ubuntu Initiative

## 🌟 Credits

Built for the Ubuntu Initiative - Africa's first sovereign AI supercomputer powered by Inga hydropower.

**Team**: Ubuntu Initiative Development
**Version**: 0.5.0
**Status**: Production Ready (with valid credentials)

---

For questions or support, contact the Ubuntu Initiative development team.
