import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

type LogoProps = {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
};

export function Logo({ size = 'md', showTagline = true }: LogoProps) {
  const { theme } = useTheme();

  const getSize = () => {
    switch (size) {
      case 'sm':
        return { logoSize: 32, fontSize: 16, taglineSize: 12 };
      case 'lg':
        return { logoSize: 80, fontSize: 32, taglineSize: 16 };
      case 'md':
      default:
        return { logoSize: 48, fontSize: 24, taglineSize: 14 };
    }
  };

  const { logoSize, fontSize, taglineSize } = getSize();

  return (
    <View style={styles.container}>
      <View style={[styles.logoContainer, { width: logoSize, height: logoSize }]}>
        <View style={[styles.circle, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.bolt, { color: '#ffffff', fontSize: fontSize * 0.6 }]}>⚡</Text>
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: theme.colors.textPrimary, fontSize }]}>
          ChargeKar
        </Text>
        {showTagline && (
          <Text style={[styles.tagline, { color: theme.colors.textSecondary, fontSize: taglineSize }]}>
            Power your journey
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center', // Center the entire logo component
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  circle: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  bolt: {
    fontWeight: 'bold',
  },
  textContainer: {
    // Removed flex: 1 to prevent stretching
  },
  title: {
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  tagline: {
    marginTop: 2,
    fontWeight: '500',
    opacity: 0.8,
  },
});
