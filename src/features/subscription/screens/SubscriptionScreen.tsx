import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Linking, AppState } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../app/navigation/RootNavigator';
import { useTheme } from '../../../theme';
import { ScreenWrapper, Button, Card, Modal } from '../../../components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useStartSubscription, useCheckSubscriptionStatus } from '../services/apiSubscription';
import { useQueryClient } from '@tanstack/react-query';

type SubscriptionScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Subscription'>;

export function SubscriptionScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<SubscriptionScreenNavigationProp>();
  const queryClient = useQueryClient();
  const [_selectedPlan] = useState<string | null>('premium');
  const startSubscription = useStartSubscription();
  const checkStatus = useCheckSubscriptionStatus();
  const [lastSubscriptionId, setLastSubscriptionId] = useState<string | null>(null);
  const [showPaymentStatusModal, setShowPaymentStatusModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'checking' | 'success' | 'failed'>('checking');
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);

  const checkSubscriptionStatus = useCallback(async () => {
    if (!lastSubscriptionId || isCheckingPayment) return;
    
    // Show checking modal
    setIsCheckingPayment(true);
    setShowPaymentStatusModal(true);
    setPaymentStatus('checking');
    
    try {
      const data = await checkStatus.mutateAsync();
      
      if (data.success && data.subscription?.status === 'active') {
        // Payment successful - subscription is active
        // Transform the API response to match the expected UserSubscription structure
        const transformedSubscription = {
          id: data.subscription.id || 'current',
          planId: data.subscription.plan_id || 'premium',
          planName: 'Premium Plan',
          status: 'active' as const,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          autoRenew: true,
          usage: {
            kwhUsed: 0, // Will be updated by the actual subscription API
            kwhLimit: 85,
            sessionsCount: 0 // Will be updated by the actual subscription API
          }
        };
        
        console.log('💾 Saving active subscription to cache:', transformedSubscription);
        queryClient.setQueryData(['userSubscription'], transformedSubscription);
        queryClient.invalidateQueries({ queryKey: ['userSubscription'] });
        setPaymentStatus('success');
      } else {
        // Payment failed - subscription is not active
        setPaymentStatus('failed');
      }
    } catch (error) {
      // API error - treat as payment failed
      setPaymentStatus('failed');
    } finally {
      setIsCheckingPayment(false);
    }
  }, [lastSubscriptionId, isCheckingPayment, checkStatus, queryClient]);

  // Check subscription status when user returns to app
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active' && lastSubscriptionId && !isCheckingPayment) {
        console.log('🔄 App became active, checking subscription status...');
        checkSubscriptionStatus();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [lastSubscriptionId, isCheckingPayment, checkSubscriptionStatus]);

  const subscriptionPlans = [
    {
      id: 'premium',
      name: 'Premium Plan',
      price: '₹999',
      period: 'per month',
      description: 'Perfect for regular EV users',
      features: [
        'Up to 85 kWh per month',
        '20% discount on charging',
        'Priority support',
        'Hassle free charging',
      ],
      popular: true,
    },
  ];

  const handleSubscribe = async (_planId: string) => {
    try {
      const response = await startSubscription.mutateAsync();
      
      if (response.success && response.subscription?.short_url) {
        // Store subscription ID for status checking
        const subscriptionId = response.subscription.id;
        setLastSubscriptionId(subscriptionId);
        
        // Directly open the payment URL
        const url = response.subscription.short_url;
        
        try {
          await Linking.openURL(url);
        } catch (error) {
          Alert.alert('Error', 'Failed to open payment page. Please try again.');
        }
      } else {
        Alert.alert(
          'Error',
          response.error || 'Failed to start subscription. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Something went wrong. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handlePaymentStatusModalClose = () => {
    setShowPaymentStatusModal(false);
    setLastSubscriptionId(null);
    setIsCheckingPayment(false);
    
    if (paymentStatus === 'success') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Tabs' }]
      });
    }
  };

  const handleRetryPayment = () => {
    setShowPaymentStatusModal(false);
    setLastSubscriptionId(null);
    setIsCheckingPayment(false);
    // User can try again by clicking Subscribe Now
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Get the best value for your EV charging needs
          </Text>
        </View>

        {/* Subscription Plans */}
        <View style={styles.plansContainer}>
          {subscriptionPlans.map((plan) => (
            <Card
              key={plan.id}
              style={[
                styles.planCard,
                plan.popular && { borderColor: theme.colors.accent, borderWidth: 2 }
              ] as any}
              shadow="md"
            >
              {plan.popular && (
                <View style={[styles.popularBadge, { backgroundColor: theme.colors.accent }]}>
                  <Text style={styles.popularText}>Most Popular</Text>
                </View>
              )}
              
              <View style={styles.planHeader}>
                <Text style={[styles.planName, { color: theme.colors.textPrimary }]}>
                  {plan.name}
                </Text>
                <View style={styles.priceContainer}>
                  <Text style={[styles.price, { color: theme.colors.primary }]}>
                    {plan.price}
                  </Text>
                  <Text style={[styles.period, { color: theme.colors.textSecondary }]}>
                    {plan.period}
                  </Text>
                </View>
              </View>

              <Text style={[styles.planDescription, { color: theme.colors.textSecondary }]}>
                {plan.description}
              </Text>

              <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Icon name="check-circle" size={16} color={theme.colors.success} />
                    <Text style={[styles.featureText, { color: theme.colors.textPrimary }]}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>

              <Button
                title="Subscribe Now"
                variant="primary"
                fullWidth
                onPress={() => handleSubscribe(plan.id)}
                loading={startSubscription.isPending}
                disabled={startSubscription.isPending}
                style={styles.selectButton}
              />
              
            </Card>
          ))}
        </View>


        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <Text style={[styles.benefitsTitle, { color: theme.colors.textPrimary }]}>
            Why Subscribe?
          </Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Icon name="lightning-bolt" size={24} color={theme.colors.primary} />
              <Text style={[styles.benefitText, { color: theme.colors.textSecondary }]}>
                Save money on every charging session
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Icon name="clock-fast" size={24} color={theme.colors.primary} />
              <Text style={[styles.benefitText, { color: theme.colors.textSecondary }]}>
                Priority access to chargers
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Icon name="shield-check" size={24} color={theme.colors.primary} />
              <Text style={[styles.benefitText, { color: theme.colors.textSecondary }]}>
                Guaranteed charging availability
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Payment Status Modal */}
      <Modal
        visible={showPaymentStatusModal}
        type={paymentStatus === 'success' ? 'success' : paymentStatus === 'failed' ? 'error' : 'info'}
        title={
          paymentStatus === 'checking' 
            ? 'Checking Payment Status' 
            : paymentStatus === 'success' 
            ? 'Payment Successful!' 
            : 'Payment Failed'
        }
        message={
          paymentStatus === 'checking'
            ? 'Please wait while we verify your payment...'
            : paymentStatus === 'success'
            ? 'Your subscription has been activated successfully!'
            : 'There was an issue processing your payment. Please try again.'
        }
        buttons={
          paymentStatus === 'checking'
            ? [] // No buttons while checking
            : paymentStatus === 'success'
            ? [
                {
                  text: 'Go to Home',
                  onPress: handlePaymentStatusModalClose,
                  variant: 'primary',
                },
              ]
            : [
                {
                  text: 'Try Again',
                  onPress: handleRetryPayment,
                  variant: 'primary',
                },
                {
                  text: 'Cancel',
                  onPress: handlePaymentStatusModalClose,
                  variant: 'outline',
                },
              ]
        }
        icon={paymentStatus === 'checking' ? 'loading' : paymentStatus === 'success' ? 'checkmark-circle' : 'close-circle'}
        closeOnOverlayPress={paymentStatus !== 'checking'}
      />
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  plansContainer: {
    gap: 16,
    marginBottom: 32,
  },
  planCard: {
    position: 'relative',
    padding: 20,
    marginBottom: 0,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 20,
    right: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  popularText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  priceContainer: {
    alignItems: 'center',
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  period: {
    fontSize: 14,
    marginTop: -4,
  },
  planDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  selectButton: {
    marginTop: 8,
  },
  benefitsSection: {
    marginTop: 16,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  benefitsList: {
    gap: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  benefitText: {
    fontSize: 16,
    marginLeft: 16,
    flex: 1,
    lineHeight: 22,
  },
});
