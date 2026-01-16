# 🗄️ APPLY DATABASE MIGRATIONS TO SUPABASE

## Issue: policy_events table not found

The agents are failing because the database schema hasn't been fully applied to your Supabase instance.

```
Could not find the table 'public.policy_events' in the schema cache
```

---

## ✅ SOLUTION: Apply Missing Migrations

### Option 1: Apply via Supabase Dashboard (Easiest)

1. **Go to Supabase SQL Editor:**
   - Navigate to: https://supabase.com/dashboard/project/[your-project-id]/sql
   - Or: Supabase Dashboard → SQL Editor

2. **Run the Initial Schema Migration:**

```sql
-- Copy and paste the entire contents of:
-- supabase/migrations/001_initial_schema.sql

-- The key table we need:
CREATE TABLE IF NOT EXISTS public.policy_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    source TEXT NOT NULL,
    source_url TEXT,
    publication_date DATE NOT NULL,
    summary TEXT,
    impact_category TEXT NOT NULL,
    relevance_score NUMERIC(3,2) CHECK (relevance_score >= 0 AND relevance_score <= 1),
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'dismissed')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_policy_events_status ON public.policy_events(status);
CREATE INDEX IF NOT EXISTS idx_policy_events_category ON public.policy_events(impact_category);
CREATE INDEX IF NOT EXISTS idx_policy_events_detected_at ON public.policy_events(detected_at DESC);

-- Enable RLS
ALTER TABLE public.policy_events ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view verified policy events"
    ON public.policy_events
    FOR SELECT
    USING (status = 'verified');

CREATE POLICY "Service role has full access"
    ON public.policy_events
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Grant permissions
GRANT SELECT ON public.policy_events TO anon;
GRANT ALL ON public.policy_events TO authenticated;
GRANT ALL ON public.policy_events TO service_role;
```

3. **Click "Run" or press Cmd/Ctrl + Enter**

4. **Verify the table was created:**
```sql
SELECT * FROM public.policy_events;
```

Should return empty result (no rows) but no error.

---

### Option 2: Apply via Supabase CLI (Advanced)

If you have Supabase CLI installed:

```bash
cd /Users/ahhveedaa/ubuntu-initiative

# Link to your project (first time only)
supabase link --project-ref [your-project-ref]

# Push migrations
supabase db push

# Or apply specific migration
supabase migration up
```

---

## 🔍 Verify Tables Exist

After applying migrations, verify all required tables:

```sql
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'policy_events',
    'milestone_events', 
    'agent_audit_log',
    'approval_queue',
    'admin_roles'
  )
ORDER BY tablename;
```

**Expected result:** All 5 tables should be listed.

---

## 📋 Complete Migration Checklist

Run these in order in Supabase SQL Editor:

- [ ] `001_initial_schema.sql` - Core tables (policy_events, milestone_events, etc.)
- [ ] `004_agent_system_complete.sql` - Agent audit log and approval queue
- [ ] `20260109000001_admin_portal_production_fixed.sql` - Admin roles

---

## 🧪 Test After Migration

### Test 1: Manual Insert

```sql
INSERT INTO public.policy_events (
  title,
  source,
  source_url,
  publication_date,
  summary,
  impact_category,
  relevance_score
) VALUES (
  'Test Policy Event',
  'Manual Test',
  'https://test.com',
  CURRENT_DATE,
  'This is a test policy event',
  'infrastructure',
  0.75
);

-- Verify
SELECT * FROM public.policy_events;
```

### Test 2: Run Agent Manually

```bash
cd packages/agents
node src/automations/daily-policy-update.js
```

Should complete without "table not found" errors.

---

## 🚨 Common Issues

### Issue: "permission denied for table policy_events"
**Fix:** Run the GRANT permissions SQL above

### Issue: "uuid_generate_v4() function does not exist"
**Fix:** Enable uuid-ossp extension:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Issue: "gen_random_uuid() function does not exist"
**Fix:** Enable pgcrypto extension:
```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

---

## ✅ Success Indicators

After applying migrations, you should see:

1. ✅ Tables visible in Supabase Dashboard → Table Editor
2. ✅ Agent runs complete without errors
3. ✅ Policy events appear in dashboard
4. ✅ Audit logs being created

---

## 📞 Quick Fix (Copy-Paste Ready)

**Fastest way to fix right now:**

1. Open: https://supabase.com/dashboard/project/[your-project-id]/sql
2. Paste this complete script:

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create policy_events table
CREATE TABLE IF NOT EXISTS public.policy_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    source TEXT NOT NULL,
    source_url TEXT,
    publication_date DATE NOT NULL,
    summary TEXT,
    impact_category TEXT NOT NULL,
    relevance_score NUMERIC(3,2) CHECK (relevance_score >= 0 AND relevance_score <= 1),
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'dismissed')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_policy_events_status ON public.policy_events(status);
CREATE INDEX IF NOT EXISTS idx_policy_events_category ON public.policy_events(impact_category);
CREATE INDEX IF NOT EXISTS idx_policy_events_detected_at ON public.policy_events(detected_at DESC);

ALTER TABLE public.policy_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view verified policy events" ON public.policy_events;
CREATE POLICY "Public can view verified policy events"
    ON public.policy_events FOR SELECT USING (status = 'verified');

DROP POLICY IF EXISTS "Service role has full access" ON public.policy_events;
CREATE POLICY "Service role has full access"
    ON public.policy_events FOR ALL TO service_role USING (true) WITH CHECK (true);

GRANT SELECT ON public.policy_events TO anon;
GRANT ALL ON public.policy_events TO authenticated;
GRANT ALL ON public.policy_events TO service_role;
```

3. Click **Run**
4. Test: `SELECT * FROM public.policy_events;`
5. Done! ✅

---

**Status: Ready to apply migrations**
