import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme';
import { ScreenWrapper } from '../../../components';

export function PrivacyPolicyScreen() {
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
          Privacy Policy
        </Text>
        
        <Text style={[styles.lastUpdated, { color: theme.colors.textSecondary }]}>
          Last updated: {new Date().toLocaleDateString()}
        </Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            1. Information We Collect
          </Text>
          <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
            We collect information you provide directly to us, such as when you create an account, 
            use our services, or contact us for support. This may include:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • Personal information (name, email, phone number)
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • Payment information (processed securely through third-party providers)
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • Vehicle information (for charging compatibility)
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • Location data (to find nearby charging stations)
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • Usage data (charging sessions, preferences)
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            2. How We Use Your Information
          </Text>
          <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
            We use the information we collect to:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • Provide and maintain our EV charging services
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • Process payments and manage your account
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • Send you important updates about our services
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • Improve our app and user experience
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • Provide customer support
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • Comply with legal obligations
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            3. Information Sharing
          </Text>
          <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
            We do not sell, trade, or rent your personal information to third parties. We may share 
            your information only in the following circumstances:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • With charging station operators (for service provision)
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • With payment processors (for transaction processing)
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • When required by law or to protect our rights
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • With your explicit consent
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            4. Data Security
          </Text>
          <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
            We implement appropriate security measures to protect your personal information against 
            unauthorized access, alteration, disclosure, or destruction. This includes:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • Encryption of sensitive data
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • Secure payment processing
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • Regular security audits
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • Access controls and authentication
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            5. Location Services
          </Text>
          <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
            Our app uses location services to help you find nearby charging stations. You can control 
            location permissions through your device settings. Location data is used only for service 
            provision and is not shared with third parties except as necessary for charging services.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            6. Your Rights
          </Text>
          <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
            You have the right to:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • Access your personal information
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • Correct inaccurate information
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • Delete your account and data
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • Opt out of marketing communications
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.colors.textSecondary }]}>
            • Withdraw consent for data processing
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            7. Data Retention
          </Text>
          <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
            We retain your personal information only as long as necessary to provide our services and 
            comply with legal obligations. When you delete your account, we will remove your personal 
            data within 30 days, except where retention is required by law.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            8. Children's Privacy
          </Text>
          <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
            Our services are not intended for children under 13 years of age. We do not knowingly 
            collect personal information from children under 13. If you believe we have collected 
            such information, please contact us immediately.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            9. Changes to This Policy
          </Text>
          <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
            We may update this Privacy Policy from time to time. We will notify you of any changes 
            by posting the new policy in the app and updating the "Last updated" date. Your continued 
            use of our services after changes constitutes acceptance of the updated policy.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            10. Contact Us
          </Text>
          <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </Text>
          <Text style={[styles.contactInfo, { color: theme.colors.primary }]}>
            Email: privacy@chargekar.com
          </Text>
          <Text style={[styles.contactInfo, { color: theme.colors.primary }]}>
            Phone: +91-XXX-XXX-XXXX
          </Text>
          <Text style={[styles.contactInfo, { color: theme.colors.primary }]}>
            Address: [Your Company Address]
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
