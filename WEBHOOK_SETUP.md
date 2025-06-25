# Stripe Webhook Configuration

## Your Webhook URL
```
https://ad7150ab-9465-4506-9aaa-4bc5b414375f-00-3ggw9vwt6nwm8.janeway.replit.dev/api/webhook/stripe
```

## Required Events to Configure in Stripe Dashboard
1. Go to your Stripe Dashboard → Webhooks
2. Click "Add endpoint"
3. Enter the webhook URL above
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `invoice.payment_succeeded`

## Testing the Payment Flow
1. Sign in with Google
2. Click "Subscribe Now"
3. Complete payment with test card: 4242 4242 4242 4242
4. You should be redirected back with success=true
5. The system will automatically verify your payment and activate premium access

## Troubleshooting
- Check browser console for verification logs
- Check server logs for webhook events
- Ensure you're signed in when returning from Stripe