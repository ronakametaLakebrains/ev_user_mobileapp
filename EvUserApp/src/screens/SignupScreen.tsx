import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';
import { Button, Input, Checkbox } from '../components';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../app/navigation/RootNavigator';

export function SignupScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [agreed, setAgreed] = useState(false);

  const isValidPhone = useMemo(() => /^\+?\d{10,15}$/.test(phone.replace(/\s|-/g, '')), [phone]);
  const isValid = name.trim().length >= 2 && isValidPhone && agreed;

  function onSignup() {
    if (!isValid) return;
    // Next step: call API to request OTP or create account, then navigate
    navigation.navigate('Otp', { phone, name, flow: 'signup' });
  }

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={[styles.root, { backgroundColor: theme.colors.background }]}
    >
      <View style={[styles.content, { paddingHorizontal: theme.spacing.xl, paddingTop: theme.spacing.xl * 2 }]}>
        <Text style={[styles.title, { color: theme.colors.textPrimary, fontSize: theme.typography.sizes.h1, textAlign: 'center' }]}>Sign up</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary, marginTop: theme.spacing.sm, textAlign: 'center' }]}>Create your account</Text>

        <View style={{ height: theme.spacing.xl }} />

        <Input
          label="Full Name"
          placeholder="Your name"
          value={name}
          onChangeText={setName}
          returnKeyType="next"
        />

        <View style={{ height: theme.spacing.lg }} />

        <Input
          keyboardType="phone-pad"
          label="Mobile Number"
          placeholder="e.g. +91 98765 43210"
          value={phone}
          onChangeText={setPhone}
          returnKeyType="done"
        />

        <View style={{ height: theme.spacing.lg }} />

        <Checkbox
          checked={agreed}
          onChange={setAgreed}
          label={(<Text style={{ color: theme.colors.textSecondary }}>I agree the <Text style={{ color: theme.colors.primary, textDecorationLine: 'underline' }}>terms and Condition</Text> and <Text style={{ color: theme.colors.primary, textDecorationLine: 'underline' }}>Privacy</Text></Text>)}
        />

        <View style={{ height: theme.spacing.md }} />
        <Button title="Continue" onPress={onSignup} variant="primary" fullWidth disabled={!isValid} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1 },
  title: { fontWeight: '700' },
  subtitle: { },
});


