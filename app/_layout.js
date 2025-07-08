import { Stack } from "expo-router";
import React from "react";
import { AuthProvider } from "../hooks/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaView
        edges={["top", "bottom"]}
        style={{ flex: 1, backgroundColor: "#1a1a1a" }}
      >
        <StatusBar
          style="light"
          backgroundColor="#1a1a1a"
          translucent={false}
        />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </SafeAreaView>
    </AuthProvider>
  );
}
