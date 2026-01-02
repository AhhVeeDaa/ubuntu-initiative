# ✅ VERCEL DEPLOYMENT CHECKLIST

## 🎯 CURRENT STATUS

✅ GitHub repository created: https://github.com/AhhVeeDaa/ubuntu-initiative  
✅ Code pushed to GitHub  
✅ Vercel account created  
✅ Website project started: ubuntu-initiative-web  

---

## 📋 WHAT TO DO NOW IN VERCEL

### **WEBSITE (ubuntu-initiative-web) - Currently Open**

You're at: Settings → Environment Variables

**Add these 2 variables:**

1. **NEXT_PUBLIC_SUPABASE_URL**
   ```
   https://frforinozbawkikgiywe.supabase.co
   ```

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyZm9yaW5vemJhd2tpa2dpeXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNzM5NjAsImV4cCI6MjA4Mjg0OTk2MH0.HiosrsS_HsCHXy0GhFFJ_T63PM8OOQ9Yxp1JHRpMJd8
   ```

**For each variable:**
- Click "Add" or "New Variable"
- Enter name (e.g., NEXT_PUBLIC_SUPABASE_URL)
- Enter value
- Select: Production, Preview, Development (all 3)
- Click "Save"

**After adding both → Click "Redeploy" button**

---

### **DASHBOARD (Need to create)**

After website is deployed:

1. Go to: https://vercel.com/avida-s-projects
2. Click "Add New" → "Project"
3. Select "ubuntu-initiative" repository (same one)
4. **IMPORTANT:** Click "Edit" next to Root Directory
5. Change to: `apps/dashboard`
6. Click "Deploy"
7. Wait for it to build
8. Go to Settings → Environment Variables
9. Add the SAME 2 variables as above
10. Redeploy

---

## 🎯 VERIFICATION

### **After Website Deploys:**

Visit: https://ubuntu-initiative-web.vercel.app (or your assigned URL)

Check:
- [ ] Homepage loads
- [ ] Shows "Phase 0: Day X • Y% Complete"
- [ ] Click "View Progress" → shows milestones
- [ ] Activity feed works
- [ ] No console errors

### **After Dashboard Deploys:**

Visit: https://ubuntu-dashboard-*.vercel.app

Check:
- [ ] Loads without errors
- [ ] Shows "Days in Phase 0"
- [ ] Shows real stats from Supabase
- [ ] No console errors

---

## 🔄 IF BUILD FAILS

**Common issues:**

1. **"Root Directory not found"**
   - Make sure Root Directory is set to `apps/web` for website
   - Make sure Root Directory is set to `apps/dashboard` for dashboard

2. **"Build failed"**
   - Check build logs
   - Usually missing dependencies
   - Try redeploying

3. **"Environment variables not working"**
   - Must redeploy after adding env vars
   - Check spelling
   - Make sure selected for all environments

---

## 📱 AFTER BOTH ARE LIVE

### **Update Cross-Links:**

1. **In Website Project:**
   - Settings → Environment Variables
   - Add: `NEXT_PUBLIC_DASHBOARD_URL` = your dashboard URL
   - Save & Redeploy

2. **In Dashboard Project:**
   - Settings → Environment Variables  
   - Add: `NEXT_PUBLIC_SITE_URL` = your website URL
   - Save & Redeploy

---

## 🎉 DONE!

Your Ubuntu Initiative is LIVE on the web!

**Share it:**
- Twitter/X
- LinkedIn  
- Email to potential partners

**Next steps:**
1. Get custom domain (ubuntu-initiative.org)
2. Start logging activities in Supabase
3. Watch real-time updates!

---

*You're building in public. The world is watching.* 🌍⚡
