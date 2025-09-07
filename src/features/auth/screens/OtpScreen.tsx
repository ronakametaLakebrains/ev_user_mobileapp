import React, { useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../../../theme';
import { Button } from '../../../components';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../app/navigation/RootNavigator';
import { useSignupDriver } from '../services/apiSignup';
import { useRequestOtp, useVerifyOtp } from '../services/apiLogin';
import { setAuthToken } from '../../../services/api/api';
import { queryClient } from '../../../services/query/client';
import { useAuth } from '../../../services/auth/AuthContext';

export function OtpScreen() {
  const { theme } = useTheme();
  const route = useRoute<RouteProp<RootStackParamList, 'Otp'>>();
  const navigation = useNavigation();
  const { checkAuthStatus } = useAuth();
  const signupMutation = useSignupDriver();
  const verifyMutation = useVerifyOtp();
  const requestOtp = useRequestOtp();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputs = useRef<Array<TextInput | null>>([]);
  const [error, setError] = useState<string | undefined>(undefined);

  const value = useMemo(() => code.join(''), [code]);
  const isValid = value.length === 6 && /^\d{6}$/.test(value);

  function onChangeDigit(index: number, digit: string) {
    const sanitized = digit.replace(/\D/g, '').slice(0, 1);
    const next = [...code];
    next[index] = sanitized;
    setCode(next);
    if (sanitized && inputs.current[index + 1]) inputs.current[index + 1]?.focus();
  }

  async function onVerify() {
    if (!isValid) return;
    const payload = {
      phone: route.params?.phone ?? '',
      name: route.params?.name,
      otp: value,
    };
    try {
      let res: any;
      if (route.params?.flow === 'login') {
        res = await verifyMutation.mutateAsync({ phone: payload.phone, otp: payload.otp });
      } else {
        res = await signupMutation.mutateAsync(payload);
      }
      
      if (res?.token) {
        await setAuthToken(res.token);
      }
      
      // Stash minimal user info for downstream screens
      const name = (res?.name as string) ?? payload.name ?? '';
      queryClient.setQueryData(['currentUser'], { name, phone: payload.phone });
      
      // Cache subscription data if available
      if (res?.hasSubscription && res?.isActive) {
        const subscriptionData = {
          id: 'current', // We don't have the actual subscription ID from login
          planId: 'premium', // Default to premium plan
          planName: 'Premium Plan',
          status: res.status || 'active',
          startDate: res.subscriptionStartedAt || new Date().toISOString(),
          endDate: new Date(Date.now() + (res.validityDays || 30) * 24 * 60 * 60 * 1000).toISOString(),
          autoRenew: true,
          usage: {
            kwhUsed: parseFloat((85 - (res.unitsLeft || 0)).toFixed(2)), // Calculate used kWh
            kwhLimit: 85,
            sessionsCount: (60 - (res.sessionsLeft || 0)) // Calculate used sessions
          }
        };
        
        queryClient.setQueryData(['userSubscription'], subscriptionData);
      }
      
      // Update authentication status
      await checkAuthStatus();
      
      // Ensure navigation to main app
      setTimeout(() => {
        navigation.reset({ index: 0, routes: [{ name: 'Tabs' as never }] });
      }, 100);
    } catch (e: any) {
      console.error('❌ OTP verification failed:', {
        error: e,
        status: e?.response?.status,
        message: e?.message,
        timestamp: new Date().toISOString()
      });
      // Handle different types of errors with user-friendly messages
      if (e?.response?.status === 400) {
        setError('Invalid OTP. Please check and try again.');
      } else if (e?.response?.status === 401) {
        setError('OTP has expired. Please request a new one.');
      } else if (e?.response?.status === 429) {
        setError('Too many attempts. Please wait a moment and try again.');
      } else if (e?.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else if (e?.message?.includes('Network Error') || e?.code === 'NETWORK_ERROR') {
        setError('No internet connection. Please check your network and try again.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  }

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const [resendIn, setResendIn] = useState<number>(30);
  useEffect(() => {
    if (resendIn <= 0) return;
    const id = setInterval(() => setResendIn(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [resendIn]);

  async function onResend() {
    if (resendIn > 0) return;
    const phone = route.params?.phone ?? '';
    if (!phone) {
      setError('Missing phone number');
      return;
    }
    try {
      await requestOtp.mutateAsync({ phone });
      setResendIn(30);
      setError(undefined);
    } catch (e: any) {
      // Handle different types of errors with user-friendly messages
      if (e?.response?.status === 404) {
        setError('Phone number not found. Please go back and try again.');
      } else if (e?.response?.status === 429) {
        setError('Too many resend attempts. Please wait before trying again.');
      } else if (e?.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else if (e?.message?.includes('Network Error') || e?.code === 'NETWORK_ERROR') {
        setError('No internet connection. Please check your network and try again.');
      } else {
        setError('Failed to resend OTP. Please try again.');
      }
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.content, { paddingHorizontal: theme.spacing.xl, paddingTop: theme.spacing.xl * 2 }]}> 
        <Text style={[styles.title, { color: theme.colors.textPrimary, fontSize: theme.typography.sizes.h1, textAlign: 'center' }]}>Enter OTP</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary, marginTop: theme.spacing.sm, textAlign: 'center' }]}>We have sent a 6-digit code</Text>

        <View style={{ height: theme.spacing.xl }} />

        <View style={styles.row}> 
          {code.map((d, i) => (
            <TextInput
              key={i}
              ref={ref => { inputs.current[i] = ref; }}
              value={d}
              onChangeText={t => onChangeDigit(i, t)}
              keyboardType="number-pad"
              maxLength={1}
              style={[styles.box, { borderColor: theme.colors.border, color: theme.colors.textPrimary }]}
              placeholder="-"
              placeholderTextColor={theme.colors.textSecondary}
            />
          ))}
        </View>

        <View style={{ alignItems: 'center', marginTop: theme.spacing.sm }}>
          {resendIn > 0 ? (
            <Text style={{ color: theme.colors.textSecondary }}>Resend in {resendIn}s</Text>
          ) : (
            <Text onPress={onResend} style={{ color: theme.colors.accent, fontWeight: '600' }}>Resend OTP</Text>
          )}
        </View>

        {error ? (
          <Text style={{ color: '#ef4444', marginBottom: theme.spacing.sm }}>{error}</Text>
        ) : null}
        <View style={{ height: theme.spacing.md }} />
        <Button title="Verify" onPress={onVerify} fullWidth variant="primary" disabled={!isValid} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1 },
  title: { fontWeight: '700' },
  subtitle: { },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  box: { width: 44, height: 52, borderWidth: 1, borderRadius: 8, textAlign: 'center', fontSize: 20 },
});


