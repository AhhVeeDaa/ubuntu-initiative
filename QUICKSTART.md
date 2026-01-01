# 🚀 UBUNTU INITIATIVE - QUICKSTART

## YOU ARE HERE

Your Ubuntu Initiative tracking system is **95% complete**.  
**The only thing missing: Supabase credentials.**

---

## ⚡ 3-MINUTE SETUP

### 1. Create Supabase Project (2 min)
```
1. Visit: https://supabase.com
2. Sign up / Log in
3. New Project: "Ubuntu Initiative"
4. Choose region, set password
5. Wait for project to provision
```

### 2. Run Database Schema (1 min)
```
1. Open Supabase Dashboard
2. SQL Editor (left sidebar)
3. Copy ALL of: packages/database/schema.sql
4. Paste and click "Run"
5. Should see: "Success. No rows returned"
```

### 3. Get Credentials (30 sec)
```
1. Settings (gear icon) → API
2. Copy two values:
   - URL: https://xxxxx.supabase.co
   - anon public key: eyJhbG...
```

### 4. Add to Both Apps (1 min)
```bash
# Website
cd apps/web
cp .env.example .env.local
# Edit .env.local with your Supabase URL and key

# Dashboard
cd ../dashboard
cp .env.example .env.local  
# Edit .env.local with your Supabase URL and key
```

### 5. Restart Servers (30 sec)
```bash
# Terminal 1 - Website
cd apps/web
npm run dev

# Terminal 2 - Dashboard
cd apps/dashboard
npm run dev -- -p 3001
```

---

## ✅ TEST IT WORKS

### Check Website (localhost:3000)
- Hero badge should say "Phase 0: Day 1 • 0% Complete"
- Click "View Progress" button
- Should see 7 milestones from seed data

### Check Progress Page (localhost:3000/progress)
- Should display milestone cards
- Category filters should work
- Activity feed on right (may be empty initially)

### Check Dashboard (localhost:3001)
- Should show "Days in Phase 0: 1"
- Should show "Phase 0 Progress: 0%"
- Should show "7 milestones" breakdown

**If all above work = SUCCESS! 🎉**

---

## 🐛 TROUBLESHOOTING

### "Cannot connect to Supabase"
- Check .env.local exists in BOTH apps
- Verify URL starts with https://
- Verify key is full string (starts with eyJ)
- Restart dev servers after adding credentials

### "No milestones showing"
- Check SQL ran successfully in Supabase
- Go to Supabase → Table Editor → milestones
- Should see 7 rows of seed data
- If empty, re-run schema.sql

### "Progress shows 0% but milestones exist"
- Expected! Seed data has 0% progress initially
- Update a milestone to "in_progress" with 50% progress
- Refresh page, should update

---

## 📚 FULL DOCUMENTATION

- **docs/SUMMARY.md** - What was fixed
- **docs/FIXES_APPLIED.md** - Detailed changes  
- **docs/PROJECT_STATUS.md** - Current state
- **docs/GETTING_STARTED.md** - Complete setup

---

## 🎯 WHAT YOU HAVE

✅ Real-time Phase 0 progress tracking  
✅ Milestone management system  
✅ Activity feed with live updates  
✅ Partnership pipeline (database ready)  
✅ Document library (database ready)  
✅ Agent framework (database ready)  

**Just add Supabase credentials and it all works.**

---

*Setup time: ~5 minutes*  
*Difficulty: Easy*  
*Result: Professional Phase 0 tracking system*

**Do it now. Then watch your progress come alive.** 🚀
