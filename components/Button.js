import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const Button = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  style,
  textStyle,
  ...props
}) => {
  const buttonStyle = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const buttonTextStyle = [
    styles.buttonText,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      {...props}
    >
      <Text style={buttonTextStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  // Variants
  primary: {
    backgroundColor: "#FF6B6B",
  },
  secondary: {
    backgroundColor: "#4ECDC4",
  },
  accent: {
    backgroundColor: "#FFA726",
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: "#404040",
    borderWidth: 1,
  },
  ghost: {
    backgroundColor: "#404040",
  },
  // Sizes
  small: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  // Text styles
  buttonText: {
    fontWeight: "600",
  },
  primaryText: {
    color: "#ffffff",
  },
  secondaryText: {
    color: "#ffffff",
  },
  accentText: {
    color: "#ffffff",
  },
  outlineText: {
    color: "#ffffff",
  },
  ghostText: {
    color: "#ffffff",
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  // Disabled state
  disabled: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.8,
  },
});

export default Button;
