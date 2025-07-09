import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Linking,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RecipeDetails() {
  const { url } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    setError(null);
    fetch(
      `${
        process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000"
      }/api/external/recipes/details?url=${encodeURIComponent(url)}`
    )
      .then(async (res) => {
        if (!res.ok)
          throw new Error((await res.json()).message || "Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setRecipe(data.recipe);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [url]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  // Show whatever data we have, even if error
  const hasAnyData =
    recipe &&
    (recipe.name ||
      recipe.title ||
      recipe.image ||
      (Array.isArray(recipe.recipeIngredients) &&
        recipe.recipeIngredients.length > 0) ||
      (Array.isArray(recipe.recipeInstructions) &&
        recipe.recipeInstructions.length > 0));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 24 }}
    >
      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
      {recipe?.image && (
        <Image source={{ uri: recipe.image }} style={styles.image} />
      )}
      <Text style={styles.title}>
        {recipe?.name || recipe?.title || "Recipe"}
      </Text>
      {recipe?.description && (
        <Text style={styles.desc}>{recipe.description}</Text>
      )}
      <View style={styles.metaRow}>
        {recipe?.cook_time && (
          <Text style={styles.meta}>Cook: {recipe.cook_time}</Text>
        )}
        {recipe?.prep_time && (
          <Text style={styles.meta}>Prep: {recipe.prep_time}</Text>
        )}
      </View>
      {Array.isArray(recipe?.recipeIngredients) &&
        recipe.recipeIngredients.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {recipe.recipeIngredients.map((ing, i) => (
              <Text key={i} style={styles.ingredient}>
                • {ing}
              </Text>
            ))}
          </View>
        )}
      {Array.isArray(recipe?.recipeInstructions) &&
        recipe.recipeInstructions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {recipe.recipeInstructions.map((step, i) => (
              <Text key={i} style={styles.instruction}>
                {i + 1}. {step}
              </Text>
            ))}
          </View>
        )}
      {/* Show extra details if present */}
      {recipe?.details && typeof recipe.details === "object" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More Details</Text>
          {Object.entries(recipe.details).map(([key, value]) => {
            if (
              [
                "name",
                "title",
                "description",
                "image",
                "cookTime",
                "prepTime",
                "recipeIngredients",
                "recipeInstructions",
                "url",
              ].includes(key)
            )
              return null;
            if (Array.isArray(value)) {
              return (
                <View key={key} style={{ marginBottom: 8 }}>
                  <Text style={styles.meta}>
                    <Text style={{ fontWeight: "bold" }}>{key}:</Text>{" "}
                    {value.join(", ")}
                  </Text>
                </View>
              );
            }
            if (typeof value === "object" && value !== null) {
              return (
                <View key={key} style={{ marginBottom: 8 }}>
                  <Text style={styles.meta}>
                    <Text style={{ fontWeight: "bold" }}>{key}:</Text>{" "}
                    {JSON.stringify(value)}
                  </Text>
                </View>
              );
            }
            return (
              <Text key={key} style={styles.meta}>
                <Text style={{ fontWeight: "bold" }}>{key}:</Text>{" "}
                {String(value)}
              </Text>
            );
          })}
        </View>
      )}
      {/* If we have no data or scraping failed, show a link to the original */}
      {(!hasAnyData || error) && url && (
        <Text style={styles.link} onPress={() => Linking.openURL(url)}>
          View original recipe (details may be missing)
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#181818",
    padding: 32,
  },
  backBtn: {
    marginBottom: 12,
    alignSelf: "flex-start",
    padding: 4,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 18,
    backgroundColor: "#222",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  desc: {
    color: "#ccc",
    fontSize: 16,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  meta: {
    color: "#aaa",
    fontSize: 15,
    marginRight: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  ingredient: {
    color: "#eee",
    fontSize: 16,
    marginBottom: 4,
  },
  instruction: {
    color: "#eee",
    fontSize: 16,
    marginBottom: 6,
  },
  link: {
    color: "#4fc3f7",
    fontSize: 16,
    marginTop: 18,
    textDecorationLine: "underline",
  },
  error: {
    color: "#ff5252",
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
  },
});
