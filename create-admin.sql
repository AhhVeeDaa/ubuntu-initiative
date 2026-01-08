-- Create admin user and assign super_admin role
-- Username: ahhveedaa
-- Password: Kinshasa123

-- Step 1: Insert user into auth.users (Supabase Auth schema)
-- Note: We'll do this via the Supabase API instead, but keeping this for reference

-- Step 2: For now, we'll create a placeholder query that can be run after user is created
-- Get the user_id from auth.users where email matches
DO $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Find the user by email (assuming email is ahhveedaa@ubuntu-initiative.org or similar)
    -- You'll need to update this with the actual email used during signup
    SELECT id INTO v_user_id 
    FROM auth.users 
    WHERE email = 'ahhveedaa@ubuntu-initiative.org'
    LIMIT 1;
    
    -- If user exists, create admin role
    IF v_user_id IS NOT NULL THEN
        INSERT INTO public.admin_roles (user_id, role, granted_by, notes)
        VALUES (
            v_user_id,
            'super_admin',
            v_user_id,
            'Initial Bootstrap - Created via setup script'
        )
        ON CONFLICT (user_id) DO UPDATE
        SET role = 'super_admin',
            is_active = true,
            updated_at = NOW(),
            notes = 'Updated to super_admin via setup script';
        
        RAISE NOTICE 'Admin role assigned to user: %', v_user_id;
    ELSE
        RAISE NOTICE 'User not found. Please create the user first via Supabase Auth.';
    END IF;
END $$;
