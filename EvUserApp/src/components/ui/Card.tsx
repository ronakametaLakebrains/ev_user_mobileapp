import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

type CardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg' | 'none';
};

export function Card({ children, style, padding = 'md', shadow = 'sm' }: CardProps) {
  const { theme } = useTheme();

  const getPadding = () => {
    switch (padding) {
      case 'sm':
        return theme.spacing.md;
      case 'lg':
        return theme.spacing.xl;
      case 'md':
      default:
        return theme.spacing.lg;
    }
  };

  const getShadow = () => {
    if (shadow === 'none') return {};
    return theme.shadows[shadow];
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.cardBorder,
          borderRadius: theme.radius.lg,
          padding: getPadding(),
        },
        getShadow(),
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
});

