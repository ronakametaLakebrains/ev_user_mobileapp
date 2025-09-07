import { get } from '../../../services/api/api';

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

export interface TransactionHistoryResponse {
  success: boolean;
  count: number;
  transactions: Transaction[];
}

export const getTransactionHistory =
  async (): Promise<TransactionHistoryResponse> => {
    try {
      console.log('=== TRANSACTION HISTORY API DEBUG ===');
      console.log('Making API request to: /driver/transactions');

      const data = await get<TransactionHistoryResponse>(
        '/driver/transactions',
      );

      console.log('Response data:', JSON.stringify(data, null, 2));
      console.log('=== TRANSACTION HISTORY API SUCCESS ===');
      return data;
    } catch (error: unknown) {
      console.error('=== TRANSACTION HISTORY API ERROR ===');
      console.error('Transaction history API error:', error);
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

      console.error('=== END TRANSACTION HISTORY API ERROR ===');
      throw error;
    }
  };
