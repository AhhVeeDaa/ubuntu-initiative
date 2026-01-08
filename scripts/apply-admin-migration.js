#!/usr/bin/env node

/**
 * Apply Admin Portal Schema Migration
 * Run this to create the admin_roles table in your remote Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://frforinozbawkikgiywe.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function applyMigration() {
    console.log('🔧 Applying Admin Portal Schema Migration...\n');
    
    if (!SUPABASE_SERVICE_KEY) {
        console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY not found');
        console.log('Set it with: export SUPABASE_SERVICE_ROLE_KEY="your-key"');
        process.exit(1);
    }
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    try {
        // Read the migration file
        const migrationPath = path.join(__dirname, '../supabase/migrations/20260108130000_admin_portal_schema.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        
        console.log('📄 Reading migration file...');
        console.log('📍 Path:', migrationPath);
        console.log('📊 Size:', migrationSQL.length, 'bytes\n');
        
        // Execute the migration
        console.log('⚡ Executing migration...');
        
        const { data, error } = await supabase.rpc('exec_sql', { 
            sql_string: migrationSQL 
        });
        
        if (error) {
            // If exec_sql doesn't exist, we need to use a different approach
            if (error.message.includes('function public.exec_sql')) {
                console.log('\n⚠️  Direct SQL execution not available.');
                console.log('📋 Please run this SQL manually in your Supabase SQL Editor:\n');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log(migrationSQL);
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
                console.log('🌐 SQL Editor: https://supabase.com/dashboard/project/frforinozbawkikgiywe/sql/new\n');
                console.log('After running the SQL, run this script again to assign the admin role.');
                process.exit(1);
            }
            throw error;
        }
        
        console.log('✅ Migration applied successfully!\n');
        
        // Now assign admin role to the user
        console.log('👑 Assigning super_admin role to user...');
        
        const USER_ID = '1dd2728c-618e-41bb-bc28-1d74e40eebb7';
        
        const { data: roleData, error: roleError } = await supabase
            .from('admin_roles')
            .upsert({
                user_id: USER_ID,
                role: 'super_admin',
                granted_by: USER_ID,
                is_active: true,
                notes: 'Initial Bootstrap - Created via migration script'
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
        console.log('✨ SETUP COMPLETE! ✨');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('📧 Email:    ahhveedaa@ubuntu-initiative.org');
        console.log('👤 Username: ahhveedaa');
        console.log('🔑 Password: Kinshasa123');
        console.log('👑 Role:     super_admin');
        console.log('🆔 User ID:  ' + USER_ID);
        console.log('\n🌐 Login at: http://localhost:3000');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    }
}

applyMigration();
