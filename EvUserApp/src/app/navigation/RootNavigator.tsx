import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import { TabsNavigator, TabsParamList } from './TabsNavigator';
import { LoginScreen } from '../../features/auth/screens/LoginScreen';
import { SignupScreen } from '../../features/auth/screens/SignupScreen';
import { OtpScreen } from '../../features/auth/screens/OtpScreen';
import { QRScannerScreen } from '../../features/qr/screens/QRScannerScreen';
import { ChargingStatusScreen } from '../../features/chargers/screens/ChargingStatusScreen';
import { ChargerIdInputScreen } from '../../features/chargers/screens/ChargerIdInputScreen';
import { TransactionDetailsScreen } from '../../features/transactions/screens/TransactionDetailsScreen';
import { TransactionHistoryScreen } from '../../features/transactions/screens/TransactionHistoryScreen';
import { ChargersScreen } from '../../features/chargers/screens/ChargersScreen';
import { useAuth } from '../../services/auth/AuthContext';
import { useTheme } from '../../theme';

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Otp: { phone: string; name?: string; flow: 'login' | 'signup' } | undefined;
  Tabs: { screen?: keyof TabsParamList } | undefined;
  QRScanner: undefined;
  ChargingStatus: undefined;
  ChargerIdInput: undefined;
  TransactionDetails: { transactionData: any };
  TransactionHistory: undefined;
  Chargers: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme();

  // Show loading screen while checking authentication status
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator 
      initialRouteName={isAuthenticated ? "Tabs" : "Login"} 
      screenOptions={{ headerTitleAlign: 'center' }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen name="Otp" component={OtpScreen} options={{ title: 'Verify OTP' }} />
      <Stack.Screen name="Tabs" component={TabsNavigator} options={{ headerShown: false }} />
      <Stack.Screen 
        name="QRScanner" 
        component={QRScannerScreen} 
        options={{ 
          headerShown: false,
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="ChargingStatus" 
        component={ChargingStatusScreen} 
        options={{ 
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="ChargerIdInput" 
        component={ChargerIdInputScreen} 
        options={{ 
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="TransactionDetails" 
        component={TransactionDetailsScreen} 
        options={{ 
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="TransactionHistory" 
        component={TransactionHistoryScreen} 
        options={{ 
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="Chargers" 
        component={ChargersScreen} 
        options={{ 
          headerShown: false
        }} 
      />
    </Stack.Navigator>
  );
}



