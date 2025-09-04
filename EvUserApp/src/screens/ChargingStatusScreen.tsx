import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme';

export function ChargingStatusScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [chargingTime, setChargingTime] = useState(0);
  const [isCharging, setIsCharging] = useState(true);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isCharging) {
      interval = setInterval(() => {
        setChargingTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isCharging]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStopCharging = () => {
    Alert.alert(
      'Stop Charging',
      'Are you sure you want to stop the charging session?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Stop Charging', 
          style: 'destructive',
          onPress: () => {
            setIsCharging(false);
            Alert.alert(
              'Charging Stopped',
              'Your charging session has been stopped. You can start a new session anytime.',
              [
                { 
                  text: 'OK', 
                  onPress: () => navigation.navigate('Home' as never)
                }
              ]
            );
          }
        }
      ]
    );
  };

  const handleGoHome = () => {
    navigation.navigate('Home' as never);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Charging Status
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.statusCard}>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, { backgroundColor: isCharging ? '#4CAF50' : '#FF5722' }]} />
            <Text style={[styles.statusText, { color: theme.colors.textPrimary }]}>
              {isCharging ? 'Charging in Progress' : 'Charging Stopped'}
            </Text>
          </View>

          <View style={styles.timeContainer}>
            <Text style={[styles.timeLabel, { color: theme.colors.textSecondary }]}>
              Charging Time
            </Text>
            <Text style={[styles.timeValue, { color: theme.colors.primary }]}>
              {formatTime(chargingTime)}
            </Text>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Charger ID:
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                CHG-001
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Connector:
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                Type 2 (CCS)
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Payment Status:
              </Text>
              <Text style={[styles.infoValue, { color: '#4CAF50' }]}>
                ✅ Completed
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {isCharging ? (
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: '#FF5722' }]} 
              onPress={handleStopCharging}
            >
              <Text style={[styles.buttonText, { color: 'white' }]}>
                🛑 Stop Charging
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.colors.primary }]} 
              onPress={handleGoHome}
            >
              <Text style={[styles.buttonText, { color: 'white' }]}>
                🏠 Go to Home
              </Text>
            </TouchableOpacity>
          )}
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  statusCard: {
    backgroundColor: 'white',
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
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timeLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  timeValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  infoContainer: {
    gap: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 40,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
