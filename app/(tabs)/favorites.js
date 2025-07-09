import React, { useEffect, useState } from "react";
import { FlatList, ActivityIndicator, View, Linking } from "react-native";
import { Container, Header } from "../../components";
import RecipeCard from "../../components/RecipeCard";
import { useFavoriteApi } from "../../api/index";
import { useRouter } from "expo-router";

// Helper to extract the first number from servings string
function extractServings(servingsField) {
  if (!servingsField || typeof servingsField !== "string") return null;
  const match = servingsField.match(/\d+/);
  if (match) return parseInt(match[0], 10);
  return null;
}

// Helper to parse ISO 8601 durations like PT35M, PT1H20M, PT45S
function parseIsoDuration(iso) {
  if (!iso || typeof iso !== "string" || !iso.startsWith("P")) return iso;
  // Example: PT1H20M, PT35M, PT45S
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return iso;
  const [, h, m, s] = match.map(Number);
  let out = [];
  if (h) out.push(`${h} hr`);
  if (m) out.push(`${m} min`);
  if (s && !h && !m) out.push(`${s} sec`);
  return out.length ? out.join(" ") : iso;
}

export default function FavoritesScreen() {
  const favoriteApi = useFavoriteApi();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState({});
  const router = useRouter();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await favoriteApi.listFavorites();
        setRecipes(data.favorites);
      } catch (e) {
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleToggleFavorite = async (id) => {
    setRemoving((r) => ({ ...r, [id]: true }));
    try {
      await favoriteApi.removeFavorite(id);
      setRecipes((rs) => rs.filter((r) => r.id !== id));
    } catch {}
    setRemoving((r) => ({ ...r, [id]: false }));
  };

  return (
    <Container>
      <Header
        title="Favorites"
        subtitle="Your saved recipes"
        titleSize="xxlarge"
        subtitleSize="medium"
      />
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#FF6B6B"
          style={{ marginTop: 40 }}
        />
      ) : recipes.length === 0 ? (
        <View style={{ marginTop: 40, alignItems: "center" }}>
          <Header title="No favorites yet" titleSize="large" />
        </View>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <RecipeCard
              image={item.image}
              title={item.title || item.name || item.data?.name || "-"}
              cookTime={parseIsoDuration(
                item.cookTime ||
                  item.cook_time ||
                  item.readyInMinutes ||
                  item.ready_in_minutes ||
                  item.data?.cookTime ||
                  item.data?.cook_time ||
                  "-"
              )}
              servings={(() => {
                const raw =
                  item.servings || item.recipe_yield || item.data?.recipeYield;
                const s = extractServings(raw);
                return s ? s : "-";
              })()}
              isFavorite={true}
              onPress={() => (item.url ? Linking.openURL(item.url) : null)}
              onToggleFavorite={() => handleToggleFavorite(item.id)}
              disabled={removing[item.id]}
            />
          )}
        />
      )}
    </Container>
  );
}
