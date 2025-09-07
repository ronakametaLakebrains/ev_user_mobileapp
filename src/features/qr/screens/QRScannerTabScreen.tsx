import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Platform, PermissionsAndroid, AppState } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import { openUpiUri } from '../../payments/services/upi';
import { Modal } from '../../../components';
import RNQRGenerator from 'rn-qr-generator';

export function QRScannerTabScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showScanOptions, setShowScanOptions] = useState(false);
  const [isWaitingForPayment, setIsWaitingForPayment] = useState(false);

  const handleScanQR = () => {
    setShowScanOptions(true);
  };

  const handleCloseModal = () => {
    setShowScanOptions(false);
  };

  // Handle app state change to detect when user returns from UPI app
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      // Only handle if we're specifically waiting for QR payment completion
      // This prevents conflicts with subscription payment flow
      if (nextAppState === 'active' && isWaitingForPayment) {
        console.log('🔄 QR Payment: User returned from UPI app');
        setIsWaitingForPayment(false);
        
        // Directly navigate to charger ID input without alert
        navigation.navigate('ChargerIdInput' as never);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [isWaitingForPayment]);

  // Reset waiting state when user navigates away from this screen
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        // Cleanup: reset waiting state when leaving the screen
        setIsWaitingForPayment(false);
      };
    }, [])
  );

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs camera access to scan QR codes',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS handles permissions differently
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    
    if (!hasPermission) {
      Alert.alert(
        'Camera Permission Required',
        'Please grant camera permission to scan QR codes',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Settings', 
            onPress: () => {
              // You can add navigation to settings here if needed
              Alert.alert('Please go to Settings > Apps > ChargeKar > Permissions and enable Camera');
            }
          }
        ]
      );
      return;
    }

    launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
      saveToPhotos: false,
    }, (response) => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        console.error('Camera error:', response.errorCode, response.errorMessage);
        Alert.alert('Error', `Failed to take photo: ${response.errorMessage || 'Unknown error'}`);
        return;
      }
      if (response.assets && response.assets[0] && response.assets[0].uri) {
        processQRCode(response.assets[0].uri);
      }
    });
  };

  const handleSelectFromGallery = () => {
    launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
    }, (response) => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        Alert.alert('Error', 'Failed to select image');
        return;
      }
      if (response.assets && response.assets[0] && response.assets[0].uri) {
        processQRCode(response.assets[0].uri);
      }
    });
  };

  const processQRCode = async (imageUri: string) => {
    if (!imageUri) return;
    
    setIsProcessing(true);
    try {
      console.log('Processing QR code from image:', imageUri);
      const detection = await RNQRGenerator.detect({ uri: imageUri });
      console.log('QR detection result:', detection);
      
      const values: string[] = detection?.values || [];
      const upiUri = values.find(v => typeof v === 'string' && v.startsWith('upi://'));
      
      if (upiUri) {
        console.log('UPI URI found:', upiUri);
        
        // Show payment confirmation dialog
        Alert.alert(
          'Confirm Payment',
          'Do you want to proceed with the UPI payment for charging?',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => setIsProcessing(false) },
            { 
              text: 'Proceed to Pay', 
              onPress: async () => {
                try {
                  await openUpiUri(upiUri);
                  
                  // Reset processing state
                  setIsProcessing(false);
                  
                  // Set waiting state to detect when user returns from UPI app
                  setIsWaitingForPayment(true);
                  
                  // Show message that UPI app was opened
                  Alert.alert(
                    'UPI App Opened',
                    'Please complete the payment in your UPI app. You will be prompted to enter the charger ID when you return.',
                    [
                      {
                        text: 'OK',
                        onPress: () => {
                          // Just close the alert, AppState listener will handle the rest
                        }
                      }
                    ]
                  );
                  
                } catch (error) {
                  console.error('UPI opening error:', error);
                  Alert.alert(
                    'Unable to Open UPI App',
                    'Please make sure you have a UPI app installed (PhonePe, Paytm, Google Pay, BHIM, etc.) and try again.',
                    [
                      { text: 'Try Again', onPress: () => setIsProcessing(false) },
                      { text: 'Cancel', style: 'cancel', onPress: () => setIsProcessing(false) }
                    ]
                  );
                }
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'Invalid QR Code',
          'This QR code does not contain a valid UPI payment link.',
          [
            { text: 'Try Again', onPress: () => setIsProcessing(false) }
          ]
        );
      }
    } catch (error) {
      console.error('Error processing QR code:', error);
      Alert.alert(
        'Error',
        'Failed to process QR code. Please try again.',
        [
          { text: 'OK', onPress: () => setIsProcessing(false) }
        ]
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Scan QR Code
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          First plug in your EV, then scan the QR code to start charging
        </Text>
        
        <View style={styles.scanButtonContainer}>
          <TouchableOpacity
            style={[styles.scanButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleScanQR}
            activeOpacity={0.8}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <ActivityIndicator size="large" color="white" />
                <Text style={styles.scanText}>Processing...</Text>
              </>
            ) : (
              <>
                <Text style={styles.scanIcon}>📷</Text>
                <Text style={styles.scanText}>Scan QR Code</Text>
                <Text style={styles.scanSubtext}>Take a photo to start</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.stepContainer}>
            <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={[styles.stepText, { color: theme.colors.textSecondary }]}>
              Plug your EV into the charger and connect the charging cable
            </Text>
          </View>
          <View style={styles.stepContainer}>
            <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={[styles.stepText, { color: theme.colors.textSecondary }]}>
              Find the QR code on the charger
            </Text>
          </View>
          <View style={styles.stepContainer}>
            <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={[styles.stepText, { color: theme.colors.textSecondary }]}>
              Tap "Scan QR Code" button above
            </Text>
          </View>
          <View style={styles.stepContainer}>
            <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <Text style={[styles.stepText, { color: theme.colors.textSecondary }]}>
              Take a photo of the QR code
            </Text>
          </View>
          <View style={styles.stepContainer}>
            <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.stepNumberText}>5</Text>
            </View>
            <Text style={[styles.stepText, { color: theme.colors.textSecondary }]}>
              Complete UPI payment and enter charger ID
            </Text>
          </View>
        </View>
      </View>

      {/* Scan Options Modal with vertical buttons */}
      {showScanOptions && (
        <View style={[styles.modalOverlay, { backgroundColor: theme.colors.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.verticalButtons}>
              <TouchableOpacity 
                style={[styles.verticalButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => {
                  setShowScanOptions(false);
                  handleTakePhoto();
                }}
              >
                <Text style={[styles.verticalButtonText, { color: 'white' }]}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.verticalButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary, borderWidth: 1 }]}
                onPress={() => {
                  setShowScanOptions(false);
                  handleSelectFromGallery();
                }}
              >
                <Text style={[styles.verticalButtonText, { color: theme.colors.primary }]}>Choose from Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.verticalButton, { backgroundColor: 'transparent' }]}
                onPress={handleCloseModal}
              >
                <Text style={[styles.verticalButtonText, { color: theme.colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  scanButtonContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  scanButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  scanIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  scanText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scanSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  infoContainer: {
    width: '100%',
    maxWidth: 300,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stepText: {
    fontSize: 16,
    flex: 1,
  },
  // Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: '80%',
    maxWidth: 300,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  verticalButtons: {
    gap: 12,
  },
  verticalButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
