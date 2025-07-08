import React from "react";
import { TextInput, StyleSheet } from "react-native";

const Input = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  style,
  ...props
}) => {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      placeholderTextColor="#888888"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#2a2a2a",
    borderColor: "#404040",
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "System",
    letterSpacing: 0,
  },
});

export default Input;
