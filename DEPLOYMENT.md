# 🚀 Deployment Checklist

Follow these steps to go live. We are using a **monorepo** structure, so the paths are specific.

## 🔁 Vercel — Deploy Public Website
1. Go to [vercel.com/new](https://vercel.com/new) and import your GitHub repo.
2. **Project Settings**:
   - **Project Name**: `ubuntu-initiative-web`
   - **Root Directory**: `apps/web` (⚠️ Important: must include `apps/`)
   - **Framework Preset**: Next.js
3. **Environment Variables**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
   STRIPE_SECRET_KEY=... (mark as sensitive)
   STRIPE_WEBHOOK_SECRET=...
   NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID=...
   NEXT_PUBLIC_STRIPE_PRICE_ID=...
   NEXT_PUBLIC_DASHBOARD_URL= (add this AFTER dashboard is deployed)
   ```
4. Click **Deploy**.

## 🔁 Vercel — Deploy Mission Control (Dashboard)
1. Import the same repo again as a **new project**.
2. **Project Settings**:
   - **Project Name**: `ubuntu-dashboard`
   - **Root Directory**: `apps/dashboard` (⚠️ Important: must include `apps/`)
3. **Environment Variables**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
4. Click **Deploy**.

## 🔐 Database Setup (Supabase SQL Editor)
Run these two scripts in order:
1. `apps/dashboard/lib/db-schema.sql` (Compute Nodes)
2. `apps/web/lib/contact-schema.sql` (Inquiry Tracking)

## ✅ Verification
1. Open your website.
2. Click **"Dashboard"** — it should open your deployed Vercel dashboard.
3. Submit a test inquiry on the **Contact** page.
4. Verify it appears in the **Dashboard -> Inquiries** list.

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
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID=prctbl_...
NEXT_PUBLIC_STRIPE_PRICE_ID=price_...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_DASHBOARD_URL=http://localhost:3001
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
