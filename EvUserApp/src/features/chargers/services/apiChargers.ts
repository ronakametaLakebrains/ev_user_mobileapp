import { get } from '../../../services/api/api';

export interface Charger {
  charger_id: number;
  model: string;
  name: string;
  manufacturer: string;
  serial_number: string;
  manufacturing_date: string;
  power_capacity: number;
  power_consumption: number;
  revenue: number;
  status: string;
  last_heartbeat: string;
  firmware_version: string;
  warranty_period: string;
  service_contacts: string;
  safety_cert_url: string;
  compliance_cert_url: string;
  testing_record_url: string;
  invoice_url: string;
  latitude: number;
  longitude: number;
  owner_id: number;
  tariff_id: number;
  createdAt: string;
  _count: {
    Connector: number;
  };
  station_name: string;
  total_power_consumption: number;
  total_revenue: number;
}

export interface ChargersResponse {
  success: boolean;
  chargers: Charger[];
}

export const getChargers = async (): Promise<ChargersResponse> => {
  try {
    console.log('=== CHARGERS API DEBUG ===');
    console.log('Making API request to: /chargers');

    const data = await get<ChargersResponse>('/chargers');

    console.log('Response data:', JSON.stringify(data, null, 2));
    console.log('=== CHARGERS API SUCCESS ===');
    return data;
  } catch (error: unknown) {
    console.error('=== CHARGERS API ERROR ===');
    console.error('Chargers API error:', error);
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

    console.error('=== END CHARGERS API ERROR ===');
    throw error;
  }
};
