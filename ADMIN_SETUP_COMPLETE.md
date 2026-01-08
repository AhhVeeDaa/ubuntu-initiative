# ✅ Admin User Setup - Complete

## What I've Created for You

### 1. **Node.js Script** (`scripts/create-admin-user.js`)
   - Automatically creates user account via Supabase Admin API
   - Assigns super_admin role
   - Works with both local and remote Supabase
   - Handles existing users gracefully

### 2. **Quick Setup Script** (`scripts/quick-admin-setup.sh`)
   - Interactive setup with local/remote selection
   - Prompts for service role key if needed
   - Guides you through the process

### 3. **Setup Guide** (`ADMIN_SETUP_GUIDE.md`)
   - Complete documentation
   - Troubleshooting tips
   - Security best practices

### 4. **SQL Script** (`create-admin.sql`)
   - Backup SQL approach
   - Can be run directly in Supabase SQL editor

---

## 🚀 Quick Start (Recommended)

Run this command:

```bash
cd /Users/ahhveedaa/ubuntu-initiative
./scripts/quick-admin-setup.sh
```

**The script will:**
1. Ask if you want local or remote Supabase
2. Request your service role key (for remote)
3. Create the user account with your credentials:
   - 📧 Email: `ahhveedaa@ubuntu-initiative.org`
   - 👤 Username: `ahhveedaa`
   - 🔑 Password: `Kinshasa123`
   - 👑 Role: `super_admin`
4. Confirm success

---

## 📋 What You Need

### For Remote Supabase (Production)
- Your **service_role key** from:
  https://supabase.com/dashboard/project/frforinozbawkikgiywe/settings/api

### For Local Supabase (Development)
- Docker running
- `npx supabase start` (script handles this)

---

## 🎯 After Setup

Once your admin user is created:

### Start the Web App
```bash
cd apps/web
npm run dev
```

### Login
1. Go to http://localhost:3000
2. Click "Sign In"
3. Enter:
   - Email: `ahhveedaa@ubuntu-initiative.org`
   - Password: `Kinshasa123`

### Access Admin Features
You now have full super_admin access to:
- ✅ Admin Portal
- ✅ User Management  
- ✅ System Configuration
- ✅ Analytics Dashboard
- ✅ Audit Logs
- ✅ Agent Management
- ✅ Financial Data

---

## 🔒 Security Notes

1. **Change the password** after first login
2. **Never commit** the service_role key to Git
3. **Use environment variables** for all secrets
4. **Store service_role key** in `.env.local`:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your-key-here
   ```

---

## 🛠️ Manual Alternative

If the scripts don't work, you can manually:

1. Go to Supabase Dashboard
2. Navigate to Authentication > Users
3. Click "Add User"
4. Fill in the details above
5. Then run this SQL in SQL Editor:

```sql
INSERT INTO public.admin_roles (user_id, role, granted_by, notes)
SELECT 
  id,
  'super_admin',
  id,
  'Manual Bootstrap'
FROM auth.users 
WHERE email = 'ahhveedaa@ubuntu-initiative.org';
```

---

## 📞 Next Steps

After creating your admin user:

1. ✅ **Login** to verify it works
2. ✅ **Change password** in profile settings
3. ✅ **Explore admin features** 
4. ✅ **Create additional admins** as needed
5. ✅ **Configure system settings**

---

## 🐛 Troubleshooting

### "Module not found"
```bash
npm install
```

### "Service key invalid"
- Double-check you copied the **service_role** key (not anon key)
- Make sure there are no extra spaces

### "Table admin_roles does not exist"
```bash
npx supabase migration up
```

### "User already exists"
- The script will handle this automatically
- It will assign the admin role to the existing user

---

## 📚 Files Created

```
ubuntu-initiative/
├── scripts/
│   ├── create-admin-user.js       # Main creation script
│   ├── quick-admin-setup.sh       # Interactive setup
│   └── setup-admin.sh             # Simple setup
├── create-admin.sql                # SQL backup method
└── ADMIN_SETUP_GUIDE.md           # Full documentation
```

---

**Ready to create your admin user? Run:**
```bash
./scripts/quick-admin-setup.sh
```

🎉 That's it! You'll be up and running in under 2 minutes!
