import React, { useMemo, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, BackHandler, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../theme';
import { Button, Logo, Card, ScreenWrapper, Modal } from '../components';
import { useUserSubscription } from '../features/subscription/services/apiSubscription';
import type { RootStackParamList } from '../app/navigation/RootNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { data: userSubscription } = useUserSubscription();
  const [showExitModal, setShowExitModal] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      // Reset modal state when screen comes into focus
      setShowExitModal(false);
      
      const backAction = () => {
        setShowExitModal(true);
        return true; // Prevent default behavior
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => backHandler.remove();
    }, [])
  );

  const handleExitApp = () => {
    setShowExitModal(false);
    BackHandler.exitApp();
  };

  const handleCancelExit = () => {
    setShowExitModal(false);
  };
  
  // Dynamic stats based on subscription status
  const stats = useMemo(() => {
    if (userSubscription?.status === 'active') {
      return [
        {
          title: 'Sessions This Month',
          value: userSubscription.usage?.sessionsCount?.toString() || '0',
          icon: 'flash' as const,
          color: theme.colors.primary,
        },
        {
          title: 'Energy Used',
          value: `${(userSubscription.usage?.kwhUsed || 0).toFixed(2)} kWh`,
          icon: 'battery-charging' as const,
          color: theme.colors.secondary,
        },
        {
          title: 'Remaining',
          value: `${((userSubscription.usage?.kwhLimit || 85) - (userSubscription.usage?.kwhUsed || 0)).toFixed(2)} kWh`,
          icon: 'time' as const,
          color: theme.colors.accent,
        },
      ];
    } else {
      return [
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
    }
  }, [userSubscription, theme.colors]);

  // Dynamic quick actions based on subscription status
  const quickActions = useMemo(() => {
    const baseActions = [
      {
        title: 'Find Chargers',
        description: 'Discover nearby chargers',
        icon: 'location' as const,
        onPress: () => navigation.navigate('Chargers'),
        variant: 'outline' as const,
        buttonText: 'Find',
      },
      {
        title: 'Transaction History',
        description: 'View your charging sessions',
        icon: 'time' as const,
        onPress: () => navigation.navigate('TransactionHistory'),
        variant: 'outline' as const,
        buttonText: 'View',
      },
    ];

    if (userSubscription?.status === 'active') {
      // User has active subscription
      return [
        {
          title: 'Start Charging',
          description: 'Begin a new charging session',
          icon: 'power' as const,
          onPress: () => navigation.navigate('StartCharging'),
          variant: 'primary' as const,
          buttonText: 'Start',
        },
        ...baseActions,
      ];
    } else {
      // User doesn't have active subscription - only show subscription plans and other features
      return [
        {
          title: 'Subscription Plans',
          description: 'Choose your monthly plan',
          icon: 'star' as const,
          onPress: () => navigation.navigate('Subscription'),
          variant: 'primary' as const,
          buttonText: 'View Plans',
        },
        ...baseActions,
      ];
    }
  }, [userSubscription, navigation]);

  return (
    <ScreenWrapper>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Logo size="md" showTagline={false} />
        </View>

        {/* Stats Section - Only show for users with active subscription */}
        {userSubscription?.status === 'active' && (
          <View style={styles.section}>
            <View style={styles.quickActionsHeader}>
              <Text style={[styles.quickActionsTitle, { color: theme.colors.primary }]}>
                Your Stats
              </Text>
              <View style={[styles.quickActionsUnderline, { backgroundColor: theme.colors.primary }]} />
            </View>
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <Card key={index} style={styles.statCard} shadow="sm">
                  <View style={styles.statContent}>
                    <Ionicons name={stat.icon} size={24} color={stat.color} style={styles.statIcon} />
                    <Text 
                      style={[styles.statValue, { color: stat.color }]}
                      numberOfLines={1}
                      adjustsFontSizeToFit={true}
                    >
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
        )}

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <View style={styles.quickActionsHeader}>
            <Text style={[styles.quickActionsTitle, { color: theme.colors.primary }]}>
              Quick Actions
            </Text>
            <View style={[styles.quickActionsUnderline, { backgroundColor: theme.colors.primary }]} />
          </View>
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

        {/* Subscription Teaser - Only show for non-subscribed users */}
        {userSubscription?.status !== 'active' && (
          <View style={styles.section}>
            <Card style={{...styles.teaserCard, backgroundColor: theme.colors.primary}} shadow="md">
              <View style={styles.teaserContent}>
                <View style={styles.teaserHeader}>
                  <Ionicons name="star" size={32} color="white" style={styles.teaserIcon} />
                  <Text style={styles.teaserTitle}>Unlock Premium Benefits</Text>
                </View>
                
                <Text style={styles.teaserSubtitle}>
                  Get the most out of your EV charging experience
                </Text>
                
                <View style={styles.benefitsList}>
                  <View style={styles.benefitItem}>
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                    <Text style={styles.benefitText}>Up to 85 kWh per month</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                    <Text style={styles.benefitText}>20% discount on charging</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                    <Text style={styles.benefitText}>Priority customer support</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                    <Text style={styles.benefitText}>Monthly usage tracking</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.teaserButton}
                  onPress={() => navigation.navigate('Subscription')}
                >
                  <Text style={styles.teaserButtonText}>View Plans</Text>
                  <Ionicons name="arrow-forward" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
            </Card>
          </View>
        )}

        {/* Exit Confirmation Modal - Only on Home Screen */}
        <Modal
          visible={showExitModal}
          type="confirm"
          title="Exit App"
          message="Are you sure you want to exit the application?"
          showIcon={false}
          buttons={[
            {
              text: 'Cancel',
              onPress: handleCancelExit,
              variant: 'primary'
            },
            {
              text: 'Exit',
              onPress: handleExitApp,
              variant: 'secondary'
            }
          ]}
          onClose={handleCancelExit}
        />

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
    paddingVertical: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  quickActionsHeader: {
    marginBottom: 16,
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  quickActionsUnderline: {
    height: 2,
    width: 40,
    borderRadius: 1,
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
  teaserCard: {
    marginBottom: 0,
    borderRadius: 16,
    overflow: 'hidden',
  },
  teaserContent: {
    padding: 24,
  },
  teaserHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  teaserIcon: {
    marginRight: 12,
  },
  teaserTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  teaserSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
    lineHeight: 20,
  },
  benefitsList: {
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 14,
    color: 'white',
    marginLeft: 12,
    fontWeight: '500',
  },
  teaserButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  teaserButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937', // Dark gray for contrast on white background
  },

});


