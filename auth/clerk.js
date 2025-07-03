import { ClerkProvider } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import React from "react";

// TODO: Replace with your actual Clerk publishable key
export const CLERK_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  "<your-clerk-publishable-key>";

export function ClerkProviderWithConfig({ children }) {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={SecureStore}
    >
      {children}
    </ClerkProvider>
  );
}
