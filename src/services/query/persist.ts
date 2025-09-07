import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PersistQueryClientProvider,
  PersistQueryClientProviderProps,
} from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister as createRNPersister } from '@tanstack/query-async-storage-persister';

// A small wrapper to construct a React Native AsyncStorage persister
export function createAsyncStoragePersister() {
  return createRNPersister({
    storage: AsyncStorage,
    key: 'rq-cache',
    throttleTime: 1000,
  });
}

export type RQPersistProviderProps = Omit<
  PersistQueryClientProviderProps,
  'persistOptions'
> & {
  children: React.ReactNode;
};

export { PersistQueryClientProvider };
