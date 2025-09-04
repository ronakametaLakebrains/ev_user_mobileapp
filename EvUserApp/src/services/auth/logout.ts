import { queryClient } from '../query/client';
import { setAuthToken } from '../api/api';

export async function logoutUser() {
  await setAuthToken(undefined);
  try {
    await queryClient.invalidateQueries();
    queryClient.removeQueries();
  } catch {}
  queryClient.setQueryData(['currentUser'], undefined);
}
