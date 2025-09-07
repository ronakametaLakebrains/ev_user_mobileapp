import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal as RNModal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme';

export type ModalType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

export interface ModalButton {
  text: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  style?: 'default' | 'destructive';
}

export interface ModalProps {
  visible: boolean;
  type: ModalType;
  title: string;
  message: string;
  buttons?: ModalButton[];
  onClose?: () => void;
  closeOnOverlayPress?: boolean;
  icon?: string;
  showIcon?: boolean;
}

const { width } = Dimensions.get('window');

export function Modal({
  visible,
  type,
  title,
  message,
  buttons = [],
  onClose,
  closeOnOverlayPress = true,
  icon,
  showIcon = true,
}: ModalProps) {
  const { theme } = useTheme();

  const getIconAndColor = () => {
    if (icon) {
      return {
        icon: icon as any,
        color: getTypeColor(),
      };
    }

    switch (type) {
      case 'success':
        return {
          icon: 'checkmark-circle' as const,
          color: theme.colors.success || theme.colors.primary,
        };
      case 'error':
        return {
          icon: 'close-circle' as const,
          color: theme.colors.error || '#FF4444',
        };
      case 'warning':
        return {
          icon: 'warning' as const,
          color: theme.colors.warning || theme.colors.accent,
        };
      case 'info':
        return {
          icon: 'information-circle' as const,
          color: theme.colors.primary,
        };
      case 'confirm':
        return {
          icon: 'help-circle' as const,
          color: theme.colors.accent,
        };
      default:
        return {
          icon: 'information-circle' as const,
          color: theme.colors.primary,
        };
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'success':
        return theme.colors.success || theme.colors.primary;
      case 'error':
        return theme.colors.error || '#FF4444';
      case 'warning':
        return theme.colors.warning || theme.colors.accent;
      case 'info':
        return theme.colors.primary;
      case 'confirm':
        return theme.colors.primary;
      default:
        return theme.colors.primary;
    }
  };

  const getButtonStyle = (button: ModalButton) => {
    const baseStyle = [styles.button];
    
    switch (button.variant) {
      case 'primary':
        return [
          ...baseStyle,
          { backgroundColor: getTypeColor() },
        ];
      case 'secondary':
        return [
          ...baseStyle,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1 },
        ];
      case 'outline':
        return [
          ...baseStyle,
          { backgroundColor: theme.colors.surface, borderColor: getTypeColor(), borderWidth: 1 },
        ];
      case 'danger':
        return [
          ...baseStyle,
          { backgroundColor: theme.colors.error || '#FF4444' },
        ];
      default:
        return [
          ...baseStyle,
          { backgroundColor: getTypeColor() },
        ];
    }
  };

  const getButtonTextStyle = (button: ModalButton) => {
    switch (button.variant) {
      case 'secondary':
        return { color: theme.colors.textPrimary || '#000000' };
      case 'outline':
        return { color: getTypeColor() || theme.colors.primary || '#007AFF' };
      case 'danger':
        return { color: theme.colors.surface || '#FFFFFF' };
      default:
        return { color: theme.colors.surface || '#FFFFFF' };
    }
  };

  const { icon: iconName, color: iconColor } = getIconAndColor();

  const handleOverlayPress = () => {
    if (closeOnOverlayPress && onClose) {
      onClose();
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleOverlayPress}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.dialog, { backgroundColor: theme.colors.surface }]}>
              {/* Icon */}
              {showIcon && (
                <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
                  <Ionicons name={iconName} size={48} color={iconColor} />
                </View>
              )}

              {/* Title */}
              <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                {title}
              </Text>

              {/* Message */}
              <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
                {message}
              </Text>

              {/* Buttons */}
              {buttons.length > 0 && (
                <View style={styles.buttonContainer}>
                  {buttons.map((button, index) => (
                    <TouchableOpacity
                      key={index}
                      style={getButtonStyle(button)}
                      onPress={button.onPress}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.buttonText, getButtonTextStyle(button)]}>
                        {button.text}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dialog: {
    width: Math.min(width - 40, 320),
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 30,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
