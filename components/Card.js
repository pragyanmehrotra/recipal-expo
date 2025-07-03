import React from "react";
import { View, StyleSheet } from "react-native";

const Card = ({
  children,
  padding = "medium",
  backgroundColor = "secondary",
  borderRadius = "medium",
  style,
  ...props
}) => {
  const cardStyle = [
    styles.card,
    styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`],
    styles[
      `bg${backgroundColor.charAt(0).toUpperCase() + backgroundColor.slice(1)}`
    ],
    styles[
      `radius${borderRadius.charAt(0).toUpperCase() + borderRadius.slice(1)}`
    ],
    style,
  ];

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderColor: "#404040",
    borderWidth: 1,
  },
  // Padding variants
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: 12,
  },
  paddingMedium: {
    padding: 16,
  },
  paddingLarge: {
    padding: 20,
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
  // Border radius variants
  radiusSmall: {
    borderRadius: 4,
  },
  radiusMedium: {
    borderRadius: 8,
  },
  radiusLarge: {
    borderRadius: 12,
  },
});

export default Card;
