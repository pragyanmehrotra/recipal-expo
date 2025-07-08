import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] =
    useState(null);

  useEffect(() => {
    // Load JWT and user from SecureStore on mount
    (async () => {
      const token = await SecureStore.getItemAsync("jwt");
      if (token) {
        setJwt(token);
        // Optionally decode JWT for user info, or fetch profile
        const userInfo = await fetchUserProfile(token);
        setUser(userInfo);
      }
      setLoading(false);
    })();
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 403 && data.needsVerification) {
          setNeedsVerification(true);
          setPendingVerificationEmail(email);
          return {
            success: false,
            error: data.message,
            needsVerification: true,
          };
        }
        throw new Error(data.error || "Sign in failed");
      }
      await SecureStore.setItemAsync("jwt", data.token);
      setJwt(data.token);
      setUser(data.user);
      setNeedsVerification(false);
      setPendingVerificationEmail(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, name) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Sign up failed");

      // Store temporary token for verification
      await SecureStore.setItemAsync("jwt", data.token);
      setJwt(data.token);
      setUser(data.user);
      setNeedsVerification(true);
      return { success: true, needsVerification: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (email, code) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/verify-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Verification failed");

      // Store permanent token
      await SecureStore.setItemAsync("jwt", data.token);
      setJwt(data.token);
      setUser(data.user);
      setNeedsVerification(false);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async (email) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/resend-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to resend verification");
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync("jwt");
    setJwt(null);
    setUser(null);
    setNeedsVerification(false);
    setPendingVerificationEmail(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const resetAuth = async () => {
    await SecureStore.deleteItemAsync("jwt");
    setJwt(null);
    setUser(null);
    setNeedsVerification(false);
    setPendingVerificationEmail(null);
  };

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/user/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        // If token is invalid/expired, clear it
        if (response.status === 401) {
          await SecureStore.deleteItemAsync("jwt");
          setJwt(null);
        }
        throw new Error(data.error || "Failed to fetch profile");
      }
      return data.user;
    } catch {
      return null;
    }
  };

  // Helper to manually trigger email verification flow
  const triggerEmailVerification = (email) => {
    setNeedsVerification(true);
    setPendingVerificationEmail(email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        jwt,
        loading,
        needsVerification,
        pendingVerificationEmail,
        signIn,
        signUp,
        signOut,
        updateUser,
        verifyEmail,
        resendVerification,
        resetAuth,
        triggerEmailVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
