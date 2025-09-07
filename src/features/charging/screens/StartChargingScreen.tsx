import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../../theme';
import { ScreenWrapper, Button, Input, Modal } from '../../../components';
import { useStartCharging } from '../services/apiCharging';

type RootStackParamList = {
  Tabs: undefined;
  StartCharging: undefined;
};

export function StartChargingScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const startCharging = useStartCharging();

  const [chargerId, setChargerId] = useState('');
  const [connectorId, setConnectorId] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleStartCharging = async () => {
    if (!chargerId.trim()) {
      Alert.alert('Error', 'Please enter Charger ID');
      return;
    }

    if (!connectorId.trim()) {
      Alert.alert('Error', 'Please enter Connector ID');
      return;
    }

    try {
      const response = await startCharging.mutateAsync({
        chargerId: chargerId.trim(),
        connectorId: connectorId.trim(),
      });

      if (response.success) {
        setSuccessMessage(response.message || 'Charging started successfully!');
        setShowSuccessDialog(true);
      } else {
        Alert.alert('Error', response.message || 'Failed to start charging');
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.response?.data?.message || error?.message || 'Failed to start charging'
      );
    }
  };

  const handleSuccessDialogPress = () => {
    setShowSuccessDialog(false);
    navigation.goBack();
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: 'height' })}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Enter the charger and connector details to start your charging session
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Charger ID"
              placeholder="Enter Charger ID"
              value={chargerId}
              onChangeText={setChargerId}
              keyboardType="default"
              autoCapitalize="characters"
            />

            <Input
              label="Connector ID"
              placeholder="Enter Connector ID"
              value={connectorId}
              onChangeText={setConnectorId}
              keyboardType="default"
              autoCapitalize="characters"
            />

            <Button
              title="Start Charging"
              onPress={handleStartCharging}
              loading={startCharging.isPending}
              style={styles.startButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal
        visible={showSuccessDialog}
        type="success"
        title="Charging Started!"
        message={successMessage}
        buttons={[
          {
            text: 'Continue',
            onPress: handleSuccessDialogPress,
            variant: 'primary',
          },
        ]}
        icon="flash"
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    gap: 20,
  },
  startButton: {
    marginTop: 10,
  },
});
