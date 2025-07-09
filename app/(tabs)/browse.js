import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Linking,
} from "react-native";
import { Container, Header } from "../../components";
import SearchBar from "../../components/SearchBar";
import RecipeCard from "../../components/RecipeCard";
import { useRecipeApi, useFavoriteApi } from "../../api/index";
import { useRouter } from "expo-router";

const numColumns = 2;

// Helper to get recipe id (always local DB id now)
function getRecipeId(recipe) {
  return recipe.id;
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

// Helper to extract the first number from servings string
function extractServings(servingsField) {
  if (!servingsField || typeof servingsField !== "string") return null;
  const match = servingsField.match(/\d+/);
  if (match) return parseInt(match[0], 10);
  return null;
}

export default function BrowseRecipesScreen() {
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Use a ref for offset to avoid async state issues
  const offsetRef = useRef(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Only for search
  const recipeApi = useRecipeApi();
  const favoriteApi = useFavoriteApi();
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const router = useRouter();

  const PAGE_SIZE = 10;

  // Load favorites on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await favoriteApi.listFavorites();
        // data.favorites is now an array of recipe objects
        setFavoriteIds(new Set(data.favorites.map((r) => r.id)));
      } catch (e) {
        // ignore
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Prevent fetch loop if already loading
    if (loading || isFetchingMore) return;
    setRecipes([]);
    if (search.trim()) {
      offsetRef.current = 0;
      setHasMore(true);
      fetchRecipes(search.trim(), 0, true);
    } else {
      fetchRandomRecipes(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const fetchRandomRecipes = async (replace = false) => {
    if (loading || isFetchingMore) return;
    if (replace) setLoading(true);
    else setIsFetchingMore(true);
    setError(null);
    try {
      const data = await recipeApi.searchRecipes("", {
        number: PAGE_SIZE,
      });
      const newRecipes = data.recipes || data.results || [];
      setRecipes(replace ? newRecipes : [...recipes, ...newRecipes]);
    } catch (e) {
      setError("Failed to load recipes");
      setHasMore(false); // Prevent infinite scroll on error
      if (replace) setRecipes([]);
    } finally {
      if (replace) setLoading(false);
      else setIsFetchingMore(false);
    }
  };

  const fetchRecipes = async (query, offset = 0, replace = false) => {
    if (loading || isFetchingMore) return;
    if (!hasMore && !replace) return;
    if (replace) setLoading(true);
    else setIsFetchingMore(true);
    setError(null);
    try {
      const data = await recipeApi.searchRecipes(query, {
        number: PAGE_SIZE,
        offset,
      });
      const newRecipes = data.results || data.recipes || [];
      setRecipes(replace ? newRecipes : [...recipes, ...newRecipes]);
      setHasMore(newRecipes.length === PAGE_SIZE);
    } catch (e) {
      setError("No recipes found");
      setHasMore(false); // Prevent infinite scroll on error
      if (replace) setRecipes([]);
    } finally {
      if (replace) setLoading(false);
      else setIsFetchingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (search.trim()) {
      offsetRef.current += PAGE_SIZE;
      fetchRecipes(search.trim(), offsetRef.current, false);
    } else {
      fetchRandomRecipes(false);
    }
  };

  const handleSearch = () => {
    offsetRef.current = 0;
    setRecipes([]);
    setHasMore(true);
    if (search.trim()) {
      fetchRecipes(search.trim(), 0, true);
    } else {
      fetchRandomRecipes(true);
    }
  };

  const renderRecipe = ({ item }) => {
    const id = getRecipeId(item);
    const isFavorite = favoriteIds.has(id);
    const handleToggleFavorite = async () => {
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
      try {
        if (isFavorite) {
          await favoriteApi.removeFavorite(id);
        } else {
          await favoriteApi.addFavorite(id);
        }
      } catch (e) {
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          if (isFavorite) next.add(id);
          else next.delete(id);
          return next;
        });
      }
    };
    return (
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
        isFavorite={isFavorite}
        onPress={() => (item.url ? Linking.openURL(item.url) : null)}
        onToggleFavorite={handleToggleFavorite}
      />
    );
  };

  return (
    <Container>
      <View style={styles.searchBarWrapper}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          onSubmit={handleSearch}
          placeholder="Search recipes by name, ingredient, etc."
          style={styles.searchBar}
          inputStyle={styles.searchInput}
        />
      </View>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#FF6B6B"
          style={{ marginTop: 40 }}
        />
      ) : error ? (
        <View style={styles.centered}>
          <Header title={error} titleSize="large" />
        </View>
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderRecipe}
          keyExtractor={(item, idx) => item.id?.toString() || item.title + idx}
          numColumns={numColumns}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Header title="No recipes found" titleSize="large" />
          }
          onEndReached={
            search.trim() ? (hasMore ? handleLoadMore : null) : handleLoadMore
          }
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingMore ? (
              <ActivityIndicator
                size="small"
                color="#FF6B6B"
                style={{ margin: 16 }}
              />
            ) : null
          }
        />
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 32,
    paddingHorizontal: 4,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  searchBarWrapper: {
    marginTop: 18,
    marginBottom: 10,
    paddingHorizontal: 0,
  },
  searchBar: {
    minHeight: 56,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  searchInput: {
    fontSize: 20,
    height: 32,
    paddingVertical: 0,
  },
});
