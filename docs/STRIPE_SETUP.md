# 🎯 STRIPE CLI SETUP FOR UBUNTU INITIATIVE

## Why You Need Stripe CLI

The Stripe CLI helps you:
- Test webhooks locally
- Listen to Stripe events in real-time  
- Create payment links and products
- Debug payment flows
- Test your integration before going live

---

## 📦 INSTALLATION (Choose One Method)

### Method 1: Homebrew (Recommended for Mac)

**Step 1: Install Homebrew (if not installed)**
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Step 2: Install Stripe CLI**
```bash
brew install stripe/stripe-cli/stripe
```

**Step 3: Verify Installation**
```bash
stripe --version
```

### Method 2: Direct Download (Alternative)

**For macOS:**
```bash
# Download
curl -L https://github.com/stripe/stripe-cli/releases/latest/download/stripe_latest_darwin_arm64.tar.gz -o stripe.tar.gz

# Extract
tar -xvf stripe.tar.gz

# Move to PATH
sudo mv stripe /usr/local/bin/

# Verify
stripe --version
```

---

## 🔑 AUTHENTICATION

**Step 1: Login to Stripe**
```bash
stripe login
```

This will:
1. Open your browser
2. Ask you to log into Stripe Dashboard
3. Grant CLI access
4. Store credentials locally

**Step 2: Verify Connection**
```bash
stripe config --list
```

---

## ⚡ AUTOCOMPLETION SETUP (ZSH)

Since you're using Zsh, run these commands:

```bash
# Generate completion file
stripe completion --shell zsh > ~/.stripe/stripe-completion.zsh

# Create .stripe directory if it doesn't exist
mkdir -p ~/.stripe

# Add to .zshrc
echo 'fpath=(~/.stripe $fpath)' >> ~/.zshrc
echo 'autoload -Uz compinit && compinit -i' >> ~/.zshrc

# Reload shell
source ~/.zshrc
```

Now you can type `stripe` and press TAB to see available commands!

---

## 🎯 USEFUL COMMANDS FOR UBUNTU INITIATIVE

### Create Payment Link
```bash
stripe payment_links create \
  --line-items '[{"price": "price_xxx", "quantity": 1}]' \
  --after_completion '{"type": "redirect", "redirect": {"url": "https://ubuntu-initiative.org/thank-you"}}'
```

### List Payment Links
```bash
stripe payment_links list
```

### Create Product and Price
```bash
# Create product
stripe products create \
  --name "Ubuntu Initiative Support" \
  --description "Support Phase 0 development"

# Create price (one-time $100)
stripe prices create \
  --product prod_xxx \
  --unit-amount 10000 \
  --currency usd
```

### Listen to Webhooks Locally
```bash
# Forward Stripe events to localhost:3000
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Test Webhook
```bash
stripe trigger payment_intent.succeeded
```

### View Logs
```bash
stripe logs tail
```

---

## 🔧 UBUNTU INITIATIVE SPECIFIC SETUP

### 1. Create Your Payment Links

**One-Time Donation (Custom Amount)**
```bash
stripe payment_links create \
  --line-items '[{"price": "price_xxx", "quantity": 1, "adjustable_quantity": {"enabled": false}}]' \
  --allow_promotion_codes true \
  --payment_method_types '["card"]' \
  --after_completion '{"type": "redirect", "redirect": {"url": "https://ubuntu-initiative.org/thank-you"}}'
```

**Monthly Sponsorship ($100/mo)**
```bash
stripe payment_links create \
  --line-items '[{"price": "price_monthly_100", "quantity": 1}]' \
  --subscription-data '{"trial_period_days": 0}'
```

### 2. Get Your Link URLs
```bash
stripe payment_links list --limit 10
```

### 3. Update .env.local
Copy the payment link URL and add to your `.env.local`:
```bash
NEXT_PUBLIC_DONATE_LINK=https://buy.stripe.com/xxxxx
```

---

## 🧪 TESTING

### Test Cards
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0027 6000 3184
```

### Test Webhook Locally
```bash
# Terminal 1: Run your dev server
cd /Users/ahhveedaa/ubuntu-initiative/apps/web
npm run dev

# Terminal 2: Listen for webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Terminal 3: Trigger test event
stripe trigger payment_intent.succeeded
```

---

## 📊 MONITOR PAYMENTS

### View Recent Payments
```bash
stripe payments list --limit 10
```

### View Specific Payment
```bash
stripe payments retrieve pi_xxxxx
```

### View All Customers
```bash
stripe customers list
```

---

## 🚨 TROUBLESHOOTING

### "stripe: command not found"
- Stripe CLI not installed or not in PATH
- Run: `which stripe` to check
- Reinstall using Method 1 or 2 above

### "You are not authenticated"
- Run: `stripe login`
- Follow browser auth flow

### "Permission denied"
- May need sudo for installation
- Use: `sudo mv stripe /usr/local/bin/`

### Autocompletion not working
- Make sure you sourced .zshrc: `source ~/.zshrc`
- Check if completion file exists: `ls ~/.stripe/`
- Restart terminal completely

---

## 🎯 QUICK START FOR YOU

**Right now, do this:**

1. **Install Stripe CLI:**
```bash
# If you have admin access:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install stripe/stripe-cli/stripe

# OR download directly:
curl -L https://github.com/stripe/stripe-cli/releases/latest/download/stripe_latest_darwin_arm64.tar.gz -o stripe.tar.gz
tar -xvf stripe.tar.gz
sudo mv stripe /usr/local/bin/
```

2. **Authenticate:**
```bash
stripe login
```

3. **Create Payment Link:**
```bash
# Go to Stripe Dashboard instead - easier!
# https://dashboard.stripe.com/payment-links
```

4. **Set up autocompletion:**
```bash
stripe completion --shell zsh > ~/.stripe/stripe-completion.zsh
mkdir -p ~/.stripe
echo 'fpath=(~/.stripe $fpath)' >> ~/.zshrc
echo 'autoload -Uz compinit && compinit -i' >> ~/.zshrc
source ~/.zshrc
```

---

## 💡 RECOMMENDED: Use Dashboard For Now

**For Phase 0, it's actually easier to:**
1. Go to https://dashboard.stripe.com/payment-links
2. Click "New" button
3. Set up your payment link visually
4. Copy the URL
5. Add to `.env.local`

**Use CLI later for:**
- Webhook testing
- Automation
- Advanced features
- Production monitoring

---

*Your support page is already working with the current test link!*  
*Stripe CLI is optional but powerful for advanced features.*

**For now: Just update the payment link in Dashboard and you're good to go!** ✅
