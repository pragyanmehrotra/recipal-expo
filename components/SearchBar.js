import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SearchBar({
  value,
  onChangeText,
  onSubmit,
  placeholder,
  style,
  inputStyle,
}) {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name="search" size={20} color="#bbb" style={styles.icon} />
      <TextInput
        style={[styles.input, inputStyle]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || "Search recipes..."}
        placeholderTextColor="#888"
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {!!value && (
        <TouchableOpacity
          onPress={() => onChangeText("")}
          style={styles.clearBtn}
          hitSlop={8}
        >
          <Ionicons name="close-circle" size={18} color="#bbb" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#232323",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 18,
    marginTop: 8,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 0,
  },
  clearBtn: {
    marginLeft: 6,
  },
});
