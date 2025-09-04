import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';

export type LoaderProps = {
  visible: boolean;
  text?: string;
};

export function Loader({ visible, text }: LoaderProps) {
  const { theme } = useTheme();
  return (
    <Modal animationType="fade" visible={visible} transparent>
      <View style={styles.backdrop}>
        <View style={[styles.panel, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}> 
          <ActivityIndicator size="large" color={theme.colors.primary} />
          {text ? (
            <Text style={{ marginTop: 12, color: theme.colors.textSecondary }}>{text}</Text>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', alignItems: 'center', justifyContent: 'center' },
  panel: { minWidth: 140, borderWidth: 1, borderRadius: 12, paddingVertical: 20, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
});


