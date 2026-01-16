# 🔧 GITHUB SECRETS CONFIGURATION REQUIRED

## Issue: Agents Failing in CI/CD

The Ubuntu Initiative agents are failing because required GitHub Secrets are not configured in the repository.

---

## ❌ Current Error

```
Error: supabaseUrl is required.
```

This occurs because the GitHub Actions workflow cannot access the Supabase and Gemini API credentials.

---

## ✅ SOLUTION: Configure GitHub Secrets

### Step 1: Navigate to Repository Settings

1. Go to: https://github.com/AhhVeeDaa/ubuntu-initiative
2. Click **Settings** (top right)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**

### Step 2: Add Required Secrets

You need to add **3 secrets**:

#### Secret 1: SUPABASE_URL
- **Name:** `SUPABASE_URL`
- **Value:** Your Supabase project URL
- **Format:** `https://[project-id].supabase.co`
- **Find it:** Supabase Dashboard → Project Settings → API → Project URL

#### Secret 2: SUPABASE_SERVICE_KEY
- **Name:** `SUPABASE_SERVICE_KEY`
- **Value:** Your Supabase service role key (secret key)
- **Format:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long string)
- **Find it:** Supabase Dashboard → Project Settings → API → service_role key
- **⚠️ IMPORTANT:** Use `service_role` key, NOT `anon` key (agents need write permissions)

#### Secret 3: GEMINI_API_KEY
- **Name:** `GEMINI_API_KEY`
- **Value:** Your Google Gemini API key
- **Format:** `AIzaSy...` (starts with AIzaSy)
- **Find it:** Google AI Studio → Get API Key → https://aistudio.google.com/apikey

---

## 📋 Quick Setup Checklist

- [ ] Go to GitHub repo Settings
- [ ] Navigate to Secrets and variables → Actions
- [ ] Add `SUPABASE_URL` secret
- [ ] Add `SUPABASE_SERVICE_KEY` secret
- [ ] Add `GEMINI_API_KEY` secret
- [ ] Test by triggering workflow manually

---

## 🧪 Testing After Setup

### Option 1: Wait for Scheduled Run
- Daily policy update runs at **06:00 UTC** every day
- Weekly insights run at **18:00 UTC** every Sunday

### Option 2: Trigger Manually (Recommended)
1. Go to **Actions** tab in GitHub
2. Click **Ubuntu Initiative Agents** workflow
3. Click **Run workflow** (right side)
4. Select automation to run:
   - `daily-policy-update`
   - `weekly-insights`
   - `all`
5. Click **Run workflow**
6. Watch the results in real-time

---

## 🔍 Verifying Secrets Are Set

After adding secrets, you should see them listed (values will be hidden):

```
SUPABASE_URL             ••••••••
SUPABASE_SERVICE_KEY     ••••••••
GEMINI_API_KEY           ••••••••
```

You **cannot view** secret values after creation (security feature).

---

## 🛠️ Code Changes Made

Updated `packages/agents/src/base-agent.js` to:
- ✅ Only load `.env` in local development (not CI/CD)
- ✅ Validate environment variables before use
- ✅ Provide clear error messages if secrets are missing
- ✅ Work seamlessly in both local and GitHub Actions environments

---

## 📖 GitHub Actions Workflow

The workflow at `.github/workflows/agents.yml` is already configured correctly:

```yaml
env:
  SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
  SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
  GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```

It just needs the secrets to exist in the repository.

---

## 🚀 Expected Result After Fix

Once secrets are configured, the agents will:

1. **Daily Policy Update** (06:00 UTC):
   - Monitor DRC policy sources
   - Track governance changes
   - Update policy dashboard
   - Queue significant changes for review

2. **Weekly Community Insights** (18:00 UTC Sunday):
   - Aggregate community activity
   - Generate insight reports
   - Surface trends for review
   - Update transparency metrics

All actions will be logged in the `agent_audit_log` table and visible in the dashboard.

---

## 🔐 Security Notes

- ✅ Secrets are encrypted by GitHub
- ✅ Secrets are not visible in logs
- ✅ Secrets are not accessible in pull requests from forks
- ✅ Service role key should only be used server-side (never in browser)

---

## 📞 Next Steps

1. **Configure the 3 GitHub Secrets** (see Step 2 above)
2. **Trigger a test run** manually from GitHub Actions
3. **Verify success** by checking the Actions tab
4. **Monitor dashboard** to see agent activity

Once secrets are added, commit this fix:

```bash
git add packages/agents/src/base-agent.js
git commit -m "Fix: Improve agent env variable handling for CI/CD"
git push
```

Then test by manually triggering the workflow.

---

**Status: Ready to configure secrets**
