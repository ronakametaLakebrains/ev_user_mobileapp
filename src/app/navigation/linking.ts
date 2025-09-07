import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from './RootNavigator';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [
    'chargekar://', // Custom scheme for your app
    'https://chargekar.app', // If you have a web domain
  ],
  config: {
    screens: {
      // Main app screens
      Login: 'login',
      Signup: 'signup',
      Otp: 'otp',
      Tabs: {
        screens: {
          Home: 'home',
          ScanQR: 'scan',
          Profile: 'profile',
        },
      },

      // Subscription related screens
      Subscription: 'subscription',
      SubscriptionManagement: 'subscription/manage',
      PaymentResult: 'payment/result',

      // Other screens
      TermsAndConditions: 'terms',
      PrivacyPolicy: 'privacy',
      QRScanner: 'qr-scanner',
      ChargingStatus: 'charging-status',
      ChargerIdInput: 'charger-input',
      TransactionDetails: 'transaction/:id',
      TransactionHistory: 'transactions',
      Chargers: 'chargers',
    },
  },
};
