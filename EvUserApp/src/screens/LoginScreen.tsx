import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { Button, Input, Checkbox, Logo } from '../components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../app/navigation/RootNavigator';
import { useRequestOtp } from '../services/api/apiLogin';

export function LoginScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const requestOtp = useRequestOtp();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [agreed, setAgreed] = useState(false);

  const isValid = useMemo(() => {
    const trimmed = phone.replace(/\s|-/g, '');
    return /^\+?\d{10,15}$/.test(trimmed);
  }, [phone]);

  async function onContinue() {
    if (!isValid) {
      setError('Enter a valid mobile number');
      return;
    }
    setError(undefined);
    try {
      const res = await requestOtp.mutateAsync({ phone });
      if (res?.success) {
        navigation.navigate('Otp', { phone: res.phone, flow: 'login' });
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to request OTP');
    }
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.select({ ios: 'padding', android: undefined })} 
        style={styles.keyboardView}
      >
        <View style={[styles.content, { paddingHorizontal: theme.spacing.xl }]}>
          {/* Logo Section - Centered */}
          <View style={styles.logoSection}>
            <View style={styles.logoWrapper}>
              <Logo size="lg" showTagline={true} />
            </View>
          </View>
          
          {/* Form Section */}
          <View style={styles.formSection}>
            <Text style={[styles.title, { color: theme.colors.textPrimary, fontSize: theme.typography.sizes.h1 }]}>
              Welcome Back
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary, marginTop: theme.spacing.sm }]}>
              Sign in to continue to your account
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
                  I agree to the <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>Terms and Conditions</Text> and <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>Privacy Policy</Text>
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
  },
  logoSection: { 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingTop: 80,
    paddingBottom: 30,
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  formSection: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingVertical: 20,
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
  },
});


