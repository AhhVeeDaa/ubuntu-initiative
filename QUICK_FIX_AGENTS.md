# 🔧 COMPLETE AGENT FIX - COPY & PASTE SQL

## Run this entire script in Supabase SQL Editor

This will create all missing tables and columns needed for agents to work.

**Location:** Supabase Dashboard → SQL Editor → New Query

---

```sql
-- ============================================
-- UBUNTU INITIATIVE AGENT DATABASE SETUP
-- Complete fix for all agent-related tables
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. POLICY EVENTS TABLE
-- ============================================
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

DROP POLICY IF EXISTS "Service role has full access to policy events" ON public.policy_events;
CREATE POLICY "Service role has full access to policy events"
    ON public.policy_events FOR ALL TO service_role USING (true) WITH CHECK (true);

GRANT SELECT ON public.policy_events TO anon;
GRANT ALL ON public.policy_events TO authenticated;
GRANT ALL ON public.policy_events TO service_role;

-- ============================================
-- 2. FIX AGENT AUDIT LOG
-- ============================================

-- Add human_review_status column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'agent_audit_log' 
        AND column_name = 'human_review_status'
    ) THEN
        ALTER TABLE public.agent_audit_log 
        ADD COLUMN human_review_status TEXT DEFAULT 'not_required' 
        CHECK (human_review_status IN ('not_required', 'pending', 'approved', 'rejected'));
    END IF;
END $$;

-- Add reasoning column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'agent_audit_log' 
        AND column_name = 'reasoning'
    ) THEN
        ALTER TABLE public.agent_audit_log 
        ADD COLUMN reasoning TEXT;
    END IF;
END $$;

-- Create index for review status queries
CREATE INDEX IF NOT EXISTS idx_agent_audit_log_review_status 
ON public.agent_audit_log(human_review_status);

-- ============================================
-- 3. VERIFY SETUP
-- ============================================

-- Check all required tables exist
DO $$
DECLARE
    missing_tables TEXT[];
BEGIN
    SELECT array_agg(t) INTO missing_tables
    FROM unnest(ARRAY['policy_events', 'agent_audit_log', 'approval_queue', 'milestone_events']) AS t
    WHERE NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = t
    );
    
    IF array_length(missing_tables, 1) > 0 THEN
        RAISE NOTICE 'Missing tables: %', missing_tables;
    ELSE
        RAISE NOTICE 'All required tables exist ✓';
    END IF;
END $$;

-- Check required columns in agent_audit_log
DO $$
DECLARE
    missing_columns TEXT[];
BEGIN
    SELECT array_agg(c) INTO missing_columns
    FROM unnest(ARRAY['human_review_status', 'reasoning']) AS c
    WHERE NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'agent_audit_log' 
        AND column_name = c
    );
    
    IF array_length(missing_columns, 1) > 0 THEN
        RAISE NOTICE 'Missing columns in agent_audit_log: %', missing_columns;
    ELSE
        RAISE NOTICE 'All required columns exist in agent_audit_log ✓';
    END IF;
END $$;

```

---

## ✅ After Running

You should see output like:
```
NOTICE: All required tables exist ✓
NOTICE: All required columns exist in agent_audit_log ✓
```

---

## 🧪 Test the Fix

Run this to verify everything works:

```sql
-- Test policy_events insert
INSERT INTO public.policy_events (
    title, source, source_url, publication_date, 
    summary, impact_category, relevance_score
) VALUES (
    'Test Policy', 'Test', 'https://test.com', 
    CURRENT_DATE, 'Test summary', 'infrastructure', 0.75
) RETURNING id;

-- Test agent_audit_log insert
INSERT INTO public.agent_audit_log (
    agent_id, action_type, input_data, output_data,
    confidence_score, human_review_status, reasoning
) VALUES (
    'agent_test', 'test_action', '{}'::jsonb, '{}'::jsonb,
    0.85, 'not_required', 'Test reasoning'
) RETURNING id;

-- Verify both inserts worked
SELECT COUNT(*) as policy_count FROM public.policy_events;
SELECT COUNT(*) as audit_count FROM public.agent_audit_log;
```

Should return counts without errors.

---

## 🎯 Expected Result

After running the script, the agents should work! Test with:

```bash
cd packages/agents
node src/automations/daily-policy-update.js
```

Should complete successfully without column errors.

---

**Copy the entire SQL block above and paste into Supabase SQL Editor, then click Run.**
