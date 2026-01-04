# 🚀 DEPLOY NOW - 3 Easy Steps

Your Supabase Project: **fohifgmbuewmjybdtidk**

---

## Step 1: Run Deployment Script (2 minutes)

```bash
cd /Users/ahhveedaa/ubuntu-initiative/packages/agents
npm run deploy
```

This will:
1. Ask for your service role key
2. Configure the environment
3. Test the connection

---

## Step 2: Set Up Database (2 minutes)

### Option A - Run Schema in Supabase (Recommended)

1. **Open SQL Editor:**
   ```
   https://supabase.com/dashboard/project/fohifgmbuewmjybdtidk/sql/new
   ```

2. **Copy schema.sql:**
   ```bash
   cat schema.sql
   ```
   Copy the entire output

3. **Paste in SQL Editor** and click **"Run"**

4. **Verify tables created:**
   ```
   https://supabase.com/dashboard/project/fohifgmbuewmjybdtidk/editor
   ```
   You should see 10 new tables

### Option B - Automated (if you prefer)

```bash
npm run setup:database
```

---

## Step 3: Test Your System! (30 seconds)

```bash
# Check status
npm run cli status

# Should show all ✓ green checks:
# ✓ SUPABASE_URL: Configured
# ✓ SUPABASE_SERVICE_KEY: Configured  
# ✓ GEMINI_API_KEY: Configured
# ✓ 8/8 agents ready
```

---

## 🎉 You're Live! Now Run an Agent

```bash
# Run research agent
npm run cli run research

# Or interactive mode
npm run cli interactive

# List all agents
npm run cli list
```

---

## 📍 Important Links for Your Project

- **Dashboard:** https://supabase.com/dashboard/project/fohifgmbuewmjybdtidk
- **API Settings:** https://supabase.com/dashboard/project/fohifgmbuewmjybdtidk/settings/api
- **SQL Editor:** https://supabase.com/dashboard/project/fohifgmbuewmjybdtidk/sql/new
- **Table Editor:** https://supabase.com/dashboard/project/fohifgmbuewmjybdtidk/editor

---

## 🔑 Where to Get Service Role Key

1. Go to: https://supabase.com/dashboard/project/fohifgmbuewmjybdtidk/settings/api
2. Find **"Project API keys"** section
3. Copy the **"service_role"** key (NOT the anon key)
4. It's a long JWT token starting with `eyJ...`

---

## ✅ Success Checklist

After deployment, verify:

- [ ] `npm run cli status` shows all green ✓
- [ ] 10 tables visible in Supabase Table Editor
- [ ] `agent_logs` table exists and is empty
- [ ] `knowledge_base` has 3 sample entries
- [ ] `milestones` has 4 Phase 0 entries
- [ ] `npm run cli run research` completes successfully
- [ ] New log appears in `agent_logs` table

---

## 🆘 Troubleshooting

### "Service key required"
Get from: https://supabase.com/dashboard/project/fohifgmbuewmjybdtidk/settings/api

### "Table does not exist"
Run the schema in SQL Editor (Step 2 above)

### "Connection failed"
- Check service key is correct (not anon key)
- Verify project is active in Supabase dashboard

---

## 🎯 What Happens Next

Once deployed, your agents will:

✅ Monitor DRC policy changes (PolicyAgent)
✅ Track community sentiment (CommunityAgent)  
✅ Generate transparent content (NarrativeAgent)
✅ Find grant opportunities (FundingAgent)
✅ Answer public questions (ChatbotAgent - Inga GPT)
✅ Track project milestones (MilestoneAgent)
✅ Synthesize research papers (ResearchAgent)
✅ Vet potential partners (DueDiligenceAgent)

All with human oversight and complete audit trails!

---

## 🚀 Ready? Let's Go!

**Run this now:**

```bash
cd /Users/ahhveedaa/ubuntu-initiative/packages/agents
npm run deploy
```

**That's it!** Your agent system will be live in 5 minutes! 🎉

---

*Built for Africa's AI future* 🌍
