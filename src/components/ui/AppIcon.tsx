import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

type AppIconProps = {
  size?: number;
};

export function AppIcon({ size = 64 }: AppIconProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          backgroundColor: theme.colors.primary,
          borderRadius: size * 0.2,
        },
        theme.shadows.lg,
      ]}
    >
      <View style={[styles.innerCircle, { backgroundColor: '#ffffff' }]}>
        <View style={[styles.boltContainer, { backgroundColor: theme.colors.primary }]}>
          <View style={styles.bolt} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: '70%',
    height: '70%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boltContainer: {
    width: '60%',
    height: '60%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bolt: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#ffffff',
    transform: [{ rotate: '90deg' }],
  },
});

