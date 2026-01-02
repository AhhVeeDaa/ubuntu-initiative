# 🚀 UBUNTU INITIATIVE - DEPLOYMENT GUIDE

## Your Code is Ready to Deploy!

Everything is committed to Git and ready to push to GitHub.

---

## 📋 DEPLOYMENT CHECKLIST

### Phase 1: GitHub (5 minutes)
- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Verify all files uploaded

### Phase 2: Vercel Deployment (10 minutes)
- [ ] Deploy website (public)
- [ ] Deploy dashboard (internal)
- [ ] Configure environment variables
- [ ] Test both sites

### Phase 3: Domain (Optional, 30 minutes)
- [ ] Register domain
- [ ] Configure DNS
- [ ] Add SSL

---

## 🎯 STEP-BY-STEP INSTRUCTIONS

### **Step 1: Create GitHub Repository**

**Option A: Via GitHub Website (Easiest)**

1. Go to: https://github.com/new
2. Repository name: `ubuntu-initiative`
3. Description: "Transparent Phase 0 tracking for Ubuntu Initiative - Building Africa's Sovereign AI"
4. Visibility: **Public** (for transparency) or **Private** (for now)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

**Option B: Via Command Line (If you have GitHub CLI)**

```bash
gh repo create ubuntu-initiative --public --source=. --remote=origin --push
```

---

### **Step 2: Push Code to GitHub**

After creating the repository on GitHub, you'll see commands like this:

```bash
cd /Users/ahhveedaa/ubuntu-initiative

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/ubuntu-initiative.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

Example:
```bash
git remote add origin https://github.com/avidabuyombo/ubuntu-initiative.git
git branch -M main
git push -u origin main
```

**You'll be prompted for credentials:**
- Username: your GitHub username
- Password: **Use Personal Access Token** (not your password!)

**Don't have a token?** Create one:
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo`, `workflow`
4. Copy the token (save it somewhere safe!)
5. Use this token as your password when pushing

---

### **Step 3: Deploy to Vercel**

**Why Vercel?**
- Free for Next.js apps
- Automatic deployments from GitHub
- Fast global CDN
- Easy environment variable management

#### **3A: Deploy Website (Public)**

1. Go to: https://vercel.com/signup
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import `ubuntu-initiative` repository
5. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/web`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
6. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://frforinozbawkikgiywe.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app
   NEXT_PUBLIC_DASHBOARD_URL=https://your-dashboard.vercel.app
   ```
7. Click "Deploy"

**Result:** Your website will be live at `https://ubuntu-initiative.vercel.app`

#### **3B: Deploy Dashboard (Internal)**

1. Back in Vercel dashboard
2. Click "Add New" → "Project"
3. Import `ubuntu-initiative` repository **again**
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/dashboard`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
5. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://frforinozbawkikgiywe.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
6. Click "Deploy"

**Result:** Dashboard live at `https://ubuntu-dashboard.vercel.app`

---

### **Step 4: Update Cross-Links**

After both are deployed, update the links:

1. **In Vercel (Website project):**
   - Settings → Environment Variables
   - Update `NEXT_PUBLIC_DASHBOARD_URL` to your actual dashboard URL
   - Redeploy

2. **In Vercel (Dashboard project):**
   - Settings → Environment Variables
   - Add `NEXT_PUBLIC_SITE_URL` to your actual website URL
   - Redeploy

---

### **Step 5: Test Everything**

**Website (Public):**
- [ ] Homepage loads
- [ ] Hero shows "Phase 0: Day X • Y% Complete"
- [ ] Progress page shows milestones from Supabase
- [ ] Activity feed works
- [ ] Support page loads
- [ ] All navigation works

**Dashboard (Internal):**
- [ ] Loads and shows Phase 0 stats
- [ ] Connects to Supabase
- [ ] Shows real milestone counts
- [ ] No errors in console

---

## 🌐 CUSTOM DOMAIN (Optional)

### **Recommended Domains:**
- `ubuntu-initiative.org` (Best - shows mission)
- `ubuntu-ai.org`
- `inga-ai.org`
- `africansovereignai.org`

### **How to Set Up:**

1. **Register domain:**
   - Namecheap: https://www.namecheap.com
   - Google Domains: https://domains.google.com
   - Cost: ~$12/year for .org

2. **In Vercel:**
   - Go to your website project
   - Settings → Domains
   - Add your domain
   - Follow DNS instructions

3. **In Domain Registrar:**
   - Add DNS records as shown by Vercel
   - Usually:
     - A record: `76.76.21.21`
     - CNAME: `cname.vercel-dns.com`

4. **Wait for propagation** (5-30 minutes)

5. **SSL automatically added** by Vercel

---

## 🔐 SECURITY CHECKLIST

- [ ] Environment variables set in Vercel (not in code)
- [ ] `.env.local` files in `.gitignore`
- [ ] Supabase RLS policies enabled
- [ ] Dashboard will need authentication (Phase 2)
- [ ] No sensitive keys in GitHub repository

---

## 📊 POST-DEPLOYMENT

### **Set Up Analytics (Optional)**

**Vercel Analytics (Free):**
1. Go to your project in Vercel
2. Analytics tab
3. Click "Enable"
4. Automatically tracks page views, speed, etc.

**Plausible (Privacy-focused, $9/mo):**
1. Sign up: https://plausible.io
2. Add site
3. Add script tag to `app/layout.tsx`

### **Set Up Monitoring**

**Sentry (Error tracking, free tier):**
```bash
cd apps/web
npx @sentry/wizard@latest -i nextjs
```

---

## 🎉 YOU'RE LIVE!

After deployment:

1. **Announce on social media:**
   - Twitter/X
   - LinkedIn
   - African tech communities

2. **Share the vision:**
   - "Building Africa's first sovereign AI supercomputer"
   - "Transparent from day 1"
   - Link to your progress page

3. **Start logging activities:**
   - Every milestone completed
   - Every partner conversation
   - Every document created
   - Public sees it in real-time!

---

## 🔄 CONTINUOUS DEPLOYMENT

**Every time you push to GitHub:**
1. Vercel automatically detects changes
2. Runs build
3. Deploys new version
4. Takes 2-3 minutes

**To update:**
```bash
cd /Users/ahhveedaa/ubuntu-initiative

# Make changes to your code

# Commit
git add .
git commit -m "Updated [what you changed]"
git push

# Vercel auto-deploys!
```

---

## 🆘 TROUBLESHOOTING

### "Build failed on Vercel"
- Check build logs in Vercel dashboard
- Usually missing dependencies
- Make sure `package.json` has all packages

### "Environment variables not working"
- Must redeploy after adding env vars
- Check spelling and capitalization
- Include `NEXT_PUBLIC_` prefix for client-side vars

### "Can't push to GitHub"
- Use Personal Access Token, not password
- Create at: https://github.com/settings/tokens
- Select `repo` and `workflow` scopes

### "Domain not working"
- DNS propagation takes time (up to 24 hours)
- Check DNS settings in registrar
- Verify Vercel domain configuration

---

## 📞 NEXT STEPS

1. **Push to GitHub NOW**
2. **Deploy to Vercel**
3. **Test everything**
4. **Get custom domain**
5. **Go public!**

---

*Your Ubuntu Initiative is ready for the world.*  
*Time to make history.* 🌍⚡

**Commands to run RIGHT NOW:**

```bash
cd /Users/ahhveedaa/ubuntu-initiative

# Check git status
git status

# Set your GitHub username here:
git remote add origin https://github.com/YOUR_USERNAME/ubuntu-initiative.git

# Push
git push -u origin main
```

**Then go to Vercel and deploy!** 🚀
