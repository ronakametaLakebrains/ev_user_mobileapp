import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../app/navigation/RootNavigator';
import { useTheme } from '../../../theme';
import { Button } from '../../../components/ui/Button';

type PaymentResultRouteProp = RouteProp<RootStackParamList, 'PaymentResult'>;
type PaymentResultNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PaymentResult'>;

export function PaymentResultScreen() {
  const navigation = useNavigation<PaymentResultNavigationProp>();
  const route = useRoute<PaymentResultRouteProp>();
  const { theme } = useTheme();
  
  const { status, message, subscriptionId } = route.params;

  useEffect(() => {
    console.log('🎯 Payment Result Screen loaded');
    console.log('🎯 Status:', status);
    console.log('🎯 Message:', message);
    console.log('🎯 Subscription ID:', subscriptionId);
  }, []);

  const handleContinue = () => {
    // Navigate back to subscription management or home
    navigation.reset({
      index: 0,
      routes: [
        { name: 'Tabs' },
        { name: 'SubscriptionManagement' }
      ]
    });
  };

  const handleRetry = () => {
    // Navigate back to subscription screen
    navigation.navigate('Subscription');
  };

  const isSuccess = status === 'success';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.content, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.iconContainer}>
          <Text style={[styles.icon, { color: isSuccess ? theme.colors.success : theme.colors.error }]}>
            {isSuccess ? '✅' : '❌'}
          </Text>
        </View>
        
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
        </Text>
        
        <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
          {message || (isSuccess ? 'Your subscription has been activated successfully.' : 'There was an issue processing your payment.')}
        </Text>
        
        {subscriptionId && (
          <Text style={[styles.subscriptionId, { color: theme.colors.textSecondary }]}>
            Subscription ID: {subscriptionId}
          </Text>
        )}
        
        <View style={styles.buttonContainer}>
          {isSuccess ? (
            <Button
              title="View My Subscription"
              onPress={handleContinue}
              variant="primary"
              style={styles.button}
            />
          ) : (
            <>
              <Button
                title="Try Again"
                onPress={handleRetry}
                variant="primary"
                style={styles.button}
              />
              <Button
                title="Go to Home"
                onPress={() => navigation.reset({
                  index: 0,
                  routes: [{ name: 'Tabs' }]
                })}
                variant="outline"
                style={styles.button}
              />
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 20,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  subscriptionId: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'monospace',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    width: '100%',
  },
});
