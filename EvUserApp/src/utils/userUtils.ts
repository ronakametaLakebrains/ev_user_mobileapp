import { queryClient } from '../services/query/client';

export interface CurrentUser {
  name: string;
  phone: string;
}

export const getCurrentUser = (): CurrentUser | null => {
  const userData = queryClient.getQueryData(['currentUser']) as
    | CurrentUser
    | undefined;
  return userData || null;
};

export const getCurrentUserPhone = (): string | null => {
  const user = getCurrentUser();
  return user?.phone || null;
};
