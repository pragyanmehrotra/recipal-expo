import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "./Text";

const Placeholder = ({
  message = "Coming soon...",
  size = "large",
  color = "muted",
  style,
  ...props
}) => {
  return (
    <View style={[styles.placeholder, style]} {...props}>
      <Text
        variant="body"
        size={size}
        color={color}
        style={styles.placeholderText}
      >
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    textAlign: "center",
  },
});

export default Placeholder;
