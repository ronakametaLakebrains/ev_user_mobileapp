import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabsNavigator, TabsParamList } from './TabsNavigator';
import { LoginScreen } from '../../screens/LoginScreen';
import { SignupScreen } from '../../screens/SignupScreen';
import { OtpScreen } from '../../screens/OtpScreen';
import { QRScannerScreen } from '../../screens/QRScannerScreen';
import { ChargingStatusScreen } from '../../screens/ChargingStatusScreen';
import { ChargerIdInputScreen } from '../../screens/ChargerIdInputScreen';
import { TransactionDetailsScreen } from '../../screens/TransactionDetailsScreen';
import { TransactionHistoryScreen } from '../../screens/TransactionHistoryScreen';
import { ChargersScreen } from '../../screens/ChargersScreen';

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
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerTitleAlign: 'center' }}>
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



