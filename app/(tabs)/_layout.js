import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../../hooks/auth";
import SignInScreen from "../sign-in";
import SignUpScreen from "../sign-up";
import VerifyEmailScreen from "../verify-email";

const TAB_ICONS = {
  "meal-plans": ["calendar-outline", "calendar"],
  "grocery-lists": ["list-outline", "list"],
  recipes: ["search-outline", "search"],
  favorites: ["heart-outline", "heart"],
  profile: ["person-circle-outline", "person-circle"],
};

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        if (!TAB_ICONS[route.name]) return null;
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const iconNames = TAB_ICONS[route.name];
        const iconName = isFocused ? iconNames[1] : iconNames[0];
        const color = isFocused ? "#FF6B6B" : "#888888";
        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={() => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
            style={styles.tabButton}
            activeOpacity={0.7}
          >
            <Ionicons name={iconName} size={32} color={color} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    height: 56,
    paddingTop: 0,
    paddingHorizontal: 12,
    width: "100%",
    borderTopWidth: 2,
    borderTopColor: "#222",
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});

function AuthGate({ children }) {
  const {
    user,
    loading,
    needsVerification,
    pendingVerificationEmail,
    resetAuth,
    triggerEmailVerification,
  } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (needsVerification || (user && !user.email_verified)) {
    const email = user?.email || pendingVerificationEmail;
    return (
      <VerifyEmailScreen
        email={email}
        onNavigateToSignIn={resetAuth}
        onVerificationSuccess={() => {}}
      />
    );
  }

  if (!user) {
    if (showSignUp) {
      return (
        <SignUpScreen
          onNavigateToSignIn={() => setShowSignUp(false)}
          onSignUpSuccess={() => setShowSignUp(false)}
          onVerificationNeeded={() => {}}
        />
      );
    }
    return (
      <SignInScreen
        onNavigateToSignUp={() => setShowSignUp(true)}
        onSignInSuccess={() => {}}
        onVerificationNeeded={(email) => triggerEmailVerification(email)}
      />
    );
  }

  return children;
}

export default function TabsLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#1a1a1a" translucent={false} />
      <AuthGate>
        <Tabs
          tabBar={(props) => <CustomTabBar {...props} />}
          screenOptions={{
            tabBarStyle: { backgroundColor: "#1a1a1a" },
            headerShown: false,
          }}
        >
          <Tabs.Screen name="meal-plans" />
          <Tabs.Screen name="grocery-lists" />
          <Tabs.Screen name="recipes" />
          <Tabs.Screen name="favorites" />
          <Tabs.Screen name="profile" />
        </Tabs>
      </AuthGate>
    </>
  );
}
