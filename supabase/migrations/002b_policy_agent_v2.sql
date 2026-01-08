-- Ubuntu Initiative - Policy Agent Schema (Updated)
-- Migration: 002_policy_agent_v2
-- Created: 2026-01-08
-- Note: Works with existing agent_runs table

-- ============================================================================
-- DROP EXISTING POLICIES ON agent_runs (if they exist)
-- ============================================================================

DO $$ 
BEGIN
    DROP POLICY IF EXISTS agent_runs_select_owner_only ON public.agent_runs;
    DROP POLICY IF EXISTS agent_runs_insert_own ON public.agent_runs;
    DROP POLICY IF EXISTS agent_runs_update_owner ON public.agent_runs;
    DROP POLICY IF EXISTS agent_runs_delete_owner ON public.agent_runs;
END $$;

-- ============================================================================
-- UPDATE agent_runs TABLE to match Policy Agent needs
-- ============================================================================

-- Add missing columns to agent_runs
ALTER TABLE public.agent_runs 
ADD COLUMN IF NOT EXISTS agent_id TEXT,
ADD COLUMN IF NOT EXISTS agent_version TEXT,
ADD COLUMN IF NOT EXISTS trigger_type TEXT,
ADD COLUMN IF NOT EXISTS trigger_by TEXT,
ADD COLUMN IF NOT EXISTS items_found INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS items_processed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS items_written INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS error_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS error_details JSONB,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS duration_ms INTEGER,
ADD COLUMN IF NOT EXISTS config_snapshot JSONB;

-- Add constraints
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'agent_runs_status_check'
    ) THEN
        ALTER TABLE public.agent_runs 
        ADD CONSTRAINT agent_runs_status_check 
        CHECK (status IN ('running', 'success', 'partial', 'failed', 'pending'));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'agent_runs_trigger_check'
    ) THEN
        ALTER TABLE public.agent_runs 
        ADD CONSTRAINT agent_runs_trigger_check 
        CHECK (trigger_type IN ('scheduled', 'manual', 'api') OR trigger_type IS NULL);
    END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_agent_runs_agent_id_new ON public.agent_runs(agent_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_runs_status_new ON public.agent_runs(status);

-- ============================================================================
-- POLICY UPDATES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.policy_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_run_id UUID REFERENCES public.agent_runs(id),
    
    -- Core Content
    headline TEXT NOT NULL CHECK (char_length(headline) <= 200),
    summary TEXT NOT NULL CHECK (char_length(summary) <= 1000),
    full_text TEXT,
    source_url TEXT NOT NULL,
    source_name TEXT NOT NULL,
    
    -- Classification
    jurisdiction TEXT NOT NULL,
    policy_category TEXT NOT NULL CHECK (policy_category IN (
        'energy_generation',
        'hydropower_specific',
        'ai_governance',
        'infrastructure_investment',
        'data_sovereignty',
        'cross_border_trade',
        'environmental_regulation',
        'foreign_investment'
    )),
    relevance_score NUMERIC(3,2) NOT NULL CHECK (relevance_score >= 0 AND relevance_score <= 1),
    confidence_score NUMERIC(3,2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
    
    -- Risk Assessment
    risk_flag BOOLEAN DEFAULT false,
    risk_notes TEXT,
    
    -- Metadata
    publication_date DATE NOT NULL,
    detection_date TIMESTAMP DEFAULT NOW(),
    
    -- Approval Workflow
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'revised', 'superseded')),
    approved_at TIMESTAMP,
    approved_by TEXT,
    rejection_reason TEXT,
    revision_of UUID REFERENCES public.policy_updates(id),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_policy_updates_status ON public.policy_updates(status);
CREATE INDEX IF NOT EXISTS idx_policy_updates_jurisdiction ON public.policy_updates(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_policy_updates_category ON public.policy_updates(policy_category);
CREATE INDEX IF NOT EXISTS idx_policy_updates_publication_date ON public.policy_updates(publication_date DESC);
CREATE INDEX IF NOT EXISTS idx_policy_updates_relevance ON public.policy_updates(relevance_score DESC);

-- ============================================================================
-- AGENT AUDIT LOG TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.agent_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_run_id UUID REFERENCES public.agent_runs(id),
    agent_id TEXT NOT NULL,
    
    -- Action
    action_type TEXT NOT NULL CHECK (action_type IN (
        'source_fetch',
        'gemini_analysis',
        'relevance_filter',
        'database_write',
        'approval_queue',
        'error_handled',
        'human_approval',
        'human_rejection',
        'human_revision'
    )),
    action_description TEXT NOT NULL,
    
    -- Context
    input_data JSONB,
    output_data JSONB,
    
    -- Decision Making
    confidence_score NUMERIC(3,2),
    reasoning TEXT,
    
    -- Human Review
    human_review_required BOOLEAN DEFAULT false,
    human_review_status TEXT DEFAULT 'not_required' CHECK (human_review_status IN ('not_required', 'pending', 'approved', 'rejected')),
    reviewed_by TEXT,
    review_notes TEXT,
    
    timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_audit_log_run_id ON public.agent_audit_log(agent_run_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_agent_audit_log_agent_id ON public.agent_audit_log(agent_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_agent_audit_log_action_type ON public.agent_audit_log(action_type);

-- ============================================================================
-- APPROVAL QUEUE TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.approval_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Item Reference
    item_type TEXT NOT NULL CHECK (item_type IN ('policy_update', 'milestone', 'narrative', 'grant', 'insight')),
    item_id UUID NOT NULL,
    agent_recommendation JSONB NOT NULL,
    
    -- Priority
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    priority_reason TEXT,
    auto_expire_at TIMESTAMP,
    
    -- Assignment
    assigned_to TEXT,
    assigned_at TIMESTAMP,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected', 'expired', 'revised')),
    reviewed_at TIMESTAMP,
    review_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_approval_queue_status ON public.approval_queue(status, priority);
CREATE INDEX IF NOT EXISTS idx_approval_queue_item ON public.approval_queue(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_approval_queue_assigned_to ON public.approval_queue(assigned_to);
CREATE INDEX IF NOT EXISTS idx_approval_queue_created_at ON public.approval_queue(created_at DESC);

-- ============================================================================
-- POLICY CORRECTIONS TABLE (for public feedback)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.policy_corrections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_update_id UUID NOT NULL REFERENCES public.policy_updates(id),
    correction_text TEXT NOT NULL,
    submitter_email TEXT,
    status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'accepted', 'rejected', 'implemented')),
    reviewed_by TEXT,
    review_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_policy_corrections_status ON public.policy_corrections(status);
CREATE INDEX IF NOT EXISTS idx_policy_corrections_policy_id ON public.policy_corrections(policy_update_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.policy_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_corrections ENABLE ROW LEVEL SECURITY;

-- Public can read approved policy updates
DROP POLICY IF EXISTS "Public read approved policy updates" ON public.policy_updates;
CREATE POLICY "Public read approved policy updates" 
ON public.policy_updates FOR SELECT 
USING (status = 'approved');

-- Service role can do everything on agent_runs
DROP POLICY IF EXISTS "Service role full access" ON public.agent_runs;
CREATE POLICY "Service role full access" 
ON public.agent_runs FOR ALL 
USING (true);

-- No public access to audit log
DROP POLICY IF EXISTS "No public access to audit log" ON public.agent_audit_log;
CREATE POLICY "No public access to audit log" 
ON public.agent_audit_log FOR ALL 
USING (false);

-- No public access to approval queue
DROP POLICY IF EXISTS "No public access to approval queue" ON public.approval_queue;
CREATE POLICY "No public access to approval queue" 
ON public.approval_queue FOR ALL 
USING (false);

-- Public can submit corrections
DROP POLICY IF EXISTS "Public can submit corrections" ON public.policy_corrections;
CREATE POLICY "Public can submit corrections" 
ON public.policy_corrections FOR INSERT 
WITH CHECK (true);

-- Public can read corrections
DROP POLICY IF EXISTS "Public can read corrections" ON public.policy_corrections;
CREATE POLICY "Public can read corrections" 
ON public.policy_corrections FOR SELECT 
USING (true);

-- ============================================================================
-- VIEWS FOR DASHBOARD
-- ============================================================================

-- Policy agent statistics
CREATE OR REPLACE VIEW policy_agent_stats AS
SELECT 
    COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
    COUNT(*) FILTER (WHERE status = 'approved') as approved_count,
    COUNT(*) FILTER (WHERE status = 'rejected') as rejected_count,
    AVG(confidence_score) FILTER (WHERE status = 'approved') as avg_confidence,
    AVG(relevance_score) FILTER (WHERE status = 'approved') as avg_relevance,
    COUNT(*) FILTER (WHERE risk_flag = true) as risk_flagged_count
FROM public.policy_updates;

-- Recent agent activity
CREATE OR REPLACE VIEW recent_agent_activity AS
SELECT 
    ar.id,
    ar.agent_id,
    ar.status,
    ar.items_processed,
    ar.duration_ms,
    ar.started_at,
    ar.completed_at,
    COUNT(aal.id) as action_count
FROM public.agent_runs ar
LEFT JOIN public.agent_audit_log aal ON aal.agent_run_id = ar.id
WHERE ar.agent_id = 'agent_001_policy_monitor'
GROUP BY ar.id
ORDER BY ar.started_at DESC
LIMIT 20;