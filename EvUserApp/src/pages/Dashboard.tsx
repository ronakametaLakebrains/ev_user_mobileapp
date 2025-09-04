import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme';
import { Button, Card, Logo } from '../components';
import type { RootStackParamList } from '../app/navigation/RootNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function Dashboard() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const stats = [
    {
      title: 'Total Sessions',
      value: '24',
      icon: 'flash' as const,
      color: theme.colors.primary,
    },
    {
      title: 'Energy Used',
      value: '156 kWh',
      icon: 'battery-charging' as const,
      color: theme.colors.secondary,
    },
    {
      title: 'Money Saved',
      value: '₹2,340',
      icon: 'cash' as const,
      color: theme.colors.accent,
    },
  ];

  const quickActions = [
    {
      title: 'Start Charging',
      description: 'Begin a new charging session',
      icon: 'power' as const,
      onPress: () => navigation.navigate('ChargerIdInput'),
      variant: 'primary' as const,
      buttonText: 'Start',
    },
    {
      title: 'View History',
      description: 'Check your charging records',
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Logo size="md" showTagline={false} />
          <View style={styles.headerActions}>
            <Button
              variant="ghost"
              leftIcon={<Ionicons name="notifications" size={20} color={theme.colors.textSecondary} />}
              onPress={() => {}}
            />
            <Button
              variant="ghost"
              leftIcon={<Ionicons name="person" size={20} color={theme.colors.textSecondary} />}
              onPress={() => navigation.navigate('Tabs', { screen: 'Profile' })}
            />
          </View>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeTitle, { color: theme.colors.textPrimary }]}>
            Good morning! 👋
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: theme.colors.textSecondary }]}>
            Ready to charge your vehicle today?
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Your Stats
          </Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <Card key={index} style={styles.statCard} shadow="sm">
                <View style={styles.statContent}>
                  <Ionicons name={stat.icon} size={24} color={stat.color} style={styles.statIcon} />
                  <Text style={[styles.statValue, { color: stat.color }]}>
                    {stat.value}
                  </Text>
                  <Text style={[styles.statTitle, { color: theme.colors.textSecondary }]}>
                    {stat.title}
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
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

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Recent Activity
          </Text>
          <Card style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: theme.colors.success }]}>
                <Ionicons name="checkmark" size={16} color="#ffffff" />
              </View>
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: theme.colors.textPrimary }]}>
                  Charging Session Completed
                </Text>
                <Text style={[styles.activityDetails, { color: theme.colors.textSecondary }]}>
                  Yesterday • 45 kWh • ₹180
                </Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: theme.colors.info }]}>
                <Ionicons name="battery-charging" size={16} color="#ffffff" />
              </View>
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: theme.colors.textPrimary }]}>
                  Charging Session Started
                </Text>
                <Text style={[styles.activityDetails, { color: theme.colors.textSecondary }]}>
                  2 days ago • 32 kWh • ₹128
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  welcomeSection: {
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    marginBottom: 0,
  },
  statContent: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    textAlign: 'center',
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
  activityCard: {
    marginBottom: 0,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  activityDetails: {
    fontSize: 12,
  },
});

