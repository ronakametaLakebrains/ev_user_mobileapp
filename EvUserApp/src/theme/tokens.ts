export type Theme = {
  colors: {
    background: string;
    surface: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    // Additional semantic colors
    card: string;
    cardBorder: string;
    inputBackground: string;
    inputBorder: string;
    inputPlaceholder: string;
    // New overlay colors for better dark mode support
    overlay: string;
    overlayLight: string;
    overlayDark: string;
    // Status colors
    statusReady: string;
    statusCharging: string;
    statusCompleted: string;
    statusError: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  radius: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    sizes: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      h1: number;
      h2: number;
      h3: number;
    };
    weights: {
      regular: '400' | 'normal';
      medium: '500' | '600' | 'bold';
      bold: '700' | 'bold';
    };
  };
  shadows: {
    sm: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    md: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    lg: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
};

export const lightTheme: Theme = {
  colors: {
    background: '#ffffff',
    surface: '#f8fafc',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    border: '#e2e8f0',
    primary: '#10b981', // Emerald green - represents sustainability
    secondary: '#3b82f6', // Blue - represents technology
    accent: '#f59e0b', // Amber - represents energy
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    card: '#ffffff',
    cardBorder: '#e2e8f0',
    inputBackground: '#f8fafc',
    inputBorder: '#cbd5e1',
    inputPlaceholder: '#94a3b8',
    // New overlay colors
    overlay: 'rgba(0, 0, 0, 0.6)',
    overlayLight: 'rgba(0, 0, 0, 0.1)',
    overlayDark: 'rgba(0, 0, 0, 0.05)',
    // Status colors
    statusReady: '#10b981',
    statusCharging: '#3b82f6',
    statusCompleted: '#059669',
    statusError: '#ef4444',
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
  radius: { xs: 4, sm: 6, md: 10, lg: 14, xl: 20 },
  typography: {
    sizes: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, h1: 28, h2: 24, h3: 20 },
    weights: { regular: 'normal', medium: '600', bold: 'bold' },
  },
  shadows: {
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export const darkTheme: Theme = {
  colors: {
    background: '#0f172a',
    surface: '#1e293b',
    textPrimary: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: '#334155',
    primary: '#10b981', // Keep the same green for consistency
    secondary: '#60a5fa', // Lighter blue for dark mode
    accent: '#fbbf24', // Lighter amber for dark mode
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
    card: '#1e293b',
    cardBorder: '#334155',
    inputBackground: '#0f172a',
    inputBorder: '#475569',
    inputPlaceholder: '#64748b',
    // New overlay colors for dark mode
    overlay: 'rgba(0, 0, 0, 0.8)',
    overlayLight: 'rgba(255, 255, 255, 0.1)',
    overlayDark: 'rgba(255, 255, 255, 0.05)',
    // Status colors
    statusReady: '#34d399',
    statusCharging: '#60a5fa',
    statusCompleted: '#10b981',
    statusError: '#f87171',
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
  radius: { xs: 4, sm: 6, md: 10, lg: 14, xl: 20 },
  typography: {
    sizes: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, h1: 28, h2: 24, h3: 20 },
    weights: { regular: 'normal', medium: '600', bold: 'bold' },
  },
  shadows: {
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};
