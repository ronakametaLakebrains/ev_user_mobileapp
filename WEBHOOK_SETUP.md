# Razorpay Webhook Setup for ChargeKar

This document explains how to set up Razorpay webhooks to handle payment events and update your backend accordingly.

## 🎯 Why Use Webhooks?

Webhooks ensure your backend is notified of payment events even if the user doesn't return to your app. This provides a reliable way to:

- Update subscription status
- Handle failed payments
- Process successful payments
- Manage subscription lifecycle

## 🔧 Backend Webhook Setup

### 1. Create Webhook Endpoint

```javascript
// In your backend: /payment/callback
app.post('/payment/callback', async (req, res) => {
  try {
    const { event, payload } = req.body;
    
    console.log('🔔 Webhook received:', event);
    console.log('📋 Payload:', payload);
    
    switch (event) {
      case 'subscription.charged':
        // Payment successful
        await handleSuccessfulPayment(payload.subscription.entity);
        break;
        
      case 'subscription.failed':
        // Payment failed
        await handleFailedPayment(payload.subscription.entity);
        break;
        
      case 'subscription.cancelled':
        // Subscription cancelled
        await handleSubscriptionCancelled(payload.subscription.entity);
        break;
        
      case 'subscription.completed':
        // Subscription completed
        await handleSubscriptionCompleted(payload.subscription.entity);
        break;
        
      default:
        console.log('🤷 Unknown webhook event:', event);
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Helper functions
async function handleSuccessfulPayment(subscriptionId) {
  // Update subscription status in your database
  await updateSubscriptionStatus(subscriptionId, 'active');
  
  // Send confirmation email/SMS
  await sendPaymentConfirmation(subscriptionId);
  
  console.log('✅ Payment successful for subscription:', subscriptionId);
}

async function handleFailedPayment(subscriptionId) {
  // Update subscription status
  await updateSubscriptionStatus(subscriptionId, 'failed');
  
  // Notify user of failed payment
  await notifyPaymentFailure(subscriptionId);
  
  console.log('❌ Payment failed for subscription:', subscriptionId);
}

async function handleSubscriptionCancelled(subscriptionId) {
  // Update subscription status
  await updateSubscriptionStatus(subscriptionId, 'cancelled');
  
  console.log('🚫 Subscription cancelled:', subscriptionId);
}

async function handleSubscriptionCompleted(subscriptionId) {
  // Handle subscription completion
  await updateSubscriptionStatus(subscriptionId, 'completed');
  
  console.log('🎉 Subscription completed:', subscriptionId);
}
```

### 2. Configure Razorpay Webhook

1. **Go to Razorpay Dashboard** → Settings → Webhooks
2. **Create New Webhook** with URL: `https://your-domain.com/payment/callback`
3. **Select Events** to listen for:
   - `subscription.charged`
   - `subscription.failed`
   - `subscription.cancelled`
   - `subscription.completed`
4. **Copy Webhook Secret** for verification

### 3. Verify Webhook Signature (Security)

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(req, res, next) {
  const signature = req.headers['x-razorpay-signature'];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(JSON.stringify(req.body))
    .digest('hex');
  
  if (signature !== expectedSignature) {
    return res.status(400).json({ error: 'Invalid signature' });
  }
  
  next();
}

// Use middleware
app.post('/payment/callback', verifyWebhookSignature, webhookHandler);
```

## 🧪 Testing Webhooks

### 1. Use Razorpay Test Mode

- Enable test mode in Razorpay dashboard
- Use test API keys
- Test webhook events using Razorpay's webhook testing tool

### 2. Local Testing with ngrok

```bash
# Install ngrok
npm install -g ngrok

# Expose your local server
ngrok http 3000

# Use the ngrok URL in Razorpay webhook settings
# Example: https://abc123.ngrok.io/payment/callback
```

### 3. Test Webhook Events

```bash
# Test successful payment
curl -X POST https://your-domain.com/payment/callback \
  -H "Content-Type: application/json" \
  -H "x-razorpay-signature: your_signature" \
  -d '{
    "event": "subscription.charged",
    "payload": {
      "subscription": {
        "entity": {
          "id": "sub_test123",
          "status": "active"
        }
      }
    }
  }'
```

## 📱 Frontend Integration

### 1. Handle Deep Link Parameters

The deep link will include payment status:

```
chargekar://payment/result?status=success&subscription_id=sub_123&payment_id=pay_456
```

### 2. Update PaymentResultScreen

```javascript
// In PaymentResultScreen.tsx
useEffect(() => {
  if (status === 'success' && subscriptionId) {
    // Refresh subscription data
    queryClient.invalidateQueries(['userSubscription']);
    
    // Show success message
    Alert.alert(
      'Payment Successful!',
      'Your subscription has been activated.',
      [{ text: 'OK' }]
    );
  }
}, [status, subscriptionId]);
```

## 🔄 Complete Flow

1. **User clicks Subscribe** → App calls `/driver/start-subscribe`
2. **Backend creates Razorpay subscription** → Returns `short_url`
3. **App opens Razorpay URL** → User completes payment
4. **Razorpay processes payment** → Sends webhook to backend
5. **Backend updates subscription** → Status becomes 'active'
6. **Razorpay redirects to app** → `chargekar://payment/result?status=success`
7. **App shows success screen** → User can manage subscription

## 🚨 Important Notes

- **Always verify webhook signatures** for security
- **Handle webhook failures** gracefully
- **Use idempotent operations** to avoid duplicate processing
- **Log all webhook events** for debugging
- **Test thoroughly** in Razorpay test mode first

## 🎉 Benefits

- **Reliable payment processing** even if user doesn't return
- **Real-time subscription updates** via webhooks
- **Better user experience** with immediate feedback
- **Robust error handling** for failed payments
- **Complete audit trail** of all payment events
