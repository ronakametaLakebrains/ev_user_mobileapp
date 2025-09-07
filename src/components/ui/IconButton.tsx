import React from 'react';
import { GestureResponderEvent, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

export type IconButtonProps = {
  onPress?: (event: GestureResponderEvent) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'surface' | 'ghost';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode; // icon
};

export function IconButton({ onPress, size = 'md', variant = 'surface', disabled = false, style, children }: IconButtonProps) {
  const { theme } = useTheme();

  const dimension = getDimension(theme, size);
  const bg = getBackground(theme, variant);
  const border = variant === 'surface' ? { borderWidth: StyleSheet.hairlineWidth, borderColor: theme.colors.border } : undefined;

  return (
    <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.base, { width: dimension, height: dimension, borderRadius: dimension / 2, backgroundColor: bg }, border, pressed ? styles.pressed : undefined, style]}>
      <View style={styles.center}>{children}</View>
    </Pressable>
  );
}

function getDimension(theme: ReturnType<typeof useTheme>['theme'], size: 'sm' | 'md' | 'lg') {
  switch (size) {
    case 'sm':
      return 32;
    case 'lg':
      return 48;
    case 'md':
    default:
      return 40;
  }
}

function getBackground(theme: ReturnType<typeof useTheme>['theme'], variant: 'primary' | 'surface' | 'ghost') {
  switch (variant) {
    case 'primary':
      return theme.colors.primary;
    case 'ghost':
      return 'transparent';
    case 'surface':
    default:
      return theme.colors.surface;
  }
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.85 },
});


