-- Fix agent_audit_log table - add missing columns

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
