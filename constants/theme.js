// Color Palette
export const colors = {
  // Primary colors
  primary: "#FF6B6B",
  secondary: "#4ECDC4",
  accent: "#FFA726",

  // Background colors
  background: "#1a1a1a",
  surface: "#2a2a2a",
  card: "#2a2a2a",

  // Text colors
  text: "#ffffff",
  textSecondary: "#cccccc",
  textMuted: "#888888",

  // Border colors
  border: "#404040",
  borderLight: "#505050",

  // Status colors
  success: "#4ECDC4",
  warning: "#FFA726",
  error: "#FF6B6B",
  info: "#4ECDC4",
};

// Typography
export const typography = {
  fontFamily: "System",
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 28,
    "4xl": 32,
    "5xl": 36,
  },
  fontWeights: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
};

// Border Radius
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Shadows
export const shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Button variants
export const buttonVariants = {
  primary: {
    backgroundColor: colors.primary,
    color: colors.text,
  },
  secondary: {
    backgroundColor: colors.secondary,
    color: colors.text,
  },
  accent: {
    backgroundColor: colors.accent,
    color: colors.text,
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: colors.border,
    borderWidth: 1,
    color: colors.text,
  },
  ghost: {
    backgroundColor: colors.border,
    color: colors.text,
  },
};

// Button sizes
export const buttonSizes = {
  small: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    fontSize: typography.fontSizes.sm,
  },
  medium: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: typography.fontSizes.md,
  },
  large: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    fontSize: typography.fontSizes.lg,
  },
};

// Input styles
export const inputStyles = {
  backgroundColor: colors.surface,
  borderColor: colors.border,
  borderWidth: 1,
  borderRadius: borderRadius.md,
  padding: spacing.lg,
  color: colors.text,
  fontSize: typography.fontSizes.md,
};

// Card styles
export const cardStyles = {
  backgroundColor: colors.card,
  borderColor: colors.border,
  borderWidth: 1,
  borderRadius: borderRadius.md,
  padding: spacing.lg,
};

// Container styles
export const containerStyles = {
  flex: 1,
  backgroundColor: colors.background,
  padding: spacing.xl,
};
