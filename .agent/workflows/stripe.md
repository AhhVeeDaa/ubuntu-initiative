---
description: Manage Stripe integration and test webhooks
---

# Stripe Integration Workflow

Guide for using the Stripe CLI to manage development environment and test webhooks.

## 1. Login to Stripe CLI
Connect your local environment to your Stripe account.
```bash
stripe login
```

## 2. Listen for Webhook Events
Forward events from Stripe to your local development server.
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
*Note: Save the `webhook signing secret` provided in the output to your `.env.local` as `STRIPE_WEBHOOK_SECRET`.*

## 3. Trigger Test Events
Simulate events like successful checkouts to test your webhook handler.
```bash
stripe trigger checkout.session.completed
```

## 4. Create Test Products
If you need to create products manually via CLI as per the "My First Product" guide.
```bash
stripe products create \
  --name="Ubuntu Initiative Support" \
  --description="Created with Stripe CLI"
```

## 5. View API Request Logs
Monitor real-time logs for debugging API errors.
```bash
stripe logs tail
```

## 6. Pin API Version (Recommended)
When running requests via CLI, you can specify a version to match your code.
```bash
stripe products list --stripe-version 2024-12-18.acacia
```
