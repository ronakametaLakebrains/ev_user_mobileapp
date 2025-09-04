import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './app/navigation/RootNavigator';
import { ThemeProvider, useTheme } from './theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider, useIsFetching, useIsMutating } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { queryClient } from './services/query/client';
import { createAsyncStoragePersister } from './services/query/persist';
import { QueryDevtoolsLite } from './services/query/DevtoolsLite';
import { Loader } from './components';
import { initializeAuthToken } from './services/api/api';

function AppInner() {
  const { isDark } = useTheme();
  const inflightQueries = useIsFetching();
  const inflightMutations = useIsMutating();
  const isLoading = inflightQueries + inflightMutations > 0;

  useEffect(() => {
    // Initialize auth token on app start
    initializeAuthToken();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <RootNavigator />
      <Loader visible={isLoading} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: createAsyncStoragePersister() }}>
          <QueryClientProvider client={queryClient}>
            <AppInner />
            {__DEV__ ? <QueryDevtoolsLite /> : null}
          </QueryClientProvider>
        </PersistQueryClientProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}