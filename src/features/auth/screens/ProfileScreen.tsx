import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../theme';
import { useQueryClient } from '@tanstack/react-query';
import { Button, ScreenWrapper } from '../../../components';
import { logoutUser } from '../../../services/auth/logout';
import { useAuth } from '../../../services/auth/AuthContext';
import { useUserSubscription } from '../../../features/subscription/services/apiSubscription';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../app/navigation/RootNavigator';



export function ProfileScreen() {
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { logout } = useAuth();
  const { data: userSubscription } = useUserSubscription();
  const user = queryClient.getQueryData<{ name?: string; phone?: string }>(['currentUser']) || {};
  const displayName = user.name && user.name.trim().length > 0 ? user.name : 'User';
  const displayPhone = user.phone && user.phone.trim().length > 0 ? user.phone : '';
  
  const initials = React.useMemo(() => {
    const parts = (displayName || '').trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'U';
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] || '' : '';
    return `${first}${last}`.toUpperCase();
  }, [displayName]);

  return (
    <ScreenWrapper>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.lg },
        ]}
      >
        {/* Header Card */}
        <View style={[styles.profileHeader, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={[styles.name, { color: theme.colors.textPrimary }]} numberOfLines={1}>
            {displayName}
          </Text>
          {displayPhone && (
            <Text style={[styles.subText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
              {displayPhone}
            </Text>
          )}
        </View>

        {/* User Info Panel */}
        <View style={[styles.panel, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: theme.colors.overlayLight }]}>
              <Icon name="phone" size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Phone Number
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                {displayPhone || 'Not provided'}
              </Text>
            </View>
          </View>
        </View>

        {/* Subscription Panel - Only show if user has active subscription */}
        {userSubscription?.status === 'active' && (
          <View style={[styles.panel, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <TouchableOpacity 
              style={styles.infoRow}
              onPress={() => navigation.navigate('SubscriptionManagement')}
              activeOpacity={0.7}
            >
              <View style={[styles.infoIcon, { backgroundColor: theme.colors.overlayLight }]}>
                <Icon name="crown" size={20} color={theme.colors.accent} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                  Subscription
                </Text>
                <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                  Manage your plan
                </Text>
              </View>
              <Icon name="chevron-right" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Subscription Plans Panel - Only show if user doesn't have active subscription */}
        {userSubscription?.status !== 'active' && (
          <View style={[styles.panel, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <TouchableOpacity 
              style={styles.infoRow}
              onPress={() => navigation.navigate('Subscription')}
              activeOpacity={0.7}
            >
              <View style={[styles.infoIcon, { backgroundColor: theme.colors.overlayLight }]}>
                <Icon name="credit-card" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                  Subscription Plans
                </Text>
                <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                  View available plans
                </Text>
              </View>
              <Icon name="chevron-right" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.colors.border, paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.md }]}>
        <Button
          title="Logout"
          variant="outline"
          fullWidth
          onPress={async () => {
            try {
              await logoutUser();
              await logout();
              // Force navigation to login screen
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Logout error:', error);
              // Even if there's an error, try to navigate to login
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }
          }}
        />
        
        {/* App Version */}
        <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>
          Version 1.0.0
        </Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: { 
    paddingBottom: 24 
  },
  profileHeader: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  avatar: { 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 12 
  },
  avatarText: { 
    color: '#ffffff', // Keep white for contrast against primary background
    fontSize: 24, 
    fontWeight: '600' 
  },
  name: { 
    fontSize: 20, 
    fontWeight: '700', 
    marginBottom: 4 
  },
  subText: { 
    fontSize: 14, 
    fontWeight: '400' 
  },
  panel: { 
    borderWidth: 1, 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    marginBottom: 16 
  },

  footer: { 
    borderTopWidth: StyleSheet.hairlineWidth 
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.1)', // This will be themed dynamically
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 12,
  },
});



