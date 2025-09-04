import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../theme';
import { Button, Logo, Card, ScreenWrapper } from '../components';
import type { RootStackParamList } from '../app/navigation/RootNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  
  const quickActions = [
    {
      title: 'Transaction History',
      description: 'View your charging sessions',
      icon: 'time' as const,
      onPress: () => navigation.navigate('TransactionHistory'),
      variant: 'secondary' as const,
      buttonText: 'View',
    },
    {
      title: 'Find Chargers',
      description: 'Discover nearby chargers',
      icon: 'location' as const,
      onPress: () => navigation.navigate('Chargers'),
      variant: 'outline' as const,
      buttonText: 'Start',
    },
  ];

  return (
    <ScreenWrapper>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Logo size="lg" showTagline={true} />
          <Text style={[styles.welcomeText, { color: theme.colors.textSecondary }]}>
            Welcome back! Ready to charge your vehicle?
          </Text>
        </View>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <Card key={index} style={styles.actionCard} shadow="md">
                <View style={styles.actionContent}>
                  <Ionicons name={action.icon} size={32} color={theme.colors.primary} style={styles.actionIcon} />
                  <Text style={[styles.actionTitle, { color: theme.colors.textPrimary }]}>
                    {action.title}
                  </Text>
                  <Text style={[styles.actionDescription, { color: theme.colors.textSecondary }]}>
                    {action.description}
                  </Text>
                  <Button
                    title={action.buttonText || "Start"}
                    variant={action.variant}
                    size="sm"
                    onPress={action.onPress}
                    style={styles.actionButton}
                  />
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Status Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Current Status
          </Text>
          <Card style={styles.statusCard}>
            <View style={styles.statusContent}>
              <View style={[styles.statusIndicator, { backgroundColor: theme.colors.success }]} />
              <View style={styles.statusText}>
                <Text style={[styles.statusTitle, { color: theme.colors.textPrimary }]}>
                  Ready to Charge
                </Text>
                <Text style={[styles.statusDescription, { color: theme.colors.textSecondary }]}>
                  No active charging session
                </Text>
              </View>
            </View>
          </Card>
        </View>


      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  welcomeText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionsGrid: {
    gap: 16,
  },
  actionCard: {
    marginBottom: 0,
  },
  actionContent: {
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  actionButton: {
    minWidth: 100,
  },
  statusCard: {
    marginBottom: 0,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
  },
  statusText: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 14,
  },

});


