import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';

type ScreenWrapperProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
};

export function ScreenWrapper({ children, style, backgroundColor }: ScreenWrapperProps) {
  const { theme } = useTheme();
  
  return (
    <SafeAreaView 
      style={[
        styles.container, 
        { backgroundColor: backgroundColor || theme.colors.background },
        style
      ]}
    >
      <View style={styles.content}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 10, // Reduced from 20 to 10
  },
});
