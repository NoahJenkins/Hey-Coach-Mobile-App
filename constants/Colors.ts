/**
 * Hey Coach App Color System
 * Modern, voice-first design with blue primary colors
 */

export const Colors = {
  light: {
    // Backgrounds
    background: '#FFFFFF',
    surface: '#F8FAFC',
    
    // Primary Blues
    primary: '#2563EB',
    primaryLight: '#3B82F6',
    primaryDark: '#1D4ED8',
    
    // Status Colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    
    // Text Colors
    text: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    
    // Borders & Dividers
    border: '#E2E8F0',
    
    // Tab Bar
    tint: '#2563EB',
    icon: '#64748B',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#2563EB',
  },
  dark: {
    // Backgrounds
    background: '#0F172A',
    surface: '#1E293B',
    
    // Primary Blues (lighter for dark mode)
    primary: '#60A5FA',
    primaryLight: '#93C5FD',
    primaryDark: '#3B82F6',
    
    // Status Colors (lighter for dark mode)
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    
    // Text Colors
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    
    // Borders & Dividers
    border: '#334155',
    
    // Tab Bar
    tint: '#60A5FA',
    icon: '#94A3B8',
    tabIconDefault: '#64748B',
    tabIconSelected: '#60A5FA',
  },
};

// Typography Scale
export const Typography = {
  hero: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h1: {
    fontSize: 28,
    fontWeight: '600' as const,
    lineHeight: 36,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '500' as const,
    lineHeight: 28,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
  },
};

// Spacing System
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border Radius
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

// Shadows
export const Shadows = {
  small: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};
