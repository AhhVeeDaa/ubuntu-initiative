-- Enable RLS on public.milestone_events
ALTER TABLE public.milestone_events ENABLE ROW LEVEL SECURITY;

-- Add owner_id column to track row ownership
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'milestone_events' AND column_name = 'owner_id') THEN
        ALTER TABLE public.milestone_events ADD COLUMN owner_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- Create Index on owner_id for performance
CREATE INDEX IF NOT EXISTS idx_milestone_events_owner_id ON public.milestone_events(owner_id);

-- Policy: Public Read Access
-- Allow anyone (anon and authenticated) to read all rows
DROP POLICY IF EXISTS "Public read access" ON public.milestone_events;
CREATE POLICY "Public read access" ON public.milestone_events FOR SELECT USING (true);

-- Policy: Authenticated Insert
-- Allow authenticated users to insert rows, but they must set owner_id to their own UID
DROP POLICY IF EXISTS "users_can_insert" ON public.milestone_events;
CREATE POLICY "users_can_insert" ON public.milestone_events 
    FOR INSERT 
    TO authenticated 
    WITH CHECK ((SELECT auth.uid()) = owner_id);

-- Policy: Owner Update
-- Allow users to update their own rows
DROP POLICY IF EXISTS "users_can_update_own" ON public.milestone_events;
CREATE POLICY "users_can_update_own" ON public.milestone_events 
    FOR UPDATE 
    TO authenticated 
    USING ((SELECT auth.uid()) = owner_id) 
    WITH CHECK ((SELECT auth.uid()) = owner_id);

-- Policy: Owner Delete
-- Allow users to delete their own rows
DROP POLICY IF EXISTS "users_can_delete_own" ON public.milestone_events;
CREATE POLICY "users_can_delete_own" ON public.milestone_events 
    FOR DELETE 
    TO authenticated 
    USING ((SELECT auth.uid()) = owner_id);
