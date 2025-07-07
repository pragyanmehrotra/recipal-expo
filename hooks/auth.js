import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [loading, setLoading] = useState(true);

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
      if (!response.ok) throw new Error(data.error || "Sign in failed");
      await SecureStore.setItemAsync("jwt", data.token);
      setJwt(data.token);
      setUser(data.user);
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
      await SecureStore.setItemAsync("jwt", data.token);
      setJwt(data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync("jwt");
    setJwt(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
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

  return (
    <AuthContext.Provider
      value={{ user, jwt, loading, signIn, signUp, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
