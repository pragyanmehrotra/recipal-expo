// Theme constants
export * from "./theme";

// App Colors (Tamagui Theme Compatible)
export const COLORS = {
  primary: "#FF6B6B",
  secondary: "#4ECDC4",
  accent: "#FFA726",
  background: "#1a1a1a",
  backgroundHover: "#2a2a2a",
  backgroundPress: "#3a3a3a",
  backgroundFocus: "#2a2a2a",
  borderColor: "#404040",
  text: "#ffffff",
  textSecondary: "#cccccc",
  textTertiary: "#888888",
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#F44336",
  // Dark theme colors
  dark: {
    background: "#1a1a1a",
    backgroundHover: "#2a2a2a",
    backgroundPress: "#3a3a3a",
    backgroundFocus: "#2a2a2a",
    borderColor: "#404040",
    color: "#ffffff",
    colorHover: "#f0f0f0",
    colorPress: "#e0e0e0",
    colorFocus: "#f0f0f0",
    placeholderColor: "#888888",
  },
  // Light theme colors (for future use)
  light: {
    background: "#ffffff",
    backgroundHover: "#f5f5f5",
    backgroundPress: "#e0e0e0",
    backgroundFocus: "#f5f5f5",
    borderColor: "#e0e0e0",
    color: "#333333",
    colorHover: "#000000",
    colorPress: "#666666",
    colorFocus: "#000000",
    placeholderColor: "#999999",
  },
};

// API Configuration
export const API_CONFIG = {
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000",
  endpoints: {
    // User endpoints
    profile: "/api/user/profile",

    // Recipe endpoints
    recipes: "/api/external/recipes",
    userRecipes: "/api/user/recipes",

    // Meal plan endpoints
    mealPlans: "/api/meal-plans",

    // Grocery list endpoints
    groceryLists: "/api/grocery-lists",

    // Favorite endpoints
    favorites: "/api/user/favorites",

    // Notification endpoints
    notifications: "/api/notifications",

    // Payment endpoints
    payments: "/api/payments",
  },
  headers: {
    "Content-Type": "application/json",
  },
};

// App Configuration
export const APP_CONFIG = {
  name: "ReciPal",
  version: "1.0.0",
  description: "Your personal meal planner",
  theme: "dark", // Default theme
};

// Storage Keys
export const STORAGE_KEYS = {
  userPreferences: "user_preferences",
  recentSearches: "recent_searches",
  offlineRecipes: "offline_recipes",
  theme: "app_theme",
};

// Tamagui Configuration
export const TAMAGUI_CONFIG = {
  defaultTheme: "dark",
  themes: {
    dark: {
      background: "#1a1a1a",
      backgroundHover: "#2a2a2a",
      backgroundPress: "#3a3a3a",
      backgroundFocus: "#2a2a2a",
      borderColor: "#404040",
      color: "#ffffff",
      colorHover: "#f0f0f0",
      colorPress: "#e0e0e0",
      colorFocus: "#f0f0f0",
      placeholderColor: "#888888",
    },
  },
};
