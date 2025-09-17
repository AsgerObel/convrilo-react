# Stripe Payment Setup Instructions

## Overview
This guide will help you set up Stripe payments for your Convrilo Pro subscriptions.

## Pricing Structure
- **Free Plan**: $0/month - 10 conversations/day, 100MB file uploads
- **Pro Plan**: $4.99/month or $49/year - Unlimited conversations, 500MB file uploads

## Step 1: Create Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Click "Start now" and create your account
3. Complete your business profile (you can use test mode first)

## Step 2: Set Up Products and Prices in Stripe Dashboard

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Products** in the left sidebar
3. Click **"+ Add product"**
4. Create a product called "Convrilo Pro"
   - Description: "Unlimited conversations and advanced features"
   - Add two prices:
     - Monthly: $4.99 (recurring monthly)
     - Yearly: $49.00 (recurring yearly)
5. Save the Price IDs (they look like `price_1234567890abcdef`)

## Step 3: Get Your API Keys

1. In Stripe Dashboard, click **Developers** → **API keys**
2. Copy your keys:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)

## Step 4: Configure Environment Variables

### Local Development (.env file)
```env
# Add these to your .env file
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

### Vercel Deployment
1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add these variables:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   ```

## Step 5: Set Up Stripe Webhook

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **"+ Add endpoint"**
3. Enter your endpoint URL: `https://your-domain.vercel.app/api/stripe-webhook`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add it to your Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

## Step 6: Update Pricing Component

In `/src/pages/Pricing.jsx`, update the price IDs:

```javascript
priceId: billingPeriod === 'monthly'
  ? 'price_your_monthly_price_id' // Replace with your actual price ID
  : 'price_your_yearly_price_id',  // Replace with your actual price ID
```

## Step 7: Set Up Supabase Database

1. Go to your Supabase project
2. Navigate to **SQL Editor**
3. Run the migration script from `/supabase/migrations/create_subscriptions_table.sql`
4. Get your Service Role Key:
   - Go to **Settings** → **API**
   - Copy the `service_role` key (keep this secret!)
   - Add it to Vercel as `SUPABASE_SERVICE_ROLE_KEY`

## Step 8: Deploy to Vercel

1. Commit and push your changes
2. Vercel will automatically deploy
3. Test the payment flow in test mode

## Step 9: Test the Payment Flow

1. Use Stripe test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
2. Any future date for expiry
3. Any 3 digits for CVC
4. Any ZIP code

## Step 10: Go Live

When ready to accept real payments:
1. Complete your Stripe account activation
2. Replace test API keys with live keys
3. Update webhook endpoint with live signing secret
4. Test with a real payment

## Troubleshooting

### Common Issues:

1. **"Payment system is not configured"**
   - Check that `VITE_STRIPE_PUBLISHABLE_KEY` is set in environment variables

2. **Webhook failures**
   - Verify webhook signing secret is correct
   - Check Vercel function logs for errors

3. **Subscription not updating**
   - Ensure Supabase service role key has proper permissions
   - Check if database tables were created correctly

## Security Notes

- Never commit API keys to your repository
- Use environment variables for all sensitive data
- Keep your service role key secret
- Enable RLS (Row Level Security) on Supabase tables

## Support

For Stripe support: https://support.stripe.com
For implementation help: Check the code comments in the `/api` folder