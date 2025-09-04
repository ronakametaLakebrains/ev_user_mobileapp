import React, { useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../theme';
import { Button } from '../components';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../app/navigation/RootNavigator';
import { useSignupDriver } from '../services/api/apiSignup';
import { useRequestOtp, useVerifyOtp } from '../services/api/apiLogin';
import { setAuthToken } from '../services/api/api';
import { queryClient } from '../services/query/client';

export function OtpScreen() {
  const { theme } = useTheme();
  const route = useRoute<RouteProp<RootStackParamList, 'Otp'>>();
  const navigation = useNavigation();
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
      navigation.reset({ index: 0, routes: [{ name: 'Tabs' as never }] });
    } catch (e: any) {
      setError(e?.message || 'Something went wrong. Please try again.');
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
      setError(e?.message || 'Failed to resend OTP');
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


