import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Linking,
  RefreshControl,
} from "react-native";
import { Container, Header } from "../../components";
import SearchBar from "../../components/SearchBar";
import RecipeCard from "../../components/RecipeCard";
import { useRecipeApi, useFavoriteApi } from "../../api/index";
import { useRouter } from "expo-router";
import LoadingSpinner from "../../components/LoadingSpinner";

const numColumns = 2;

function getRecipeId(recipe) {
  return recipe.id;
}

function parseIsoDuration(iso) {
  if (!iso || typeof iso !== "string" || !iso.startsWith("P")) return iso;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return iso;
  const [, h, m, s] = match.map(Number);
  let out = [];
  if (h) out.push(`${h} hr`);
  if (m) out.push(`${m} min`);
  if (s && !h && !m) out.push(`${s} sec`);
  return out.length ? out.join(" ") : iso;
}

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
  const offsetRef = useRef(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const recipeApi = useRecipeApi();
  const favoriteApi = useFavoriteApi();
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const PAGE_SIZE = 10;

  useEffect(() => {
    (async () => {
      try {
        const data = await favoriteApi.listFavorites();
        setFavoriteIds(new Set(data.favorites.map((r) => r.id)));
      } catch (e) {}
    })();
  }, []);

  useEffect(() => {
    if (loading || isFetchingMore) return;
    setRecipes([]);
    if (search.trim()) {
      offsetRef.current = 0;
      setHasMore(true);
      fetchRecipes(search.trim(), 0, true);
    } else {
      fetchRandomRecipes(true);
    }
  }, [search]);

  const fetchRandomRecipes = async (replace = false) => {
    if (loading || isFetchingMore) return;
    if (replace) setLoading(true);
    else setIsFetchingMore(true);
    setError(null);
    try {
      const data = await recipeApi.searchRecipes("", { number: PAGE_SIZE });
      const newRecipes = data.recipes || data.results || [];
      setRecipes(replace ? newRecipes : [...recipes, ...newRecipes]);
    } catch (e) {
      setError("Failed to load recipes");
      setHasMore(false);
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
      setHasMore(false);
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

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (search.trim()) {
        offsetRef.current = 0;
        setHasMore(true);
        await fetchRecipes(search.trim(), 0, true);
      } else {
        await fetchRandomRecipes(true);
      }
    } finally {
      setRefreshing(false);
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

    const servingsValue = (() => {
      const raw = item.servings || item.recipe_yield || item.data?.recipeYield;
      const s = extractServings(raw);
      return s !== null ? s.toString() : "-";
    })();

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
        servings={servingsValue}
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              ProgressViewComponent={LoadingSpinner}
              tintColor="#FF6B6B"
              title="Refreshing..."
            />
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
    paddingTop: 80, // Added to require longer pull-to-refresh
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
