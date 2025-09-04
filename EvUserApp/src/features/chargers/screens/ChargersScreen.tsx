import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import { getChargers, Charger } from '../services/apiChargers';
import { getAuthToken } from '../../../services/api/api';
import { Card, Button, ScreenWrapper } from '../../../components';
import type { RootStackParamList } from '../../../app/navigation/RootNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function ChargersScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChargers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      // Check if auth token is available (for debugging if needed)
      await getAuthToken();

      const data = await getChargers();
      
      if (data.success) {
        setChargers(data.chargers);
      } else {
        setError('Failed to fetch chargers');
      }
    } catch (err: unknown) {
      console.error('Fetch chargers error:', err);
      setError('Failed to load chargers. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChargers();
  }, []);

  const onRefresh = () => {
    fetchChargers(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online':
        return theme.colors.success;
      case 'offline':
        return theme.colors.error;
      case 'charging':
        return theme.colors.warning;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online':
        return 'checkmark-circle';
      case 'offline':
        return 'close-circle';
      case 'charging':
        return 'battery-charging';
      default:
        return 'help-circle';
    }
  };


  const renderChargerCard = (charger: Charger) => (
    <Card key={charger.charger_id} style={styles.chargerCard} shadow="md">
      <View style={styles.chargerHeader}>
        <View style={styles.chargerInfo}>
          <Text style={[styles.chargerName, { color: theme.colors.textPrimary }]}>
            {charger.name}
          </Text>
          <Text style={[styles.chargerModel, { color: theme.colors.textSecondary }]}>
            {charger.manufacturer} {charger.model}
          </Text>
          <Text style={[styles.stationName, { color: theme.colors.textSecondary }]}>
            📍 {charger.station_name}
          </Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(charger.status) }]}>
            <Ionicons 
              name={getStatusIcon(charger.status)} 
              size={12} 
              color="#ffffff" 
            />
            <Text style={styles.statusText}>{charger.status.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.chargerDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="flash" size={16} color={theme.colors.primary} />
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Power
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
              {charger.power_capacity} kW
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="battery-charging" size={16} color={theme.colors.primary} />
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Connectors
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
              {charger._count.Connector}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.chargerActions}>
        <Button
          title="View Details"
          variant="outline"
          size="sm"
          onPress={() => {
            // TODO: Navigate to charger details
            console.log('View charger details:', charger.charger_id);
          }}
          style={styles.actionButton}
        />
        <Button
          title="Start Charging"
          variant="primary"
          size="sm"
          onPress={() => {
            // TODO: Navigate to charging screen
            console.log('Start charging with:', charger.charger_id);
          }}
          style={styles.actionButton}
        />
      </View>
    </Card>
  );

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Loading chargers...
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={theme.colors.error} />
          <Text style={[styles.errorTitle, { color: theme.colors.textPrimary }]}>
            Unable to Load Chargers
          </Text>
          <Text style={[styles.errorMessage, { color: theme.colors.textSecondary }]}>
            {error}
          </Text>
          <Button
            title="Try Again"
            variant="primary"
            onPress={() => fetchChargers()}
            style={styles.retryButton}
          />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
          Find Chargers
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryContainer}>
          <Text style={[styles.summaryText, { color: theme.colors.textSecondary }]}>
            {chargers.length} chargers available
          </Text>
        </View>

        {chargers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="battery-dead" size={64} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>
              No Chargers Found
            </Text>
            <Text style={[styles.emptyMessage, { color: theme.colors.textSecondary }]}>
              There are no chargers available at the moment.
            </Text>
          </View>
        ) : (
          <View style={styles.chargersList}>
            {chargers.map(renderChargerCard)}
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 40,
  },
  summaryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  summaryText: {
    fontSize: 14,
    textAlign: 'center',
  },
  chargersList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  chargerCard: {
    marginBottom: 0,
  },
  chargerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  chargerInfo: {
    flex: 1,
  },
  chargerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  chargerModel: {
    fontSize: 13,
    marginBottom: 2,
  },
  stationName: {
    fontSize: 11,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  chargerDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  chargerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    minWidth: 120,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
