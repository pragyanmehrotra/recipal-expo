import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Text from "./Text";
import { Ionicons } from "@expo/vector-icons";

const Header = ({
  title,
  subtitle,
  titleSize = "xxlarge",
  subtitleSize = "medium",
  titleColor = "primary",
  subtitleColor = "secondary",
  textAlign = "center",
  marginTop = 60,
  marginBottom = 40,
  leftIcon,
  onLeftPress,
  style,
  ...props
}) => {
  return (
    <View
      style={[styles.headerRow, { marginTop, marginBottom }, style]}
      {...props}
    >
      {leftIcon && (
        <TouchableOpacity
          onPress={onLeftPress}
          style={styles.leftIcon}
          hitSlop={{ top: 12, left: 12, bottom: 12, right: 12 }}
        >
          <Ionicons name="arrow-back" size={28} color="#FF6B6B" />
        </TouchableOpacity>
      )}
      <View style={styles.headerContent}>
        <Text
          variant="title"
          size={titleSize}
          color={titleColor}
          style={[styles.title, { textAlign: "center" }]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            variant="subtitle"
            size={subtitleSize}
            color={subtitleColor}
            style={[styles.subtitle, { textAlign: "center" }]}
          >
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    marginBottom: 40,
    minHeight: 80,
    justifyContent: "center",
  },
  leftIcon: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 2,
    padding: 2,
  },
  headerContent: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  title: {
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 0,
  },
});

export default Header;
