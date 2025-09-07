import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../../theme';
import { ScreenWrapper, Button, Card } from '../../../components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUserSubscription, useCancelSubscription, useUpdateAutoRenewal } from '../services/apiSubscription';

export function SubscriptionManagementScreen() {
  const { theme } = useTheme();
  const { data: subscription, isLoading } = useUserSubscription();
  const cancelSubscription = useCancelSubscription();
  const updateAutoRenewal = useUpdateAutoRenewal();

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription? You will lose access to all premium benefits.',
      [
        { text: 'Keep Subscription', style: 'cancel' },
        {
          text: 'Cancel Subscription',
          style: 'destructive',
          onPress: () => {
            cancelSubscription.mutate(undefined, {
              onSuccess: () => {
                Alert.alert('Success', 'Your subscription has been cancelled.');
              },
              onError: (error: any) => {
                Alert.alert('Error', error.message || 'Failed to cancel subscription.');
              },
            });
          },
        },
      ]
    );
  };

  const handleToggleAutoRenewal = () => {
    if (subscription) {
      updateAutoRenewal.mutate(
        { autoRenew: !subscription.autoRenew },
        {
          onSuccess: () => {
            Alert.alert(
              'Success',
              `Auto-renewal ${!subscription.autoRenew ? 'enabled' : 'disabled'} successfully.`
            );
          },
          onError: (error: any) => {
            Alert.alert('Error', error.message || 'Failed to update auto-renewal setting.');
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Loading subscription details...
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (!subscription) {
    return (
      <ScreenWrapper>
        <View style={styles.noSubscriptionContainer}>
          <Icon name="account-off" size={64} color={theme.colors.textSecondary} />
          <Text style={[styles.noSubscriptionTitle, { color: theme.colors.textPrimary }]}>
            No Active Subscription
          </Text>
          <Text style={[styles.noSubscriptionText, { color: theme.colors.textSecondary }]}>
            You don't have an active subscription. Subscribe to a plan to enjoy premium benefits.
          </Text>
          <Button
            title="View Plans"
            variant="primary"
            onPress={() => {
              // TODO: Navigate to subscription plans
            }}
            style={styles.subscribeButton}
          />
        </View>
      </ScreenWrapper>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.colors.success;
      case 'cancelled':
        return theme.colors.warning;
      case 'expired':
        return theme.colors.error;
      case 'pending':
        return theme.colors.info;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'cancelled':
        return 'Cancelled';
      case 'expired':
        return 'Expired';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.lg }
        ]}
      >
        {/* Current Subscription Card */}
        <Card style={styles.subscriptionCard} shadow="md">
          <View style={styles.subscriptionHeader}>
            <View style={styles.planInfo}>
              <Text style={[styles.planName, { color: theme.colors.textPrimary }]}>
                {subscription.planName}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(subscription.status) }]}>
                <Text style={styles.statusText}>
                  {getStatusText(subscription.status)}
                </Text>
              </View>
            </View>
            <Icon name="crown" size={24} color={theme.colors.accent} />
          </View>

          <View style={styles.subscriptionDetails}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Start Date
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {new Date(subscription.startDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                End Date
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {new Date(subscription.endDate).toLocaleDateString()}
              </Text>
            </View>
            {subscription.nextBillingDate && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                  Next Billing
                </Text>
                <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                  {new Date(subscription.nextBillingDate).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>
        </Card>

        {/* Usage Statistics */}
        <Card style={styles.usageCard} shadow="md">
          <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
            Usage This Month
          </Text>
          <View style={styles.usageStats}>
            <View style={styles.usageItem}>
              <Text style={[styles.usageValue, { color: theme.colors.primary }]}>
                {subscription.usage.kwhUsed.toFixed(2)}
              </Text>
              <Text style={[styles.usageLabel, { color: theme.colors.textSecondary }]}>
                kWh Used
              </Text>
            </View>
            <View style={styles.usageItem}>
              <Text style={[styles.usageValue, { color: theme.colors.textPrimary }]}>
                {subscription.usage.kwhLimit.toFixed(2)}
              </Text>
              <Text style={[styles.usageLabel, { color: theme.colors.textSecondary }]}>
                kWh Limit
              </Text>
            </View>
            <View style={styles.usageItem}>
              <Text style={[styles.usageValue, { color: theme.colors.textPrimary }]}>
                {subscription.usage.sessionsCount}
              </Text>
              <Text style={[styles.usageLabel, { color: theme.colors.textSecondary }]}>
                Sessions
              </Text>
            </View>
          </View>
          
          {/* Usage Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: theme.colors.primary,
                    width: `${Math.min((subscription.usage.kwhUsed / subscription.usage.kwhLimit) * 100, 100)}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
              {((subscription.usage.kwhUsed / subscription.usage.kwhLimit) * 100).toFixed(1)}% used
            </Text>
          </View>
        </Card>

        {/* Settings */}
        <Card style={styles.settingsCard} shadow="md">
          <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
            Subscription Settings
          </Text>
          
          <TouchableOpacity
            style={styles.settingRow}
            onPress={handleToggleAutoRenewal}
            disabled={updateAutoRenewal.isPending}
          >
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>
                Auto-Renewal
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                {subscription.autoRenew ? 'Automatically renew subscription' : 'Manual renewal required'}
              </Text>
            </View>
            <View style={[styles.toggle, { backgroundColor: subscription.autoRenew ? theme.colors.primary : theme.colors.border }]}>
              <View style={[styles.toggleThumb, { backgroundColor: '#ffffff' }]} />
            </View>
          </TouchableOpacity>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            title="Change Plan"
            variant="outline"
            fullWidth
            onPress={() => {
              // TODO: Navigate to subscription plans
            }}
            style={styles.actionButton}
          />
          
          {subscription.status === 'active' && (
            <Button
              title="Cancel Subscription"
              variant="outline"
              fullWidth
              onPress={handleCancelSubscription}
              loading={cancelSubscription.isPending}
              style={[styles.actionButton, { borderColor: theme.colors.error }]}
              textStyle={{ color: theme.colors.error }}
            />
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  noSubscriptionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  noSubscriptionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  noSubscriptionText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  subscribeButton: {
    minWidth: 200,
  },
  subscriptionCard: {
    marginBottom: 16,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  subscriptionDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  usageCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  usageStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  usageItem: {
    alignItems: 'center',
  },
  usageValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  usageLabel: {
    fontSize: 12,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'center',
  },
  settingsCard: {
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    marginBottom: 0,
  },
});
