import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme';
import { ScreenWrapper } from '../../../components';

export function TermsAndConditionsScreen() {
  const { theme } = useTheme();

  return (
    <ScreenWrapper>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.lg }
        ]}
      >
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Terms and Conditions
        </Text>
        
        <Text style={[styles.lastUpdated, { color: theme.colors.textSecondary }]}>
          Last updated: {new Date().toLocaleDateString()}
        </Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            1. Acceptance of Terms
          </Text>
          <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
            By using the ChargeKar mobile application, you agree to be bound by these Terms and Conditions. 
            If you do not agree to these terms, please do not use our services.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            2. Service Description
          </Text>
          <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
            ChargeKar provides a platform for electric vehicle (EV) owners to locate, access, and pay for 
            EV charging services. Our service includes:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • Finding nearby charging stations
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • Real-time charging station availability
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • Secure payment processing
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • Charging session monitoring
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            3. User Responsibilities
          </Text>
          <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
            As a user of ChargeKar, you agree to:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • Provide accurate and up-to-date information
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • Use the service only for lawful purposes
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • Pay all charges promptly
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • Follow all charging station guidelines and safety protocols
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • Not damage or misuse charging equipment
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            4. Payment Terms
          </Text>
          <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
            All charges for EV charging services must be paid in advance or immediately after use. 
            We accept various payment methods including credit cards, debit cards, and digital wallets. 
            Prices may vary based on location, time of use, and charging speed.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            5. Limitation of Liability
          </Text>
          <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
            ChargeKar shall not be liable for any indirect, incidental, special, or consequential damages 
            arising from the use of our services. We do not guarantee the availability of charging stations 
            or the uninterrupted operation of our platform.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            6. Privacy and Data Protection
          </Text>
          <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
            Your privacy is important to us. Please review our Privacy Policy to understand how we collect, 
            use, and protect your personal information.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            7. Modifications to Terms
          </Text>
          <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
            We reserve the right to modify these Terms and Conditions at any time. Changes will be effective 
            immediately upon posting. Your continued use of the service constitutes acceptance of the modified terms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            8. Contact Information
          </Text>
          <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
            If you have any questions about these Terms and Conditions, please contact us at:
          </Text>
          <Text style={[styles.contactInfo, { color: theme.colors.primary }]}>
            Email: support@chargekar.com
          </Text>
          <Text style={[styles.contactInfo, { color: theme.colors.primary }]}>
            Phone: +91-XXX-XXX-XXXX
          </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 16,
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
});
