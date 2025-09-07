import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import { Input } from '../../../components/ui/Input';
import { monitorCharger } from '../services/apiMonitor';
import { getCurrentUserPhone } from '../../../utils/userUtils';
import type { RootStackParamList } from '../../../app/navigation/RootNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function ChargerIdInputScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [chargerId, setChargerId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleMonitorCharger = async () => {
    if (!chargerId.trim()) {
      Alert.alert('Error', 'Please enter a valid Charger ID');
      return;
    }

    setIsLoading(true);
    try {
      // Get user mobile number from profile
      const mobileNumber = getCurrentUserPhone();
      
      if (!mobileNumber) {
        Alert.alert('Error', 'User mobile number not found. Please login again.');
        setIsLoading(false);
        return;
      }
      
      const data = await monitorCharger({
        chargerId: chargerId.trim(),
        mobileNumber: mobileNumber,
      });
      
      if (data.success) {
        // Navigate to transaction history screen to show the new transaction
        navigation.navigate('TransactionHistory');
      } else {
        Alert.alert('Error', 'Failed to fetch transaction data. Please try again.');
      }
    } catch (error: any) {
      console.error('Monitor charger error:', error);
      
      // Check if it's a 404 error (charger not found)
      if (error?.response?.status === 404) {
        Alert.alert(
          'Charger Not Found', 
          `The charger ID "${chargerId.trim()}" was not found in our system. Please check the charger ID and try again.`
        );
      } else {
        Alert.alert('Error', 'Network error. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
              <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                  <TouchableOpacity onPress={handleGoBack} style={[styles.backButton, { backgroundColor: theme.colors.overlayLight }]}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Monitor Charger
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
            Enter Charger ID
          </Text>
          <Text style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]}>
            Please enter the Charger ID to view transaction details and monitor your charging session.
          </Text>

          <View style={styles.inputContainer}>
            <Input
              label="Charger ID"
              value={chargerId}
              onChangeText={setChargerId}
              placeholder="Enter Charger ID (e.g., CHG-001)"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.monitorButton,
              { 
                backgroundColor: isLoading ? theme.colors.textSecondary : theme.colors.primary,
                opacity: isLoading ? 0.7 : 1
              }
            ]}
            onPress={handleMonitorCharger}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={[styles.monitorButtonText, { color: 'white' }]}>
                Submit
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={[styles.infoContainer, { backgroundColor: theme.colors.overlayDark }]}>
          <Text style={[styles.infoTitle, { color: theme.colors.textPrimary }]}>
            💡 How to find your Charger ID?
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            • Look for the Charger ID displayed on the charging station{'\n'}
            • It's usually shown on the screen or printed on the charger{'\n'}
            • Format is typically like: CHG-001, CHARGER-123, etc.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0', // This will be themed dynamically
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  card: {
    backgroundColor: 'white', // This will be themed dynamically
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 25,
  },

  monitorButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monitorButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)', // This will be themed dynamically
    borderRadius: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
