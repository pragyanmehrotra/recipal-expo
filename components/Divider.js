import React from "react";
import { View, StyleSheet } from "react-native";

const Divider = ({
  orientation = "horizontal",
  color = "border",
  thickness = 1,
  margin = "medium",
  style,
  ...props
}) => {
  const dividerStyle = [
    styles.divider,
    styles[orientation],
    styles[`color${color.charAt(0).toUpperCase() + color.slice(1)}`],
    styles[`thickness${thickness}`],
    styles[`margin${margin.charAt(0).toUpperCase() + margin.slice(1)}`],
    style,
  ];

  return <View style={dividerStyle} {...props} />;
};

const styles = StyleSheet.create({
  divider: {
    backgroundColor: "#404040",
  },
  // Orientation
  horizontal: {
    height: 1,
    width: "100%",
  },
  vertical: {
    width: 1,
    height: "100%",
  },
  // Colors
  colorBorder: {
    backgroundColor: "#404040",
  },
  colorMuted: {
    backgroundColor: "#888888",
  },
  colorAccent: {
    backgroundColor: "#FF6B6B",
  },
  // Thickness
  thickness1: {
    height: 1,
  },
  thickness2: {
    height: 2,
  },
  thickness3: {
    height: 3,
  },
  // Margins
  marginNone: {
    marginVertical: 0,
  },
  marginSmall: {
    marginVertical: 8,
  },
  marginMedium: {
    marginVertical: 16,
  },
  marginLarge: {
    marginVertical: 24,
  },
});

export default Divider;
