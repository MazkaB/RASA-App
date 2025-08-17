// Professional Design System - Tourist App Indonesia

export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7', 
    500: '#059669',
    600: '#047857',
    700: '#065f46',
    900: '#064e3b',
  },
  
  // Neutral Colors
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  
  // Semantic Colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Background & Surface
  background: '#f8f9fc',
  surface: '#ffffff',
  surfaceElevated: '#ffffff',
  
  // Text Colors
  textPrimary: '#1a202c',
  textSecondary: '#64748b',
  textTertiary: '#94a3b8',
  textInverse: '#ffffff',
};

export const typography = {
  // Font Weights
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  // Font Sizes
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  // Line Heights
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Letter Spacing
  letterSpacing: {
    tight: -0.8,
    normal: 0,
    wide: 0.5,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: colors.neutral[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: colors.neutral[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.neutral[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: colors.neutral[500],
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
  },
};

// Component Styles
export const components = {
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius['2xl'],
    padding: spacing['3xl'],
    ...shadows.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  
  button: {
    primary: {
      backgroundColor: colors.primary[500],
      borderRadius: borderRadius['3xl'],
      paddingVertical: spacing.xl,
      paddingHorizontal: spacing['4xl'],
      ...shadows.md,
    },
    
    text: {
      color: colors.textInverse,
      fontSize: typography.sizes.base,
      fontWeight: typography.weights.bold,
      letterSpacing: typography.letterSpacing.wide,
    },
  },
  
  input: {
    container: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.sm,
      borderWidth: 2,
      borderColor: colors.neutral[200],
      ...shadows.sm,
    },
    
    text: {
      fontSize: typography.sizes.lg,
      color: colors.textPrimary,
      fontWeight: typography.weights.regular,
    },
  },
  
  header: {
    gradient: {
      colors: ['#667eea', '#764ba2'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    
    title: {
      fontSize: typography.sizes['3xl'],
      fontWeight: typography.weights.bold,
      color: colors.textInverse,
      letterSpacing: typography.letterSpacing.tight,
      textShadowColor: 'rgba(0,0,0,0.1)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    
    subtitle: {
      fontSize: typography.sizes.lg,
      color: 'rgba(255,255,255,0.95)',
      fontWeight: typography.weights.regular,
      lineHeight: typography.lineHeights.normal * typography.sizes.lg,
      letterSpacing: typography.letterSpacing.wide,
    },
  },
};

// Animation Presets
export const animations = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: 1000,
  },
  
  slideUp: {
    from: { transform: [{ translateY: 50 }], opacity: 0 },
    to: { transform: [{ translateY: 0 }], opacity: 1 },
    duration: 800,
  },
  
  scale: {
    from: { transform: [{ scale: 0.9 }], opacity: 0 },
    to: { transform: [{ scale: 1 }], opacity: 1 },
    duration: 600,
  },
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  components,
  animations,
};