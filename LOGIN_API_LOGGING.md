# Login API Console Logging

This document explains the comprehensive console logging that has been added to the login API flow for debugging and monitoring purposes.

## 🎯 **What's Been Added**

### **1. API Request/Response Logging**
- **Request details**: URL, method, body, timestamp
- **Response details**: Status, data, headers, timestamp
- **Automatic detection**: Only logs login-related endpoints

### **2. Hook-Level Logging**
- **OTP Request**: Phone number, success status, response message
- **OTP Verification**: Phone, OTP length, token details, user info

### **3. Screen-Level Logging**
- **Login Screen**: Complete login flow tracking
- **OTP Screen**: Verification process and navigation

## 📋 **Console Logs You'll See**

### **Step 1: Request OTP (Login Screen)**

```
🚀 Starting login process: {
  phone: "+919876543210",
  timestamp: "2024-01-15T10:30:00.000Z"
}

📱 Requesting OTP for login: {
  phone: "+919876543210",
  timestamp: "2024-01-15T10:30:00.000Z"
}

🔐 Login API Request: {
  url: "https://api.chargekar.com/driver/login",
  method: "POST",
  body: { phone: "+919876543210" },
  timestamp: "2024-01-15T10:30:00.000Z"
}

🔐 Login API Response: {
  url: "https://api.chargekar.com/driver/login",
  status: 200,
  statusText: "OK",
  data: {
    success: true,
    phone: "+919876543210",
    message: "OTP sent successfully"
  },
  headers: { ... },
  timestamp: "2024-01-15T10:30:00.000Z"
}

📱 OTP Request Response: {
  success: true,
  phone: "+919876543210",
  message: "OTP sent successfully",
  timestamp: "2024-01-15T10:30:00.000Z"
}

✅ Login OTP request successful: {
  success: true,
  phone: "+919876543210",
  message: "OTP sent successfully",
  timestamp: "2024-01-15T10:30:00.000Z"
}
```

### **Step 2: Verify OTP (OTP Screen)**

```
🔐 Starting OTP verification: {
  phone: "+919876543210",
  flow: "login",
  otpLength: 6,
  timestamp: "2024-01-15T10:30:00.000Z"
}

🔐 Verifying OTP for login: {
  phone: "+919876543210",
  otpLength: 6,
  timestamp: "2024-01-15T10:30:00.000Z"
}

🔐 Login API Request: {
  url: "https://api.chargekar.com/driver/verify-otp",
  method: "POST",
  body: { phone: "+919876543210", otp: "123456" },
  timestamp: "2024-01-15T10:30:00.000Z"
}

🔐 Login API Response: {
  url: "https://api.chargekar.com/driver/verify-otp",
  status: 200,
  statusText: "OK",
  data: {
    success: true,
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    name: "John Doe",
    validityDays: 30,
    message: "Login successful"
  },
  headers: { ... },
  timestamp: "2024-01-15T10:30:00.000Z"
}

🔐 OTP Verification Response: {
  success: true,
  hasToken: true,
  tokenLength: 156,
  name: "John Doe",
  validityDays: 30,
  message: "Login successful",
  timestamp: "2024-01-15T10:30:00.000Z"
}

✅ OTP verification successful: {
  success: true,
  hasToken: true,
  tokenLength: 156,
  name: "John Doe",
  validityDays: 30,
  message: "Login successful",
  timestamp: "2024-01-15T10:30:00.000Z"
}

💾 Saving auth token: {
  tokenLength: 156,
  timestamp: "2024-01-15T10:30:00.000Z"
}

👤 User data cached: {
  name: "John Doe",
  phone: "+919876543210",
  timestamp: "2024-01-15T10:30:00.000Z"
}

🏠 Navigating to main app...
```

### **Error Scenarios**

```
❌ Login OTP request failed: {
  error: { ... },
  status: 404,
  message: "User not found",
  timestamp: "2024-01-15T10:30:00.000Z"
}

❌ OTP verification failed: {
  error: { ... },
  status: 400,
  message: "Invalid OTP",
  timestamp: "2024-01-15T10:30:00.000Z"
}
```

## 🔍 **What to Look For**

### **Successful Login Flow:**
1. **Request OTP** → Should see success: true
2. **API Response** → Should see status: 200
3. **Verify OTP** → Should see hasToken: true
4. **Token Saved** → Should see tokenLength > 0
5. **Navigation** → Should see "Navigating to main app"

### **Common Issues:**
1. **Network Errors** → Check API base URL and connectivity
2. **Invalid Phone** → Check phone number format
3. **OTP Expired** → Check timestamp and OTP validity
4. **Token Issues** → Check token format and length

## 🧪 **Testing**

### **Test Login Flow:**
1. **Enter phone number** → Check console for request logs
2. **Request OTP** → Verify API call and response
3. **Enter OTP** → Check verification logs
4. **Complete login** → Verify token saving and navigation

### **Test Error Scenarios:**
1. **Invalid phone** → Check error logging
2. **Wrong OTP** → Check verification error logs
3. **Network issues** → Check error handling logs

## 🎉 **Benefits**

- **Complete visibility** into login flow
- **Easy debugging** of authentication issues
- **Request/response tracking** for API calls
- **Error identification** with detailed context
- **Performance monitoring** with timestamps
- **User flow tracking** from login to navigation

## 📱 **How to Use**

1. **Open browser dev tools** or React Native debugger
2. **Go to Console tab**
3. **Perform login** → Watch the logs in real-time
4. **Debug issues** → Use logs to identify problems
5. **Monitor performance** → Check timestamps for delays

The login API logging is now comprehensive and will help you debug any authentication issues! 🚀
