import { useMutation } from '@tanstack/react-query';
import { post } from './api';

export type RequestOtpPayload = { phone: string };
export type RequestOtpResponse = {
  success: boolean;
  phone: string;
  message: string;
};

export type VerifyOtpPayload = { phone: string; otp: string };
export type VerifyOtpResponse = {
  success: boolean;
  token: string;
  name: string;
  validityDays: number;
  message: string;
};

export async function requestOtp(
  payload: RequestOtpPayload,
): Promise<RequestOtpResponse> {
  return post<RequestOtpResponse, RequestOtpPayload>('/driver/login', payload);
}

export async function verifyOtp(
  payload: VerifyOtpPayload,
): Promise<VerifyOtpResponse> {
  return post<VerifyOtpResponse, VerifyOtpPayload>(
    '/driver/verify-otp',
    payload,
  );
}

export function useRequestOtp() {
  return useMutation<RequestOtpResponse, Error, RequestOtpPayload>({
    mutationFn: async p => {
      const res = await requestOtp(p);
      if (!res?.success)
        throw new Error(res?.message || 'Failed to request OTP');
      return res;
    },
  });
}

export function useVerifyOtp() {
  return useMutation<VerifyOtpResponse, Error, VerifyOtpPayload>({
    mutationFn: async p => {
      const res = await verifyOtp(p);
      if (!res?.success)
        throw new Error(res?.message || 'OTP verification failed');
      return res;
    },
  });
}
