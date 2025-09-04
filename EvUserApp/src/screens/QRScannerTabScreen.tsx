import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Platform, PermissionsAndroid } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme';
import { openUpiUri } from '../services/payments/upi';
import RNQRGenerator from 'rn-qr-generator';

export function QRScannerTabScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showScanOptions, setShowScanOptions] = useState(false);

  const handleScanQR = () => {
    setShowScanOptions(true);
  };

  const handleCloseModal = () => {
    setShowScanOptions(false);
  };

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
                  
                  // Reset processing state before navigation
                  setIsProcessing(false);
                  
                  // Navigate to charger ID input screen immediately after opening UPI app
                  navigation.navigate('ChargerIdInput' as never);
                  
                } catch (error) {
                  Alert.alert('Error', 'Failed to open UPI app. Please try again.');
                  setIsProcessing(false);
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
          Scan the QR code on the charger to start charging
        </Text>
        
                 <View style={styles.scanButtonContainer}>
           <TouchableOpacity
             style={styles.scanButton}
             onPress={handleScanQR}
             activeOpacity={0.8}
             disabled={isProcessing}
           >
             <View style={styles.scanButtonGlow} />
             <View style={styles.scanButtonInner}>
               {isProcessing ? (
                 <>
                   <ActivityIndicator size="large" color="#1a1a1a" />
                   <Text style={styles.scanText}>PROCESSING...</Text>
                 </>
               ) : (
                 <>
                   <Text style={styles.scanIcon}>📱</Text>
                   <Text style={styles.scanText}>SCAN QR</Text>
                 </>
               )}
             </View>
           </TouchableOpacity>
         </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.infoTitle, { color: theme.colors.textPrimary }]}>
            How to use:
          </Text>
          <View style={styles.stepContainer}>
            <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={[styles.stepText, { color: theme.colors.textSecondary }]}>
              Find the QR code on the charger
            </Text>
          </View>
          <View style={styles.stepContainer}>
            <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={[styles.stepText, { color: theme.colors.textSecondary }]}>
              Tap the scan button above
            </Text>
          </View>
          <View style={styles.stepContainer}>
            <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={[styles.stepText, { color: theme.colors.textSecondary }]}>
              Point your camera at the QR code
            </Text>
          </View>
          <View style={styles.stepContainer}>
            <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <Text style={[styles.stepText, { color: theme.colors.textSecondary }]}>
              Complete payment and start charging
            </Text>
          </View>
        </View>
      </View>

      {/* Custom Scan Options Modal */}
      {showScanOptions && (
        <View style={[styles.modalOverlay, { backgroundColor: theme.colors.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
                Scan QR Code
              </Text>
              <TouchableOpacity onPress={handleCloseModal} style={[styles.closeButton, { backgroundColor: theme.colors.overlayLight }]}>
                <Text style={[styles.closeButtonText, { color: theme.colors.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.modalSubtitle, { color: theme.colors.textSecondary }]}>
              Choose how you want to scan the QR code
            </Text>

            <View style={styles.modalOptions}>
              <TouchableOpacity 
                style={[styles.optionButton, { borderColor: theme.colors.border }]}
                onPress={() => {
                  setShowScanOptions(false);
                  handleTakePhoto();
                }}
              >
                <View style={[styles.optionIcon, { backgroundColor: theme.colors.overlayDark }]}>
                  <Text style={styles.optionIconText}>📷</Text>
                </View>
                <View style={styles.optionContent}>
                  <Text style={[styles.optionText, { color: theme.colors.textPrimary }]}>Take Photo</Text>
                  <Text style={[styles.optionDescription, { color: theme.colors.textSecondary }]}>Use camera to scan QR code</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.optionButton, { borderColor: theme.colors.border }]}
                onPress={() => {
                  setShowScanOptions(false);
                  handleSelectFromGallery();
                }}
              >
                <View style={[styles.optionIcon, { backgroundColor: theme.colors.overlayDark }]}>
                  <Text style={styles.optionIconText}>🖼️</Text>
                </View>
                <View style={styles.optionContent}>
                  <Text style={[styles.optionText, { color: theme.colors.textPrimary }]}>Choose from Gallery</Text>
                  <Text style={[styles.optionDescription, { color: theme.colors.textSecondary }]}>Select existing photo</Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.cancelButton, { borderColor: theme.colors.border }]}
              onPress={handleCloseModal}
            >
              <Text style={[styles.cancelButtonText, { color: theme.colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
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
  },
  scanButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scanButtonGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: '#00ff00',
    shadowColor: '#00ff00',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  scanButtonInner: {
    alignItems: 'center',
    zIndex: 1,
  },
  scanIcon: {
    fontSize: 48,
    marginBottom: 8,
    color: '#1a1a1a',
  },
  scanText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // This will be themed dynamically
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: '85%',
    maxWidth: 400,
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // This will be themed dynamically
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalOptions: {
    gap: 16,
    marginBottom: 24,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'transparent',
    marginBottom: 12,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)', // This will be themed dynamically
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionIconText: {
    fontSize: 20,
  },
  optionContent: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  cancelButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
