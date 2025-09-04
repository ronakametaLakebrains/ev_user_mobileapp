import React from 'react';
import { ActivityIndicator, GestureResponderEvent, Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent' | 'success' | 'warning' | 'error';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = {
  title?: string;
  children?: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
  accessibilityLabel?: string;
};

export function Button({
  title,
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  textStyle,
  testID,
  accessibilityLabel,
}: ButtonProps) {
  const { theme, isDark } = useTheme();

  const isDisabled = disabled || loading;

  const containerStyles: Array<StyleProp<ViewStyle>> = [
    styles.base,
    getPaddingForSize(theme, size),
    getVariantContainerStyle(theme, variant),
    getShadowStyle(theme, variant),
    fullWidth ? styles.fullWidth : undefined,
    isDisabled ? { opacity: 0.6 } : undefined,
    style,
  ];

  const textStyles: Array<StyleProp<TextStyle>> = [
    styles.text,
    { fontSize: getFontSizeForSize(theme, size), fontWeight: theme.typography.weights.bold },
    getVariantTextStyle(theme, variant, isDark),
    textStyle,
  ];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [containerStyles, pressed ? styles.pressed : undefined]}
      testID={testID}
    >
      <View style={styles.contentRow}>
        {leftIcon ? <View style={[styles.iconHolder, { marginRight: theme.spacing.sm }]}>{leftIcon}</View> : null}
        {loading ? (
          <ActivityIndicator size="small" color={getSpinnerColor(theme, variant)} />
        ) : (
          <Text style={textStyles} numberOfLines={1}>
            {children ?? title}
          </Text>
        )}
        {rightIcon ? <View style={[styles.iconHolder, { marginLeft: theme.spacing.sm }]}>{rightIcon}</View> : null}
      </View>
    </Pressable>
  );
}

function getVariantContainerStyle(theme: ReturnType<typeof useTheme>['theme'], variant: ButtonVariant): ViewStyle {
  switch (variant) {
    case 'primary':
      return { backgroundColor: theme.colors.primary, borderRadius: theme.radius.md };
    case 'secondary':
      return { backgroundColor: theme.colors.secondary, borderRadius: theme.radius.md };
    case 'accent':
      return { backgroundColor: theme.colors.accent, borderRadius: theme.radius.md };
    case 'success':
      return { backgroundColor: theme.colors.success, borderRadius: theme.radius.md };
    case 'warning':
      return { backgroundColor: theme.colors.warning, borderRadius: theme.radius.md };
    case 'error':
      return { backgroundColor: theme.colors.error, borderRadius: theme.radius.md };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
      };
    case 'ghost':
    default:
      return { backgroundColor: 'transparent', borderRadius: theme.radius.md };
  }
}

function getVariantTextStyle(theme: ReturnType<typeof useTheme>['theme'], variant: ButtonVariant, _isDark: boolean): TextStyle {
  switch (variant) {
    case 'primary':
    case 'secondary':
    case 'accent':
    case 'success':
    case 'warning':
    case 'error':
      return { color: '#ffffff' };
    case 'outline':
      return { color: theme.colors.textPrimary };
    case 'ghost':
    default:
      return { color: theme.colors.textPrimary };
  }
}

function getSpinnerColor(theme: ReturnType<typeof useTheme>['theme'], variant: ButtonVariant) {
  switch (variant) {
    case 'primary':
    case 'secondary':
    case 'accent':
    case 'success':
    case 'warning':
    case 'error':
      return '#ffffff';
    default:
      return theme.colors.textSecondary;
  }
}

function getShadowStyle(theme: ReturnType<typeof useTheme>['theme'], variant: ButtonVariant) {
  if (variant === 'ghost' || variant === 'outline') {
    return {};
  }
  return theme.shadows.sm;
}

function getPaddingForSize(theme: ReturnType<typeof useTheme>['theme'], size: ButtonSize): ViewStyle {
  switch (size) {
    case 'sm':
      return { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.lg };
    case 'lg':
      return { paddingVertical: theme.spacing.lg, paddingHorizontal: theme.spacing.xl };
    case 'md':
    default:
      return { paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.xl };
  }
}

function getFontSizeForSize(theme: ReturnType<typeof useTheme>['theme'], size: ButtonSize) {
  switch (size) {
    case 'sm':
      return theme.typography.sizes.sm;
    case 'lg':
      return theme.typography.sizes.lg;
    case 'md':
    default:
      return theme.typography.sizes.md;
  }
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  contentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  text: { textAlign: 'center' },
  pressed: { opacity: 0.9 },
  fullWidth: { alignSelf: 'stretch' },
  iconHolder: { alignItems: 'center', justifyContent: 'center' },
});


