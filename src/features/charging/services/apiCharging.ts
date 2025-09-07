import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../services/api/api';

export interface StartChargingRequest {
  chargerId: string;
  connectorId: string;
}

export interface StartChargingResponse {
  success: boolean;
  message: string;
  sessionId?: string;
  status?: string;
  // Add other fields as needed based on API response
}

export function useStartCharging() {
  return useMutation({
    mutationFn: async (
      data: StartChargingRequest,
    ): Promise<StartChargingResponse> => {
      const response = await apiClient.post('/driver/start-charging', data);
      return response.data;
    },
  });
}
