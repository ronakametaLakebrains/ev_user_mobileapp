#!/bin/bash

echo "========================================"
echo "ChargeKar EV User App - Build Script"
echo "========================================"
echo

echo "Choose your build option:"
echo "1. Android Release APK"
echo "2. Android Release Bundle (AAB)"
echo "3. Clean Android builds"
echo "4. Clean all builds"
echo "5. Exit"
echo

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo
        echo "Building Android Release APK..."
        npm run build:android
        echo
        echo "Build complete! Check: android/app/build/outputs/apk/release/app-release.apk"
        ;;
    2)
        echo
        echo "Building Android Release Bundle..."
        npm run build:android-bundle
        echo
        echo "Build complete! Check: android/app/build/outputs/bundle/release/app-release.aab"
        ;;
    3)
        echo
        echo "Cleaning Android builds..."
        npm run clean:android
        echo
        echo "Clean complete!"
        ;;
    4)
        echo
        echo "Cleaning all builds..."
        npm run clean
        echo
        echo "Clean complete!"
        ;;
    5)
        echo
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo
        echo "Invalid choice. Please try again."
        ;;
esac

read -p "Press Enter to continue..."
