# Deployment Guide

## Deploying to Vercel

### Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)
- Both applications pushed to GitHub

### Step 1: Deploy the Public Website

1. Go to https://vercel.com/new
2. Import your repository
3. Select `apps/web` as the root directory
4. Add environment variables:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NEXT_PUBLIC_DASHBOARD_URL=https://your-dashboard.vercel.app
   ```
5. Click "Deploy"

### Step 2: Deploy the Dashboard

1. Create a new project in Vercel
2. Import the same repository
3. Select `apps/dashboard` as the root directory
4. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```
5. Click "Deploy"

### Step 3: Update Environment Variables

After the Dashboard is deployed:

1. Copy the Dashboard production URL (e.g., `https://ubuntu-dashboard.vercel.app`)
2. Go to your **Public Website** project settings in Vercel
3. Update `NEXT_PUBLIC_DASHBOARD_URL` to the Dashboard production URL
4. Redeploy the website

### Step 4: Database Setup

Run the following SQL scripts in your Supabase SQL Editor:

1. **Nodes table**: `apps/dashboard/lib/db-schema.sql`
2. **Contacts table**: `apps/web/lib/contact-schema.sql`

### Verification

- Visit your public website URL
- Click "Open Dashboard" button - should open the production dashboard
- Test Contact form submission
- Check Dashboard `/contacts` page for the submission

## Local Development

To run locally:

```bash
# From project root
npm run dev
```

This will start:
- Public Website: http://localhost:3000
- Dashboard: http://localhost:3001

## Environment Variables Summary

### Public Website (apps/web/.env.local)
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_DASHBOARD_URL=http://localhost:3001  # or production URL
```

### Dashboard (apps/dashboard/.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Troubleshooting

**Dashboard link doesn't work in production:**
- Verify `NEXT_PUBLIC_DASHBOARD_URL` is set correctly in Vercel
- Redeploy after changing environment variables

**Contact form not saving:**
- Check Supabase connection
- Verify `contacts` table exists
- Check browser console for errors

**Nodes page shows "No Nodes Online":**
- Run the SQL seed script in Supabase
- Verify Supabase environment variables are correct
