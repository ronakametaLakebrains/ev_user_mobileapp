import { post } from '../../../services/api/api';

export interface MonitorRequest {
  chargerId: string;
  mobileNumber: string;
}

export interface Transaction {
  id: number;
  paymentId: string;
  transactionId: number;
  amount: number;
  connectorName: string;
  chargerName: string;
  etbc: number;
  status: string;
  ectn: number;
  initialMeterValue: number;
  mobileNumber: string | null;
  emailId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserInfo {
  mobileNumber: string | null;
  emailId: string;
}

export interface MonitorResponse {
  success: boolean;
  refund: boolean;
  refundAmount: number;
  transactions: Transaction[];
  chargerName: string;
  userInfo: UserInfo;
}

export const monitorCharger = async (
  request: MonitorRequest,
): Promise<MonitorResponse> => {
  try {
    console.log('=== MONITOR API DEBUG ===');
    console.log('Making API request to: /monitor');
    console.log('Request payload:', JSON.stringify(request, null, 2));
    console.log('Full URL will be: http://cms_dev.savekar.com/api/monitor');

    // Use just /monitor since base URL already includes /api
    const data = await post<MonitorResponse, MonitorRequest>(
      '/monitor',
      request,
    );

    console.log('Response data:', JSON.stringify(data, null, 2));
    console.log('=== MONITOR API SUCCESS ===');
    return data;
  } catch (error: unknown) {
    console.error('=== MONITOR API ERROR ===');
    console.error('Monitor charger API error:', error);
    console.error('Error type:', typeof error);

    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }

    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as any;
      console.error('Error response:', apiError.response);
      console.error('Error status:', apiError.response?.status);
      console.error('Error data:', apiError.response?.data);
    }

    console.error('Request details:', {
      url: '/monitor',
      payload: request,
    });
    console.error('=== END MONITOR API ERROR ===');
    throw error;
  }
};
