import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

export type DividerProps = {
  inset?: boolean | number;
  style?: ViewStyle | ViewStyle[];
};

export function Divider({ inset = false, style }: DividerProps) {
  const { theme } = useTheme();
  const marginLeft = typeof inset === 'number' ? inset : inset ? theme.spacing.xl : 0;

  return <View style={[styles.base, { backgroundColor: theme.colors.border, marginLeft }, style]} />;
}

const styles = StyleSheet.create({
  base: { height: StyleSheet.hairlineWidth, width: '100%' },
});


