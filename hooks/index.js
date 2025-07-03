import { useAuth } from "@clerk/clerk-expo";
import { useState, useEffect } from "react";

// Hook to check if user is authenticated and verified
export function useAuthState() {
  const { isLoaded, isSignedIn, isSignedUp } = useAuth();

  return {
    isLoaded,
    isAuthenticated: isSignedIn && isSignedUp,
    isSignedIn,
    isSignedUp,
    needsVerification: isSignedUp && !isSignedIn,
  };
}

// Hook for managing loading states
export function useLoadingState(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);
  const [error, setError] = useState(null);

  const startLoading = () => {
    setIsLoading(true);
    setError(null);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  const setErrorState = (errorMessage) => {
    setError(errorMessage);
    setIsLoading(false);
  };

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setError,
    setErrorState,
  };
}

// Hook for managing user preferences
export function useUserPreferences() {
  const [preferences, setPreferences] = useState({
    theme: "light",
    notifications: true,
    dietaryRestrictions: [],
  });

  const updatePreference = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return {
    preferences,
    updatePreference,
  };
}
