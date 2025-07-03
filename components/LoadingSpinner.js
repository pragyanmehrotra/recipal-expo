import React from "react";
import { Text } from "react-native";
export default function LoadingSpinner({ message = "Loading..." }) {
  return <Text>{message}</Text>;
}
