import React from "react";
import { Text as RNText, StyleSheet } from "react-native";

const Text = ({
  children,
  variant = "body",
  size = "medium",
  color = "primary",
  style,
  ...props
}) => {
  const textStyle = [
    styles.text,
    styles[variant],
    styles[size],
    styles[color],
    style,
  ];

  return (
    <RNText style={textStyle} {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "System",
  },
  // Variants
  title: {
    fontWeight: "bold",
  },
  subtitle: {
    fontWeight: "500",
  },
  body: {
    fontWeight: "normal",
  },
  caption: {
    fontWeight: "300",
  },
  // Sizes
  small: {
    fontSize: 14,
  },
  medium: {
    fontSize: 16,
  },
  large: {
    fontSize: 18,
  },
  xlarge: {
    fontSize: 24,
  },
  xxlarge: {
    fontSize: 28,
  },
  xxxlarge: {
    fontSize: 32,
  },
  // Colors
  primary: {
    color: "#ffffff",
  },
  secondary: {
    color: "#cccccc",
  },
  muted: {
    color: "#888888",
  },
  accent: {
    color: "#FF6B6B",
  },
  success: {
    color: "#4ECDC4",
  },
  warning: {
    color: "#FFA726",
  },
});

export default Text;
