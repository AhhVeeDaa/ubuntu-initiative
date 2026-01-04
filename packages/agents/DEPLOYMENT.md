# 🚀 Production Deployment Guide

## Quick Start - 3 Easy Steps

### Step 1: Get Your Supabase Service Role Key

1. Go to your Supabase project dashboard:
   ```
   https://supabase.com/dashboard/project/fohifgmbuewmjybdtidk/settings/api
   ```

2. Find the **"service_role" key** under "Project API keys"
   - It's a long JWT token starting with `eyJ...`
   - **Keep this secret!** Never commit to git

3. Copy the key - you'll need it in Step 2

### Step 2: Configure Environment

Edit the `.env` file:

```bash
cd /Users/ahhveedaa/ubuntu-initiative/packages/agents
nano .env
```

Replace `NEED_SERVICE_ROLE_KEY` with your actual service role key:

```env
SUPABASE_SERVICE_KEY=eyJhbGc...your-actual-key-here
```

Save and exit (Ctrl+O, Enter, Ctrl+X)

### Step 3: Set Up Database

#### Option A: Automatic Setup (Recommended)

```bash
npm run setup:database
```

#### Option B: Manual Setup (If Option A fails)

1. Go to Supabase SQL Editor:
   ```
   https://supabase.com/dashboard/project/fohifgmbuewmjybdtidk/sql/new
   ```

2. Copy the entire contents of `schema.sql`

3. Paste into the SQL Editor

4. Click "Run" button

5. Wait for confirmation message

### Step 4: Verify Setup

Test the system:

```bash
npm run cli status
```

You should see:
```
✅ System is healthy
Environment Variables:
  SUPABASE_URL: ✓ Configured
  SUPABASE_SERVICE_KEY: ✓ Configured
  GEMINI_API_KEY: ✓ Configured
```

### Step 5: Run Your First Agent!

```bash
# Run research agent
npm run cli run research

# Or use interactive mode
npm run cli interactive
```

---

## Detailed Deployment Steps

### Prerequisites Checklist

- [x] Node.js 18+ installed
- [x] Supabase project created (`fohifgmbuewmjybdtidk`)
- [x] Google Gemini API key (`AIzaSyA...`)
- [ ] Supabase service role key (get from dashboard)

### Environment Configuration

Your `.env` file should look like this:

```env
# Supabase Configuration
SUPABASE_URL=https://fohifgmbuewmjybdtidk.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # Your actual key

# AI Configuration  
GEMINI_API_KEY=AIzaSyA_bAP956JwrF1pvDmRVNednigilCTuT44

# Payment Configuration
STRIPE_SECRET_KEY=sk_test_51HDarFBkp2utrOiWzFCwpFIwEkjFdrl0JRyuIpg5J0lguNfv8rSj6I4AAH1eaYoIULq9ZWs6KjRrneCFXd6yjrNQ0071g2aBWJ

# Agent Configuration
AUTO_APPROVE_THRESHOLD=0.9
FRAUD_AMOUNT_THRESHOLD=10000

# Environment
NODE_ENV=production
```

### Database Schema

The schema creates these tables:

**Public Tables:**
- `agent_logs` - Complete audit trail
- `knowledge_base` - Chatbot Q&A pairs
- `chat_logs` - Conversation history
- `review_queue` - Items needing human review
- `policy_changes` - Regulatory tracking
- `community_signals` - Social media monitoring
- `research_papers` - Academic papers
- `funding_opportunities` - Grant opportunities
- `milestones` - Project progress

**Private Schema:**
- `stakeholder_profiles` - Sensitive due diligence data

### Testing Your Deployment

#### 1. Check System Status
```bash
npm run cli status
```

Expected output:
- All environment variables configured
- 8/8 agents ready

#### 2. List Available Agents
```bash
npm run cli list
```

Should show all 8 agents:
- Policy Monitor
- Community Listener
- Content Generator
- Grant Finder
- Inga GPT
- Progress Tracker
- Research Synthesizer
- Stakeholder Vetter

#### 3. Run a Test Agent
```bash
npm run cli run research
```

This will:
- Initialize the research agent
- Connect to Supabase
- Scan for research papers (mock data)
- Log results to database
- Display summary

#### 4. Check Supabase Dashboard

Go to Table Editor:
```
https://supabase.com/dashboard/project/fohifgmbuewmjybdtidk/editor
```

You should see:
- New entries in `agent_logs` table
- Initial data in `knowledge_base`
- Phase 0 milestones in `milestones` table

---

## Common Issues & Solutions

### Issue: "supabaseUrl is required"

**Solution:**
Check your `.env` file exists and has valid URL:
```bash
cat .env | grep SUPABASE_URL
```

### Issue: "API key not valid"

**Solution:**
Verify your Gemini API key is active:
```bash
cat .env | grep GEMINI_API_KEY
```

Test it at: https://aistudio.google.com/apikey

### Issue: Database connection fails

**Solution:**
1. Check service role key is correct (not anon key)
2. Verify Supabase project is active
3. Try manual schema setup (Option B above)

### Issue: "Table does not exist"

**Solution:**
Run the schema setup:
```bash
npm run setup:database
```

Or apply manually in Supabase SQL Editor.

---

## Production Checklist

Before going live:

- [ ] Service role key configured in `.env`
- [ ] Database schema applied successfully
- [ ] All agents tested individually
- [ ] System status shows "healthy"
- [ ] Supabase tables visible in dashboard
- [ ] Sample data loaded correctly
- [ ] Audit logging working
- [ ] Review queue functional

---

## Next Steps After Deployment

### 1. Set Up Automation

Schedule agents to run automatically:

```bash
# Example cron jobs
0 9 * * * cd /path/to/agents && npm run cli run policy      # Daily 9am
0 */6 * * * cd /path/to/agents && npm run cli run research  # Every 6 hours
0 0 * * 1 cd /path/to/agents && npm run cli run funding     # Weekly Monday
```

### 2. Configure Monitoring

- Set up Supabase alerts for errors
- Monitor API quota usage (Gemini)
- Track agent performance metrics
- Review audit logs regularly

### 3. Human Review Process

Set up a process for the review queue:

1. Check review items: Query `review_queue` table
2. Evaluate flagged content
3. Approve or reject items
4. Document decisions

### 4. Backup Strategy

- Enable Supabase daily backups
- Export important data regularly
- Version control `.env` template
- Document custom configurations

---

## Security Best Practices

✅ **DO:**
- Keep service role key secret
- Use environment variables
- Enable Row Level Security
- Review audit logs regularly
- Monitor for suspicious activity

❌ **DON'T:**
- Commit `.env` to git
- Share service keys publicly
- Use anon key for agents
- Skip human review steps
- Ignore security alerts

---

## Getting Help

If you encounter issues:

1. **Check logs:**
   ```bash
   npm run cli run <agent> --verbose
   ```

2. **Review documentation:**
   - README.md - Full usage guide
   - PROGRESS.md - Development history
   - COMPLETE.md - Feature summary

3. **Test individual components:**
   ```bash
   npm run test:phase2
   npm run test:phase3
   npm run test:phase4
   ```

4. **Verify environment:**
   ```bash
   npm run cli status
   ```

---

## Quick Reference

### Essential Commands

```bash
# Setup
npm run deploy                 # Full guided setup
npm run setup:database         # Database only

# Operations
npm run cli list               # List agents
npm run cli status             # System health
npm run cli run <agent>        # Run specific agent
npm run cli interactive        # Interactive mode

# Testing
npm test                       # Full test suite
npm run test:phase2            # Core logic tests
npm run test:phase3            # Enhanced features
npm run test:phase4            # Integration tests
```

### Useful Links

- **Supabase Dashboard:** https://supabase.com/dashboard/project/fohifgmbuewmjybdtidk
- **Table Editor:** https://supabase.com/dashboard/project/fohifgmbuewmjybdtidk/editor
- **SQL Editor:** https://supabase.com/dashboard/project/fohifgmbuewmjybdtidk/sql
- **API Settings:** https://supabase.com/dashboard/project/fohifgmbuewmjybdtidk/settings/api
- **Gemini API:** https://aistudio.google.com/apikey

---

## Success! 🎉

Once deployed, your agent system will:

✅ Monitor policy changes automatically
✅ Listen to community sentiment
✅ Generate transparent content
✅ Find relevant grant opportunities
✅ Answer public questions via Inga GPT
✅ Track project milestones
✅ Synthesize academic research
✅ Vet potential stakeholders

All with human oversight and complete audit trails!

**Ready to change Africa's AI future!** 🌍🚀
