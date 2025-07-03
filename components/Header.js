import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "./Text";

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
  style,
  ...props
}) => {
  return (
    <View
      style={[styles.header, { marginTop, marginBottom }, style]}
      {...props}
    >
      <Text
        variant="title"
        size={titleSize}
        color={titleColor}
        style={[styles.title, { textAlign }]}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          variant="subtitle"
          size={subtitleSize}
          color={subtitleColor}
          style={[styles.subtitle, { textAlign }]}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 40,
  },
  title: {
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 0,
  },
});

export default Header;
