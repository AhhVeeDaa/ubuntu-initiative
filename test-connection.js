#!/usr/bin/env node

// Test Supabase connection and verify database setup
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://frforinozbawkikgiywe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyZm9yaW5vemJhd2tpa2dpeXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNzM5NjAsImV4cCI6MjA4Mjg0OTk2MH0.HiosrsS_HsCHXy0GhFFJ_T63PM8OOQ9Yxp1JHRpMJd8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');
  
  try {
    // Test milestones table
    console.log('📊 Checking milestones table...');
    const { data: milestones, error: milestonesError } = await supabase
      .from('milestones')
      .select('*')
      .limit(5);
    
    if (milestonesError) {
      console.log('❌ Milestones table error:', milestonesError.message);
      console.log('⚠️  You need to run the schema.sql file in Supabase!\n');
      return false;
    }
    
    console.log(`✅ Milestones table exists: ${milestones.length} rows found`);
    if (milestones.length > 0) {
      console.log('   Sample:', milestones[0].title);
    }
    
    // Test partners table
    console.log('\n🤝 Checking partners table...');
    const { data: partners, error: partnersError } = await supabase
      .from('partners')
      .select('count');
    
    if (partnersError) {
      console.log('❌ Partners table error:', partnersError.message);
      return false;
    }
    
    console.log(`✅ Partners table exists`);
    
    // Test activities table
    console.log('\n📝 Checking activities table...');
    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .select('count');
    
    if (activitiesError) {
      console.log('❌ Activities table error:', activitiesError.message);
      return false;
    }
    
    console.log(`✅ Activities table exists`);
    
    console.log('\n🎉 SUCCESS! Database is properly configured!\n');
    console.log('Next steps:');
    console.log('1. Make sure both dev servers are running');
    console.log('2. Visit http://localhost:3000');
    console.log('3. Visit http://localhost:3000/progress');
    console.log('4. Visit http://localhost:3001\n');
    
    return true;
    
  } catch (error) {
    console.log('❌ Connection error:', error.message);
    return false;
  }
}

testConnection();
