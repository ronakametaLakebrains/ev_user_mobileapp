# Build Guide for Team Testing

This guide explains how to create builds for your team to test the ChargeKar EV User App.

## Prerequisites

### For Android Builds:
- Node.js (v18 or higher)
- Java Development Kit (JDK) 17 or higher
- Android Studio with Android SDK
- Android NDK
- Environment variables set up (ANDROID_HOME, ANDROID_SDK_ROOT)

### For iOS Builds:
- macOS (required for iOS builds)
- Xcode (latest version recommended)
- iOS Developer Account (for signing)
- CocoaPods

## Build Commands

### Android Builds

#### 1. Debug APK (for development testing)
```bash
npm run android
```
This creates a debug APK that can be installed directly on devices.

#### 2. Release APK (for team testing)
```bash
npm run build:android
```
This creates a release APK at: `android/app/build/outputs/apk/release/app-release.apk`

#### 3. Release AAB Bundle (for Play Store)
```bash
npm run build:android-bundle
```
This creates an Android App Bundle at: `android/app/build/outputs/bundle/release/app-release.aab`

### iOS Builds

#### 1. Debug Build (for development)
```bash
npm run ios
```
This runs the app in the iOS Simulator.

#### 2. Release Archive (for team testing)
```bash
npm run build:ios
```
This creates an Xcode archive at: `ios/EvUserApp.xcarchive`

#### 3. Release IPA (for distribution)
```bash
npm run build:ios-ipa
```
This creates an IPA file at: `ios/build/EvUserApp.ipa`

## Step-by-Step Build Process

### Android Release Build

1. **Clean previous builds:**
   ```bash
   npm run clean:android
   ```

2. **Create release build:**
   ```bash
   npm run build:android
   ```

3. **Find your APK:**
   The APK will be located at: `android/app/build/outputs/apk/release/app-release.apk`

4. **Share with team:**
   - Upload to Google Drive, Dropbox, or your preferred file sharing service
   - Or use services like Firebase App Distribution, TestFlight, or HockeyApp

### iOS Release Build

1. **Update exportOptions.plist:**
   - Replace `YOUR_TEAM_ID` with your actual Apple Developer Team ID
   - You can find this in your Apple Developer account

2. **Clean previous builds:**
   ```bash
   npm run clean:ios
   ```

3. **Create release archive:**
   ```bash
   npm run build:ios
   ```

4. **Create IPA:**
   ```bash
   npm run build:ios-ipa
   ```

5. **Find your IPA:**
   The IPA will be located at: `ios/build/EvUserApp.ipa`

6. **Share with team:**
   - Use TestFlight for internal testing
   - Or upload to services like Firebase App Distribution

## Important Notes

### Android Signing
- The current build uses debug signing for release builds
- For production, you'll need to create a release keystore
- See: https://reactnative.dev/docs/signed-apk-android

### iOS Signing
- Make sure your Apple Developer account has the correct provisioning profiles
- Update the `teamID` in `ios/exportOptions.plist`
- For distribution, you may need to change the method to "app-store"

### Environment Setup
- Ensure all environment variables are properly set
- Make sure you have the latest versions of build tools
- For iOS, ensure Xcode command line tools are installed

## Troubleshooting

### Common Android Issues:
- **Gradle sync failed:** Check your internet connection and try `./gradlew clean`
- **Build tools version mismatch:** Update your Android SDK build tools
- **NDK issues:** Ensure NDK is properly installed and configured

### Common iOS Issues:
- **Code signing errors:** Check your provisioning profiles and certificates
- **Archive fails:** Ensure you're building for a real device, not simulator
- **Pod install issues:** Run `cd ios && pod install` before building

## Distribution Options

### For Internal Team Testing:
1. **Firebase App Distribution** (recommended)
2. **TestFlight** (iOS only)
3. **Direct APK/IPA sharing** via file sharing services

### For External Testing:
1. **Google Play Console** (Android)
2. **TestFlight** (iOS)
3. **Firebase App Distribution**

## Build Verification

After creating a build, verify it works by:
1. Installing on a test device
2. Testing core functionality
3. Checking that all features work as expected
4. Verifying the app version and build number

## Support

If you encounter issues during the build process:
1. Check the troubleshooting section above
2. Review the React Native documentation
3. Check your environment setup
4. Ensure all dependencies are properly installed
