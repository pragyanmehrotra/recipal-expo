import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Container, Header } from "../../components";
import SearchBar from "../../components/SearchBar";
import RecipeCard from "../../components/RecipeCard";
import { useRecipeApi } from "../../api/index";

const numColumns = 2;

export default function BrowseRecipesScreen() {
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const recipeApi = useRecipeApi();

  const PAGE_SIZE = 20;

  useEffect(() => {
    setPage(0);
    setRecipes([]);
    setHasMore(true);
    if (search.trim()) {
      fetchRecipes(search.trim(), 0, true);
    } else {
      fetchRandomRecipes(0, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const fetchRandomRecipes = async (pageNum = 0, replace = false) => {
    if (loading || isFetchingMore) return;
    if (!hasMore && !replace) return;
    if (replace) setLoading(true);
    else setIsFetchingMore(true);
    setError(null);
    try {
      const data = await recipeApi.searchRecipes("", {
        number: PAGE_SIZE,
        offset: pageNum * PAGE_SIZE,
      });
      const newRecipes = data.recipes || data.results || [];
      setRecipes(replace ? newRecipes : [...recipes, ...newRecipes]);
      setHasMore(newRecipes.length === PAGE_SIZE);
      setPage(pageNum + 1);
    } catch (e) {
      setError("Failed to load recipes");
      if (replace) setRecipes([]);
    } finally {
      if (replace) setLoading(false);
      else setIsFetchingMore(false);
    }
  };

  const fetchRecipes = async (query, pageNum = 0, replace = false) => {
    if (loading || isFetchingMore) return;
    if (!hasMore && !replace) return;
    if (replace) setLoading(true);
    else setIsFetchingMore(true);
    setError(null);
    try {
      const data = await recipeApi.searchRecipes(query, {
        number: PAGE_SIZE,
        offset: pageNum * PAGE_SIZE,
      });
      const newRecipes = data.results || data.recipes || [];
      setRecipes(replace ? newRecipes : [...recipes, ...newRecipes]);
      setHasMore(newRecipes.length === PAGE_SIZE);
      setPage(pageNum + 1);
    } catch (e) {
      setError("No recipes found");
      if (replace) setRecipes([]);
    } finally {
      if (replace) setLoading(false);
      else setIsFetchingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (search.trim()) {
      fetchRecipes(search.trim(), page, false);
    } else {
      fetchRandomRecipes(page, false);
    }
  };

  const handleSearch = () => {
    setPage(0);
    setRecipes([]);
    setHasMore(true);
    if (search.trim()) {
      fetchRecipes(search.trim(), 0, true);
    } else {
      fetchRandomRecipes(0, true);
    }
  };

  const renderRecipe = ({ item }) => (
    <RecipeCard
      image={item.image}
      title={item.title}
      cookTime={item.readyInMinutes || item.ready_in_minutes}
      servings={item.servings}
      isFavorite={item.isFavorite}
      onPress={() => {}}
      onToggleFavorite={() => {}}
    />
  );

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
          onEndReached={hasMore ? handleLoadMore : null}
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
