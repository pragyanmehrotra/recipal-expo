import React from "react";
import { View, StyleSheet } from "react-native";

const Container = ({
  children,
  padding = "medium",
  backgroundColor = "primary",
  style,
  ...props
}) => {
  const containerStyle = [
    styles.container,
    styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`],
    styles[
      `bg${backgroundColor.charAt(0).toUpperCase() + backgroundColor.slice(1)}`
    ],
    style,
  ];

  return (
    <View style={containerStyle} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Padding variants
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: 12,
  },
  paddingMedium: {
    padding: 20,
  },
  paddingLarge: {
    padding: 24,
  },
  // Background variants
  bgPrimary: {
    backgroundColor: "#1a1a1a",
  },
  bgSecondary: {
    backgroundColor: "#2a2a2a",
  },
  bgTransparent: {
    backgroundColor: "transparent",
  },
});

export default Container;
