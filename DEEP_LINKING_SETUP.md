# Deep Linking Setup for ChargeKar App

This document explains how to set up deep linking for the ChargeKar app to handle payment redirects from Razorpay.

## 🎯 What We've Implemented

1. **Payment Result Screen**: A dedicated screen to show payment success/failure
2. **Deep Link Handler**: Processes incoming URLs and navigates to appropriate screens
3. **URL Configuration**: Maps URLs to app screens
4. **Redirect URL**: Automatically adds redirect URL to Razorpay payment links

## 🔗 Deep Link URLs

The app now supports these deep link URLs:

- `chargekar://payment/result` - Payment result screen
- `chargekar://subscription` - Subscription plans screen
- `chargekar://subscription/manage` - Subscription management screen
- `chargekar://home` - Home screen
- `chargekar://profile` - Profile screen

## 📱 Platform Configuration

### Android Setup

Add this to your `android/app/src/main/AndroidManifest.xml`:

```xml
<activity
    android:name=".MainActivity"
    android:exported="true"
    android:launchMode="singleTop"
    android:theme="@style/LaunchTheme">
    
    <!-- Existing intent filters -->
    
    <!-- Deep linking intent filter -->
    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="chargekar" />
    </intent-filter>
</activity>
```

### iOS Setup

Add this to your `ios/EvUserApp/Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLName</key>
        <string>chargekar</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>chargekar</string>
        </array>
    </dict>
</array>
```

## 🔄 How It Works

1. **User clicks "Subscribe Now"** → App calls your API
2. **API returns Razorpay URL** → App adds redirect URL parameter
3. **User completes payment** → Razorpay redirects to `chargekar://payment/result?status=success&subscription_id=xyz`
4. **App opens** → DeepLinkHandler processes the URL
5. **User sees result** → PaymentResultScreen shows success/failure

## 🧪 Testing

### Test Deep Links

You can test deep links using these commands:

**Android:**
```bash
adb shell am start -W -a android.intent.action.VIEW -d "chargekar://payment/result?status=success&subscription_id=test123" com.chargekar
```

**iOS Simulator:**
```bash
xcrun simctl openurl booted "chargekar://payment/result?status=success&subscription_id=test123"
```

### Test Payment Flow

1. Go to Subscription screen
2. Click "Subscribe Now"
3. Complete payment on Razorpay
4. App should automatically open and show payment result

## 🐛 Troubleshooting

### Common Issues

1. **Deep link not working**: Check if URL scheme is properly configured in platform files
2. **App not opening**: Verify the URL scheme matches exactly
3. **Wrong screen opening**: Check the linking configuration in `src/app/navigation/linking.ts`

### Debug Logs

The app logs all deep link activity. Look for these in your console:

```
🔗 Initial URL received: chargekar://payment/result?status=success
🔗 Processing deep link: chargekar://payment/result?status=success
🔗 URL path: /payment/result
🔗 Payment result params: { status: 'success', subscriptionId: 'xyz' }
```

## 🔧 Customization

### Change URL Scheme

To change from `chargekar://` to something else:

1. Update `src/app/navigation/linking.ts` - change the `prefixes` array
2. Update `src/features/subscription/screens/SubscriptionScreen.tsx` - change the `redirectUrl`
3. Update platform configuration files (AndroidManifest.xml, Info.plist)

### Add More Deep Links

To add more deep link routes:

1. Add the route to `RootStackParamList` in `RootNavigator.tsx`
2. Add the screen mapping in `linking.ts`
3. Add handling logic in `DeepLinkHandler.tsx`

## 📋 Next Steps

1. **Configure platform files** (AndroidManifest.xml, Info.plist)
2. **Test deep links** using the commands above
3. **Test full payment flow** with real Razorpay integration
4. **Customize URL scheme** if needed for your brand

## 🎉 Benefits

- **Seamless UX**: Users return to app after payment
- **Clear feedback**: Users see payment result immediately
- **Easy navigation**: Direct links to subscription management
- **Professional**: Complete payment flow integration
