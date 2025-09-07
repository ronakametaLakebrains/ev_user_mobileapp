import React, { useEffect } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function DeepLinkHandler() {
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    // Handle initial URL when app is opened via deep link
    const handleInitialURL = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          console.log('🔗 Initial URL received:', initialUrl);
          handleDeepLink(initialUrl);
        }
      } catch (error) {
        console.error('❌ Error getting initial URL:', error);
      }
    };

    // Handle URL when app is already running
    const handleURL = (event: { url: string }) => {
      console.log('🔗 URL received while app running:', event.url);
      handleDeepLink(event.url);
    };

    // Set up listeners
    const subscription = Linking.addEventListener('url', handleURL);
    
    // Handle initial URL
    handleInitialURL();

    // Cleanup
    return () => {
      subscription?.remove();
    };
  }, [navigation]);

  const handleDeepLink = (url: string) => {
    console.log('🔗 Processing deep link:', url);
    
    try {
      // Parse the URL
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      const searchParams = urlObj.searchParams;
      
      console.log('🔗 URL path:', path);
      console.log('🔗 URL search params:', Object.fromEntries(searchParams.entries()));
      
      // Handle payment result
      if (path === '/payment/result') {
        const status = searchParams.get('status') as 'success' | 'failure' | null;
        const message = searchParams.get('message') || undefined;
        const subscriptionId = searchParams.get('subscription_id') || undefined;
        
        console.log('🔗 Payment result params:', { status, message, subscriptionId });
        
        if (status) {
          navigation.navigate('PaymentResult', {
            status,
            message,
            subscriptionId,
          });
        } else {
          console.error('❌ No status parameter in payment result URL');
        }
      }
      
      // Handle other deep links as needed
      else if (path === '/subscription') {
        navigation.navigate('Subscription');
      }
      else if (path === '/subscription/manage') {
        navigation.navigate('SubscriptionManagement');
      }
      else if (path === '/home') {
        navigation.navigate('Tabs', { screen: 'Home' });
      }
      else if (path === '/profile') {
        navigation.navigate('Tabs', { screen: 'Profile' });
      }
      else {
        console.log('🔗 Unknown deep link path:', path);
      }
      
    } catch (error) {
      console.error('❌ Error parsing deep link URL:', error);
    }
  };

  return null; // This component doesn't render anything
}
