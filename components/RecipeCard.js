import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import Text from "./Text";
import { Ionicons } from "@expo/vector-icons";

const placeholderImage = require("../assets/icon.png");

function isValidImageUrl(url) {
  return typeof url === "string" && /^https?:\/\//.test(url);
}

export default function RecipeCard({
  image,
  title,
  cookTime,
  servings,
  isFavorite,
  onPress,
  onToggleFavorite,
}) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image
        source={isValidImageUrl(image) ? { uri: image } : placeholderImage}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <View style={{ flex: 1 }} />
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={16} color="#FF6B6B" />
            <Text style={styles.infoText}>{cookTime}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="people-outline" size={16} color="#4ECDC4" />
            <Text style={styles.infoText}>{servings}</Text>
          </View>
          <TouchableOpacity
            onPress={onToggleFavorite}
            style={styles.favoriteIcon}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={isFavorite ? "#e74c3c" : "#aaa"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#232323",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    marginHorizontal: 6,
    minWidth: 0,
    flex: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: "100%",
    aspectRatio: 1.3,
    backgroundColor: "#333",
  },
  content: {
    padding: 14,
    flex: 1,
    flexDirection: "column",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  infoText: {
    color: "#bbb",
    fontSize: 14,
    marginLeft: 4,
  },
  favoriteIcon: {
    marginLeft: "auto",
    padding: 4,
  },
});
