import { useMutation } from '@tanstack/react-query';
import { post } from '../../../services/api/api';

export type SignupPayload = {
  phone: string;
  name?: string;
  otp: string;
};

export type SignupResponse = {
  success: boolean;
  name: string;
  token: string;
  validityDays: number;
};

export async function signupDriver(
  payload: SignupPayload,
): Promise<SignupResponse> {
  return post<SignupResponse, SignupPayload>('/driver/signup', payload);
}

export function useSignupDriver() {
  return useMutation<SignupResponse, unknown, SignupPayload>({
    mutationFn: signupDriver,
  });
}
