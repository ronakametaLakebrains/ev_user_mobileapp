import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../services/api/api';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
  description: string;
  features: string[];
  popular: boolean;
  discount?: number;
  kwhLimit: number;
}

export interface UserSubscription {
  id: string;
  planId: string;
  planName: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  nextBillingDate?: string;
  usage: {
    kwhUsed: number;
    kwhLimit: number;
    sessionsCount: number;
  };
}

export interface SubscriptionResponse {
  success: boolean;
  subscription?: {
    id: string;
    short_url: string; // Redirect URL for completing subscription
    status: string;
    plan_id: string;
    entity: string;
    quantity: number;
    total_count: number;
    paid_count: number;
    remaining_count: number;
    created_at: number;
    customer_notify: boolean;
    notes: any[];
    current_start: any;
    current_end: any;
    ended_at: any;
    charge_at: any;
    start_at: any;
    end_at: any;
    auth_attempts: number;
    expire_by: any;
    has_scheduled_changes: boolean;
    change_scheduled_at: any;
    source: string;
  };
  message?: string;
  error?: string;
}

// Get available subscription plans
export function useSubscriptionPlans() {
  return useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: async (): Promise<SubscriptionPlan[]> => {
      const response = await apiClient.get('/subscription/plans');
      return response.data.plans;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get user's current subscription
export function useUserSubscription() {
  return useQuery({
    queryKey: ['userSubscription'],
    queryFn: async (): Promise<UserSubscription | null> => {
      try {
        const response = await apiClient.get('/subscription/current');
        return response.data.subscription;
      } catch (error: any) {
        if (error.response?.status === 404) {
          return null; // No active subscription
        }
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - increased to reduce refetches
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    enabled: true, // Explicitly enable the query
    notifyOnChangeProps: ['data', 'error'], // Only notify on data/error changes
  });
}

// Start subscription process
export function useStartSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<SubscriptionResponse> => {
      const response = await apiClient.get('/driver/start-subscribe');
      return response.data;
    },
    onSuccess: _data => {
      // Invalidate and refetch subscription data
      queryClient.invalidateQueries({ queryKey: ['userSubscription'] });
      queryClient.invalidateQueries({ queryKey: ['subscriptionPlans'] });
    },
  });
}

// Cancel subscription
export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post('/subscription/cancel');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSubscription'] });
    },
  });
}

// Update subscription (change plan)
export function useUpdateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ planId }: { planId: string }) => {
      const response = await apiClient.put('/subscription/update', {
        planId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSubscription'] });
      queryClient.invalidateQueries({ queryKey: ['subscriptionPlans'] });
    },
  });
}

// Get subscription usage
export function useSubscriptionUsage() {
  return useQuery({
    queryKey: ['subscriptionUsage'],
    queryFn: async () => {
      const response = await apiClient.get('/subscription/usage');
      return response.data.usage;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Get subscription history
export function useSubscriptionHistory() {
  return useQuery({
    queryKey: ['subscriptionHistory'],
    queryFn: async () => {
      const response = await apiClient.get('/subscription/history');
      return response.data.history;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Reactivate cancelled subscription
export function useReactivateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post('/subscription/reactivate');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSubscription'] });
    },
  });
}

// Update auto-renewal setting
export function useUpdateAutoRenewal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ autoRenew }: { autoRenew: boolean }) => {
      const response = await apiClient.put('/subscription/auto-renewal', {
        autoRenew,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSubscription'] });
    },
  });
}

// Check subscription status
export function useCheckSubscriptionStatus() {
  return useMutation({
    mutationFn: async (): Promise<SubscriptionResponse> => {
      const response = await apiClient.get('/driver/get-status');
      return response.data;
    },
  });
}
