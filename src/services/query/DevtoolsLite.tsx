import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { queryClient } from './client';
import { useTheme } from '../../theme';

type QueryInfo = {
  key: unknown[];
  status: string;
};

export function QueryDevtoolsLite() {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [queries, setQueries] = useState<QueryInfo[]>([]);

  useEffect(() => {
    function snapshot() {
      const all = queryClient.getQueryCache().getAll();
      const mapped: QueryInfo[] = all.map((q: any) => ({ key: q.queryKey as unknown[], status: q.state?.status ?? 'unknown' }));
      setQueries(mapped);
    }

    snapshot();
    const unsubscribe = queryClient.getQueryCache().subscribe(() => snapshot());
    return () => {
      unsubscribe();
    };
  }, []);

  const total = queries.length;
  const fetching = useMemo(() => queries.filter(q => q.status === 'pending').length, [queries]);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.fab, { backgroundColor: theme.colors.primary }, pressed ? { opacity: 0.9 } : undefined]}
        accessibilityLabel="Open React Query Devtools"
      >
        <Text style={{ color: '#fff', fontWeight: '700' }}>RQ</Text>
      </Pressable>
      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <View style={[styles.modalBackdrop]}>
          <View style={[styles.sheet, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}> 
            <View style={[styles.header, { borderColor: theme.colors.border }]}> 
              <Text style={[styles.headerText, { color: theme.colors.textPrimary }]}>React Query (total: {total}, pending: {fetching})</Text>
              <Pressable onPress={() => setOpen(false)}>
                <Text style={{ color: theme.colors.accent, fontWeight: '700' }}>Close</Text>
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={{ padding: 12 }}>
              {queries.map((q, idx) => (
                <View key={idx} style={[styles.item, { borderColor: theme.colors.border }]}> 
                  <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>{JSON.stringify(q.key)}</Text>
                  <Text style={{ color: theme.colors.textPrimary, fontWeight: '700' }}>{q.status}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: { position: 'absolute', right: 16, bottom: 24, width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', elevation: 4 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'flex-end' },
  sheet: { maxHeight: '70%', borderTopLeftRadius: 16, borderTopRightRadius: 16, borderWidth: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  headerText: { fontSize: 16, fontWeight: '700' },
  item: { paddingVertical: 10, paddingHorizontal: 8, borderBottomWidth: StyleSheet.hairlineWidth },
});


