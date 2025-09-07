#!/bin/bash

# Deep Link Testing Script for ChargeKar App
# This script helps you test deep links on both Android and iOS

echo "🧪 ChargeKar Deep Link Testing Script"
echo "======================================"

# Test URLs
SUCCESS_URL="chargekar://payment/result?status=success&subscription_id=test123&message=Test payment successful"
FAILURE_URL="chargekar://payment/result?status=failure&message=Test payment failed"
SUBSCRIPTION_URL="chargekar://subscription"
MANAGE_URL="chargekar://subscription/manage"

echo ""
echo "Available test URLs:"
echo "1. Payment Success: $SUCCESS_URL"
echo "2. Payment Failure: $FAILURE_URL"
echo "3. Subscription: $SUBSCRIPTION_URL"
echo "4. Manage Subscription: $MANAGE_URL"
echo ""

# Function to test Android deep links
test_android() {
    echo "📱 Testing Android Deep Links..."
    echo ""
    
    echo "Testing Payment Success..."
    adb shell am start -W -a android.intent.action.VIEW -d "$SUCCESS_URL" com.chargekar
    sleep 3
    
    echo "Testing Payment Failure..."
    adb shell am start -W -a android.intent.action.VIEW -d "$FAILURE_URL" com.chargekar
    sleep 3
    
    echo "Testing Subscription..."
    adb shell am start -W -a android.intent.action.VIEW -d "$SUBSCRIPTION_URL" com.chargekar
    sleep 3
    
    echo "Testing Manage Subscription..."
    adb shell am start -W -a android.intent.action.VIEW -d "$MANAGE_URL" com.chargekar
}

# Function to test iOS deep links
test_ios() {
    echo "🍎 Testing iOS Deep Links..."
    echo ""
    
    echo "Testing Payment Success..."
    xcrun simctl openurl booted "$SUCCESS_URL"
    sleep 3
    
    echo "Testing Payment Failure..."
    xcrun simctl openurl booted "$FAILURE_URL"
    sleep 3
    
    echo "Testing Subscription..."
    xcrun simctl openurl booted "$SUBSCRIPTION_URL"
    sleep 3
    
    echo "Testing Manage Subscription..."
    xcrun simctl openurl booted "$MANAGE_URL"
}

# Main menu
echo "Select platform to test:"
echo "1. Android"
echo "2. iOS"
echo "3. Show commands only"
echo "4. Exit"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        test_android
        ;;
    2)
        test_ios
        ;;
    3)
        echo "📋 Manual Commands:"
        echo ""
        echo "Android:"
        echo "adb shell am start -W -a android.intent.action.VIEW -d \"$SUCCESS_URL\" com.chargekar"
        echo "adb shell am start -W -a android.intent.action.VIEW -d \"$FAILURE_URL\" com.chargekar"
        echo "adb shell am start -W -a android.intent.action.VIEW -d \"$SUBSCRIPTION_URL\" com.chargekar"
        echo "adb shell am start -W -a android.intent.action.VIEW -d \"$MANAGE_URL\" com.chargekar"
        echo ""
        echo "iOS:"
        echo "xcrun simctl openurl booted \"$SUCCESS_URL\""
        echo "xcrun simctl openurl booted \"$FAILURE_URL\""
        echo "xcrun simctl openurl booted \"$SUBSCRIPTION_URL\""
        echo "xcrun simctl openurl booted \"$MANAGE_URL\""
        ;;
    4)
        echo "Goodbye! 👋"
        exit 0
        ;;
    *)
        echo "Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "✅ Deep link testing completed!"
echo "Check your app to see if the deep links worked correctly."
