# 🚀 DEPLOY UBUNTU INITIATIVE - DO THIS NOW

## ✅ YOUR CODE IS READY

Everything is committed and ready to go live!

---

## 📋 3-STEP DEPLOYMENT (20 Minutes Total)

### **STEP 1: GitHub (5 min)**

1. Go to: **https://github.com/new**

2. Fill in:
   - Repository name: `ubuntu-initiative`
   - Description: "Building Africa's Sovereign AI - Transparent Phase 0 Tracking"
   - Make it **Public** (transparency!) or Private for now
   - **DON'T** check any boxes (README, .gitignore, etc.)

3. Click **"Create repository"**

4. **Copy the commands** shown (they'll look like this):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ubuntu-initiative.git
   git branch -M main
   git push -u origin main
   ```

5. **Run them** in your terminal:
   ```bash
   cd /Users/ahhveedaa/ubuntu-initiative
   git remote add origin https://github.com/YOUR_USERNAME/ubuntu-initiative.git
   git push -u origin main
   ```

6. **When asked for password:** Use a **Personal Access Token**
   - Get one here: https://github.com/settings/tokens/new
   - Check: `repo` and `workflow`
   - Copy the token
   - Paste it as your password

✅ **Your code is now on GitHub!**

---

### **STEP 2: Deploy Website to Vercel (5 min)**

1. Go to: **https://vercel.com/signup**
2. Sign up with **GitHub**
3. Click **"Add New" → "Project"**
4. Select **ubuntu-initiative** repository
5. Configure:
   - Framework Preset: **Next.js** ✅
   - Root Directory: **`apps/web`** ← IMPORTANT!
   - Build Command: (leave default)
6. Click **"Environment Variables"**
7. Add these:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   https://frforinozbawkikgiywe.supabase.co

   NEXT_PUBLIC_SUPABASE_ANON_KEY
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyZm9yaW5vemJhd2tpa2dpeXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNzM5NjAsImV4cCI6MjA4Mjg0OTk2MH0.HiosrsS_HsCHXy0GhFFJ_T63PM8OOQ9Yxp1JHRpMJd8
   ```
8. Click **"Deploy"**

⏱️ **Wait 2-3 minutes...**

✅ **Your website is LIVE!** (URL: `https://ubuntu-initiative.vercel.app`)

---

### **STEP 3: Deploy Dashboard to Vercel (5 min)**

1. Still in Vercel
2. Click **"Add New" → "Project"** again
3. Select **ubuntu-initiative** repository again
4. Configure:
   - Framework Preset: **Next.js** ✅
   - Root Directory: **`apps/dashboard`** ← DIFFERENT!
   - Build Command: (leave default)
5. Add **same environment variables**
6. Click **"Deploy"**

⏱️ **Wait 2-3 minutes...**

✅ **Your dashboard is LIVE!** (URL: `https://ubuntu-dashboard.vercel.app`)

---

## 🎉 YOU'RE LIVE!

**Website:** `https://ubuntu-initiative.vercel.app`  
**Dashboard:** `https://ubuntu-dashboard.vercel.app`

---

## ✅ TEST IT

Visit your website and check:
- [ ] Homepage loads
- [ ] Shows "Phase 0: Day 1 • X% Complete"
- [ ] Click "View Progress" - shows milestones
- [ ] Activity feed works
- [ ] Support page loads

---

## 🌐 OPTIONAL: Custom Domain (Later)

When ready:
1. Buy domain: `ubuntu-initiative.org` (~$12/year)
2. In Vercel → Settings → Domains
3. Add your domain
4. Update DNS records
5. Done!

---

## 📱 SHARE IT

**Your Phase 0 tracking is now live!**

Tweet:
> 🌍 Building Africa's first sovereign AI supercomputer
> 
> Powered by Inga Falls hydropower
> Transparent from day 1
> 
> Track our progress: [your-url]
> 
> #AfricanAI #Ubuntu #BuildInPublic

---

## 🔄 FUTURE UPDATES

Every time you want to update the site:

```bash
cd /Users/ahhveedaa/ubuntu-initiative

# Make your changes

git add .
git commit -m "Your update message"
git push

# Vercel auto-deploys in 2-3 minutes!
```

---

## 🆘 NEED HELP?

- Full guide: `docs/DEPLOYMENT.md`
- Vercel docs: https://vercel.com/docs
- GitHub help: https://docs.github.com

---

**GO DO IT NOW!** 🚀

**Step 1:** Create GitHub repo  
**Step 2:** Push code  
**Step 3:** Deploy to Vercel (twice - website + dashboard)  
**Step 4:** CELEBRATE! 🎉

**Total time: 20 minutes**

*Your transparent Phase 0 journey begins NOW.* ⚡🌍
