import { queryClient } from '../query/client';
import { setAuthToken } from '../api/api';

export async function logoutUser() {
  try {
    // Clear auth token first
    await setAuthToken(undefined);

    // Clear all cached data
    await queryClient.invalidateQueries();
    await queryClient.removeQueries();

    // Clear user data specifically
    queryClient.setQueryData(['currentUser'], undefined);

    // Clear any other user-related queries
    queryClient.removeQueries({ queryKey: ['user'] });
    queryClient.removeQueries({ queryKey: ['profile'] });
    queryClient.removeQueries({ queryKey: ['transactions'] });
    queryClient.removeQueries({ queryKey: ['chargers'] });

    // Clear the entire cache to ensure clean state
    queryClient.clear();
  } catch (error) {
    console.error('Error during logout cleanup:', error);
    // Even if there's an error, try to clear the token
    try {
      await setAuthToken(undefined);
    } catch (tokenError) {
      console.error('Error clearing auth token:', tokenError);
    }
  }
}
