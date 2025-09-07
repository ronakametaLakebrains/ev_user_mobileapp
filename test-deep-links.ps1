# Deep Link Testing Script for ChargeKar App (PowerShell)
# This script helps you test deep links on both Android and iOS

Write-Host "🧪 ChargeKar Deep Link Testing Script" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# Test URLs
$SUCCESS_URL = "chargekar://payment/result?status=success&subscription_id=test123&message=Test payment successful"
$FAILURE_URL = "chargekar://payment/result?status=failure&message=Test payment failed"
$SUBSCRIPTION_URL = "chargekar://subscription"
$MANAGE_URL = "chargekar://subscription/manage"

Write-Host ""
Write-Host "Available test URLs:" -ForegroundColor Yellow
Write-Host "1. Payment Success: $SUCCESS_URL" -ForegroundColor Green
Write-Host "2. Payment Failure: $FAILURE_URL" -ForegroundColor Red
Write-Host "3. Subscription: $SUBSCRIPTION_URL" -ForegroundColor Blue
Write-Host "4. Manage Subscription: $MANAGE_URL" -ForegroundColor Magenta
Write-Host ""

# Function to test Android deep links
function Test-Android {
    Write-Host "📱 Testing Android Deep Links..." -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Testing Payment Success..." -ForegroundColor Yellow
    adb shell am start -W -a android.intent.action.VIEW -d $SUCCESS_URL com.chargekar
    Start-Sleep -Seconds 3
    
    Write-Host "Testing Payment Failure..." -ForegroundColor Yellow
    adb shell am start -W -a android.intent.action.VIEW -d $FAILURE_URL com.chargekar
    Start-Sleep -Seconds 3
    
    Write-Host "Testing Subscription..." -ForegroundColor Yellow
    adb shell am start -W -a android.intent.action.VIEW -d $SUBSCRIPTION_URL com.chargekar
    Start-Sleep -Seconds 3
    
    Write-Host "Testing Manage Subscription..." -ForegroundColor Yellow
    adb shell am start -W -a android.intent.action.VIEW -d $MANAGE_URL com.chargekar
}

# Function to test iOS deep links
function Test-iOS {
    Write-Host "🍎 Testing iOS Deep Links..." -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Testing Payment Success..." -ForegroundColor Yellow
    xcrun simctl openurl booted $SUCCESS_URL
    Start-Sleep -Seconds 3
    
    Write-Host "Testing Payment Failure..." -ForegroundColor Yellow
    xcrun simctl openurl booted $FAILURE_URL
    Start-Sleep -Seconds 3
    
    Write-Host "Testing Subscription..." -ForegroundColor Yellow
    xcrun simctl openurl booted $SUBSCRIPTION_URL
    Start-Sleep -Seconds 3
    
    Write-Host "Testing Manage Subscription..." -ForegroundColor Yellow
    xcrun simctl openurl booted $MANAGE_URL
}

# Function to show commands only
function Show-Commands {
    Write-Host "📋 Manual Commands:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Android:" -ForegroundColor Green
    Write-Host "adb shell am start -W -a android.intent.action.VIEW -d `"$SUCCESS_URL`" com.chargekar"
    Write-Host "adb shell am start -W -a android.intent.action.VIEW -d `"$FAILURE_URL`" com.chargekar"
    Write-Host "adb shell am start -W -a android.intent.action.VIEW -d `"$SUBSCRIPTION_URL`" com.chargekar"
    Write-Host "adb shell am start -W -a android.intent.action.VIEW -d `"$MANAGE_URL`" com.chargekar"
    Write-Host ""
    Write-Host "iOS:" -ForegroundColor Blue
    Write-Host "xcrun simctl openurl booted `"$SUCCESS_URL`""
    Write-Host "xcrun simctl openurl booted `"$FAILURE_URL`""
    Write-Host "xcrun simctl openurl booted `"$SUBSCRIPTION_URL`""
    Write-Host "xcrun simctl openurl booted `"$MANAGE_URL`""
}

# Main menu
Write-Host "Select platform to test:" -ForegroundColor Yellow
Write-Host "1. Android" -ForegroundColor Green
Write-Host "2. iOS" -ForegroundColor Blue
Write-Host "3. Show commands only" -ForegroundColor Cyan
Write-Host "4. Exit" -ForegroundColor Red
Write-Host ""

$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        Test-Android
    }
    "2" {
        Test-iOS
    }
    "3" {
        Show-Commands
    }
    "4" {
        Write-Host "Goodbye! 👋" -ForegroundColor Green
        exit 0
    }
    default {
        Write-Host "Invalid choice. Please run the script again." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "✅ Deep link testing completed!" -ForegroundColor Green
Write-Host "Check your app to see if the deep links worked correctly." -ForegroundColor Yellow
