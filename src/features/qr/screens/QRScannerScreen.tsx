import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Image, AppState } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import { openUpiUri } from '../../payments/services/upi';
import RNQRGenerator from 'rn-qr-generator';

export function QRScannerScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWaitingForPayment, setIsWaitingForPayment] = useState(false);

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

  const handleTakePhoto = () => {
    launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
    }, (response) => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        Alert.alert('Error', 'Failed to take photo');
        return;
      }
      if (response.assets && response.assets[0] && response.assets[0].uri) {
        setSelectedImage(response.assets[0].uri);
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
        setSelectedImage(response.assets[0].uri);
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
      console.error('QR processing error:', error);
      Alert.alert(
        'Error',
        'Failed to process QR code. Please try again.',
        [
          { text: 'OK', onPress: () => setIsProcessing(false) }
        ]
      );
    }
  };

  const handleTestUPI = () => {
    const testUpiUri = 'upi://pay?pa=savekar@upi&pn=SaveKar%20Charging&cu=INR';
    
    Alert.alert(
      'Test UPI Payment',
      'This will open a test UPI payment. Do you want to proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Proceed', 
          onPress: async () => {
            try {
              await openUpiUri(testUpiUri);
              
              // Navigate to charger ID input screen immediately after opening UPI app
              navigation.goBack();
              navigation.navigate('ChargerIdInput' as never);
              
            } catch (error) {
              Alert.alert('Error', 'Failed to open UPI app. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Text style={[styles.closeButtonText, { color: theme.colors.textPrimary }]}>✕</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Scan Charger QR Code
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {selectedImage && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          </View>
        )}

        {isProcessing ? (
          <View style={styles.processingContainer}>
            <Text style={[styles.processingText, { color: theme.colors.textPrimary }]}>
              Processing QR code...
            </Text>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.colors.primary }]} 
              onPress={handleTakePhoto}
            >
              <Text style={[styles.buttonText, { color: 'white' }]}>
                📸 Take Photo of QR Code
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.colors.background, borderColor: theme.colors.primary, borderWidth: 1 }]} 
              onPress={handleSelectFromGallery}
            >
              <Text style={[styles.buttonText, { color: theme.colors.primary }]}>
                🖼️ Select from Gallery
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.colors.background, borderColor: theme.colors.textSecondary, borderWidth: 1 }]} 
              onPress={handleTestUPI}
            >
              <Text style={[styles.buttonText, { color: theme.colors.textSecondary }]}>
                🧪 Test UPI Payment
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
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
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  selectedImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  buttonContainer: {
    gap: 15,
  },
  actionButton: {
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
  processingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingText: {
    fontSize: 18,
    fontWeight: '500',
  },
});
