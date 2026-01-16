-- Fix approval_queue to make agent_id nullable
-- This allows items to be queued by agents OR manually by humans

DO $$
BEGIN
    -- Drop the NOT NULL constraint if it exists
    ALTER TABLE public.approval_queue 
    ALTER COLUMN agent_id DROP NOT NULL;
    
    RAISE NOTICE '✅ agent_id is now nullable in approval_queue';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Note: agent_id may already be nullable or table may not exist yet';
END $$;
