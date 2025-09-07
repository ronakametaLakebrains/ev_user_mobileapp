import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme';
import { Button, Input, Checkbox, Logo } from '../../../components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../app/navigation/RootNavigator';
import { useRequestOtp } from '../services/apiLogin';

export function LoginScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const requestOtp = useRequestOtp();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [agreed, setAgreed] = useState(false);

  const isValid = useMemo(() => {
    const trimmed = phone.replace(/\s|-/g, '');
    // Allow +91 followed by 10 digits, or just 10 digits
    return /^(\+91)?[6-9]\d{9}$/.test(trimmed);
  }, [phone]);

  async function onContinue() {
    if (!isValid) {
      const trimmed = phone.replace(/\s|-/g, '');
      if (trimmed.length < 10) {
        setError('Please enter a 10-digit mobile number');
      } else if (trimmed.length > 10 && !trimmed.startsWith('+91')) {
        setError('Please enter correct mobile number (10 digits)');
      } else if (!/^[6-9]/.test(trimmed.replace('+91', ''))) {
        setError('Mobile number should start with 6, 7, 8, or 9');
      } else {
        setError('Please enter correct mobile number');
      }
      return;
    }
    setError(undefined);
    try {
      const res = await requestOtp.mutateAsync({ phone });
      
      if (res?.success) {
        navigation.navigate('Otp', { phone: res.phone, flow: 'login' });
      }
    } catch (e: any) {
      // Handle different types of errors with user-friendly messages
      if (e?.response?.status === 404) {
        setError('This phone number is not registered. Please sign up first.');
      } else if (e?.response?.status === 400) {
        setError('Invalid phone number. Please check and try again.');
      } else if (e?.response?.status === 429) {
        setError('Too many attempts. Please wait a moment and try again.');
      } else if (e?.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else if (e?.message?.includes('Network Error') || e?.code === 'NETWORK_ERROR') {
        setError('No internet connection. Please check your network and try again.');
      } else {
        setError('Unable to send OTP. Please try again.');
      }
    }
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.select({ ios: 'padding', android: 'height' })} 
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })}
      >
        <View style={[styles.content, { paddingHorizontal: theme.spacing.xl }]}>
          {/* Logo Section - Centered */}
          <View style={styles.logoSection}>
            <View style={styles.logoWrapper}>
              <Logo size="lg" showTagline={true} />
            </View>
          </View>
          
          {/* Form Section - Scrollable */}
          <View style={styles.formSection}>
            <Text style={[styles.title, { color: theme.colors.textPrimary, fontSize: theme.typography.sizes.h1 }]}>
              Welcome to ChargeKar
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary, marginTop: theme.spacing.sm }]}>
              Sign in to access EV charging stations
            </Text>

            <View style={{ height: theme.spacing.xl }} />

            <Input
              keyboardType="phone-pad"
              label="Mobile Number"
              placeholder="e.g. +91 98765 43210"
              value={phone}
              onChangeText={setPhone}
              errorText={error}
              returnKeyType="done"
              right={<Icon name="phone" size={18} color={theme.colors.textSecondary} />}
            />

            <View style={{ height: theme.spacing.lg }} />

            <Checkbox
              checked={agreed}
              onChange={setAgreed}
              label={(
                <Text style={{ color: theme.colors.textSecondary }}>
                  I agree to the{' '}
                  <Text 
                    style={{ color: theme.colors.primary, fontWeight: '600' }}
                    onPress={() => navigation.navigate('TermsAndConditions')}
                  >
                    Terms and Conditions
                  </Text>
                  {' '}and{' '}
                  <Text 
                    style={{ color: theme.colors.primary, fontWeight: '600' }}
                    onPress={() => navigation.navigate('PrivacyPolicy')}
                  >
                    Privacy Policy
                  </Text>
                </Text>
              )}
            />

            <View style={{ height: theme.spacing.lg }} />

            <Button 
              title="Continue" 
              onPress={onContinue} 
              variant="primary" 
              fullWidth 
              disabled={!isValid || !agreed}
              loading={requestOtp.isPending}
            />
          </View>

          {/* Footer - Fixed at bottom with proper spacing */}
          <View style={styles.footer}>
            <Pressable onPress={() => navigation.navigate('Signup')}>
              <Text style={{ color: theme.colors.textSecondary, textAlign: 'center' }}>
                Don't have an account? <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>Sign up</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { 
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: { 
    flex: 1,
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  logoSection: { 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    flexShrink: 0,
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  formSection: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 40,
    paddingVertical: 20,
    flexShrink: 1,
  },
  title: { 
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: { 
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    paddingVertical: 20,
    paddingBottom: 40, // Extra padding to avoid gesture area
    flexShrink: 0,
  },
});


