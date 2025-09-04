import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme';
import { HomeScreen } from '../../screens/HomeScreen';
import { QRScannerTabScreen } from '../../screens/QRScannerTabScreen';
import { ProfileScreen } from '../../screens/ProfileScreen';

export type TabsParamList = {
  Home: undefined;
  ScanQR: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabsParamList>();

// Professional tab icon components using Ionicons
const HomeTabIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="home-outline" size={size} color={color} />
);

const ProfileTabIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="person-outline" size={size} color={color} />
);

const ScanQRTabIcon = ({ theme }: { theme: ReturnType<typeof useTheme>['theme'] }) => (
  <View style={[styles.scanTabButton, { backgroundColor: theme.colors.primary }]}>
    <View style={[styles.scanTabGlow, { borderColor: theme.colors.primary }]} />
    <Ionicons name="qr-code-outline" size={36} color="#ffffff" />
  </View>
);

export function TabsNavigator() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  
  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false, 
        headerTitleAlign: 'center',
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
          paddingHorizontal: 16,
          elevation: 12,
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: isDark ? 0.4 : 0.15,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
          letterSpacing: 0.5,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <HomeTabIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen 
        name="ScanQR" 
        component={QRScannerTabScreen}
        options={{
          title: '',
          tabBarIcon: () => <ScanQRTabIcon theme={theme} />,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 6, // Additional margin to avoid overlap with elevated button
            letterSpacing: 0.5,
          },
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <ProfileTabIcon color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  scanTabButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: -20, // Adjusted to center the bigger button
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  scanTabGlow: {
    position: 'absolute',
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: 'transparent',
    borderWidth: 2,
    shadowColor: '#00ff00',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 15,
  },
});



