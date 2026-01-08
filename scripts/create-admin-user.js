#!/usr/bin/env node

/**
 * Create Admin User Script
 * Creates a user account and assigns super_admin role
 * 
 * Username: ahhveedaa
 * Password: Kinshasa123
 * Email: ahhveedaa@ubuntu-initiative.org
 * 
 * NOTE: This script needs the SUPABASE_SERVICE_ROLE_KEY
 * You can find this in your Supabase Dashboard > Settings > API
 */

const { createClient } = require('@supabase/supabase-js');

// Load from environment or .env.local
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://frforinozbawkikgiywe.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const USER_EMAIL = 'ahhveedaa@ubuntu-initiative.org';
const USER_PASSWORD = 'Kinshasa123';
const USER_METADATA = {
    username: 'ahhveedaa',
    full_name: 'Ahhveedaa',
};

async function createAdminUser() {
    console.log('🚀 Creating admin user...\n');
    
    if (!SUPABASE_SERVICE_KEY) {
        console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY not found');
        console.log('\n📝 To fix this:');
        console.log('1. Go to https://supabase.com/dashboard/project/frforinozbawkikgiywe/settings/api');
        console.log('2. Copy the "service_role" key (under "Project API keys")');
        console.log('3. Run: export SUPABASE_SERVICE_ROLE_KEY="your-service-key-here"');
        console.log('4. Then run this script again\n');
        process.exit(1);
    }
    
    // Initialize Supabase Admin Client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    try {
        // Step 1: Create user account
        console.log(`📧 Creating user: ${USER_EMAIL}`);
        const { data: userData, error: userError } = await supabase.auth.admin.createUser({
            email: USER_EMAIL,
            password: USER_PASSWORD,
            email_confirm: true, // Auto-confirm email
            user_metadata: USER_METADATA
        });

        if (userError) {
            // Check if user already exists
            if (userError.message.includes('already registered') || userError.message.includes('already exists')) {
                console.log('⚠️  User already exists, fetching user ID...');
                
                // Get existing user
                const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
                
                if (listError) throw listError;
                
                const existingUser = existingUsers.users.find(u => u.email === USER_EMAIL);
                
                if (!existingUser) {
                    throw new Error('User exists but could not be found');
                }
                
                console.log(`✅ Found existing user: ${existingUser.id}\n`);
                
                // Assign admin role to existing user
                return await assignAdminRole(supabase, existingUser.id);
            }
            
            throw userError;
        }

        console.log(`✅ User created: ${userData.user.id}\n`);

        // Step 2: Assign super_admin role
        return await assignAdminRole(supabase, userData.user.id);

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    }
}

async function assignAdminRole(supabase, userId) {
    console.log('👑 Assigning super_admin role...');
    
    const { data: roleData, error: roleError } = await supabase
        .from('admin_roles')
        .upsert({
            user_id: userId,
            role: 'super_admin',
            granted_by: userId,
            is_active: true,
            notes: 'Initial Bootstrap - Created via setup script'
        }, {
            onConflict: 'user_id'
        })
        .select()
        .single();

    if (roleError) {
        throw roleError;
    }

    console.log('✅ Super admin role assigned!\n');
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ ADMIN USER CREATED SUCCESSFULLY ✨');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📧 Email:    ', USER_EMAIL);
    console.log('👤 Username: ', USER_METADATA.username);
    console.log('🔑 Password: ', USER_PASSWORD);
    console.log('👑 Role:     ', 'super_admin');
    console.log('🆔 User ID:  ', userId);
    console.log('\n🌐 Login at: https://frforinozbawkikgiywe.supabase.co');
    console.log('🌐 Or via your app at: http://localhost:3000');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    return { userId, roleData };
}

// Run the script
createAdminUser();
