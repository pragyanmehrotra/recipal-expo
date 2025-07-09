import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Modal,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import { Container, Button, Text, Input, Divider } from "../../components";
import { Ionicons } from "@expo/vector-icons";
import RecipeCard from "../../components/RecipeCard";
import { useRecipeApi, useFavoriteApi, useMealPlanApi } from "../../api/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
const placeholderImage = require("../../assets/icon.png");

function isValidImageUrl(url) {
  return typeof url === "string" && /^https?:\/\//.test(url);
}

const DEFAULT_SECTIONS = ["Breakfast", "Lunch", "Dinner"];
const today = new Date().toISOString().slice(0, 10);
const MEAL_PLANS_STORAGE_KEY = "meal_plans_v1";

function addDays(dateStr, n) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

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

// Utility: Load meal plans from AsyncStorage
async function loadMealPlansFromStorage() {
  try {
    const raw = await AsyncStorage.getItem(MEAL_PLANS_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

// Utility: Save meal plans to AsyncStorage
async function saveMealPlansToStorage(meals, sections) {
  try {
    await AsyncStorage.setItem(
      MEAL_PLANS_STORAGE_KEY,
      JSON.stringify({ meals, sections })
    );
  } catch (e) {}
}

export default function MealPlansScreen() {
  // State for selected day, sections, and meals
  const [selectedDate, setSelectedDate] = useState(today);
  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [meals, setMeals] = useState({
    [today]: {
      Breakfast: [],
      Lunch: [],
      Dinner: [],
    },
  });
  const [showSectionInput, setShowSectionInput] = useState(false);
  const [newSection, setNewSection] = useState("");
  const [pickerSection, setPickerSection] = useState(null);
  const [showRecipePicker, setShowRecipePicker] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const searchTimeout = useRef(null);
  const recipeApi = useRecipeApi();
  const favoriteApi = useFavoriteApi();
  const mealPlanApi = useMealPlanApi();

  // Pagination state for search results
  const [searchOffset, setSearchOffset] = useState(0);
  const [hasMoreResults, setHasMoreResults] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const SEARCH_PAGE_SIZE = 10;

  // Sync state
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState("local"); // "local", "synced", "error"
  const isSyncingRef = useRef(false);

  // Hybrid: Load meal plans from local storage, then backend
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        // 1. Try local storage first (fast)
        const local = await loadMealPlansFromStorage();
        if (local) {
          setMeals(local.meals);
          setSections(local.sections);
          setSyncStatus("local");
        }

        // 2. Try backend sync (slower but authoritative)
        if (mealPlanApi) {
          try {
            const backend = await mealPlanApi.getCompleteMealPlan();
            if (backend && backend.meals) {
              // Merge backend data with local (backend wins on conflicts)
              setMeals(backend.meals);
              setSections(backend.sections || DEFAULT_SECTIONS);
              setSyncStatus("synced");

              // Update local storage with backend data
              await saveMealPlansToStorage(backend.meals, backend.sections);
            }
          } catch (e) {
            // Backend failed, keep local data
            setSyncStatus("error");
          }
        }
      } catch (e) {
        setSyncStatus("error");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [mealPlanApi]);

  // Hybrid: Save meal plans to local storage and backend on change
  useEffect(() => {
    if (!isLoading) {
      // Always save to local storage immediately
      saveMealPlansToStorage(meals, sections);

      // Debounce backend sync to prevent excessive requests
      const syncTimeout = setTimeout(() => {
        if (mealPlanApi && !isSyncingRef.current) {
          isSyncingRef.current = true;
          setIsSyncing(true);
          mealPlanApi
            .syncMealPlans(meals, sections)
            .then((result) => {
              setSyncStatus("synced");
              console.log("Meal plans synced successfully:", result);
            })
            .catch((error) => {
              setSyncStatus("error");
              console.error("Failed to sync meal plans:", error);
            })
            .finally(() => {
              setIsSyncing(false);
              isSyncingRef.current = false;
            });
        }
      }, 1000); // 1 second debounce

      return () => clearTimeout(syncTimeout);
    }
  }, [meals, sections, mealPlanApi, isLoading]);

  // Load favorites on mount (for heart icon)
  React.useEffect(() => {
    (async () => {
      try {
        const data = await favoriteApi.listFavorites();
        setFavoriteIds(new Set(data.favorites.map((r) => r.id)));
      } catch (e) {}
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search
  React.useEffect(() => {
    if (!showRecipePicker) return;
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!search.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      setSearchOffset(0);
      setHasMoreResults(true);
      return;
    }
    setSearchLoading(true);
    setSearchOffset(0);
    setHasMoreResults(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const data = await recipeApi.searchRecipes(search.trim(), {
          number: SEARCH_PAGE_SIZE,
          offset: 0,
        });
        const results = data.results || data.recipes || [];
        setSearchResults(results);
        setHasMoreResults(results.length === SEARCH_PAGE_SIZE);
      } catch (e) {
        setSearchResults([]);
        setHasMoreResults(false);
      } finally {
        setSearchLoading(false);
      }
    }, 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, showRecipePicker]);

  // Load more search results
  const loadMoreResults = async () => {
    if (!search.trim() || isLoadingMore || !hasMoreResults) {
      return;
    }

    setIsLoadingMore(true);
    try {
      const nextOffset = searchOffset + searchResults.length;
      const data = await recipeApi.searchRecipes(search.trim(), {
        number: SEARCH_PAGE_SIZE,
        offset: nextOffset,
      });
      const newResults = data.results || data.recipes || [];
      setSearchResults((prev) => [...prev, ...newResults]);
      setSearchOffset(nextOffset);
      setHasMoreResults(newResults.length === SEARCH_PAGE_SIZE);
    } catch (e) {
      setHasMoreResults(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Add section
  const handleAddSection = () => {
    setShowSectionInput(true);
    setNewSection("");
  };
  const handleSectionInput = () => {
    if (newSection && !sections.includes(newSection)) {
      setSections([...sections, newSection]);
      setMeals((prev) => ({
        ...prev,
        [selectedDate]: {
          ...prev[selectedDate],
          [newSection]: [],
        },
      }));
    }
    setShowSectionInput(false);
  };
  // Remove section
  const handleRemoveSection = (name) => {
    setSections(sections.filter((s) => s !== name));
    setMeals((prev) => {
      const copy = { ...prev };
      if (copy[selectedDate]) {
        delete copy[selectedDate][name];
      }
      return copy;
    });
  };
  // Add recipe to section (open picker)
  const handleAddRecipe = (section) => {
    setPickerSection(section);
    setShowRecipePicker(true);
    setSearch("");
    setSearchResults([]);
    setSearchOffset(0);
    setHasMoreResults(true);
  };
  // Actually add recipe (from picker)
  const handlePickRecipe = (recipe) => {
    setMeals((prev) => ({
      ...prev,
      [selectedDate]: {
        ...prev[selectedDate],
        [pickerSection]: [
          ...(prev[selectedDate]?.[pickerSection] || []),
          recipe,
        ],
      },
    }));
    setShowRecipePicker(false);
    setPickerSection(null);
  };
  // Remove recipe from section
  const handleRemoveRecipe = (section, idx) => {
    setMeals((prev) => {
      const arr = [...(prev[selectedDate]?.[section] || [])];
      arr.splice(idx, 1);
      return {
        ...prev,
        [selectedDate]: {
          ...prev[selectedDate],
          [section]: arr,
        },
      };
    });
  };
  // Day navigation
  const goToPrevDay = () => setSelectedDate(addDays(selectedDate, -1));
  const goToNextDay = () => setSelectedDate(addDays(selectedDate, 1));

  // Toggle favorite for search results
  const handleToggleFavorite = async (id) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    try {
      if (favoriteIds.has(id)) {
        await favoriteApi.removeFavorite(id);
      } else {
        await favoriteApi.addFavorite(id);
      }
    } catch (e) {
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (favoriteIds.has(id)) next.add(id);
        else next.delete(id);
        return next;
      });
    }
  };

  return (
    <Container
      backgroundColor="primary"
      padding="medium"
      style={styles.container}
    >
      {/* Sync status indicator */}
      <View style={styles.syncStatusRow}>
        <View style={styles.syncIndicator}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#FF6B6B" />
          ) : isSyncing ? (
            <ActivityIndicator size="small" color="#4ECDC4" />
          ) : (
            <Ionicons
              name={
                syncStatus === "synced"
                  ? "checkmark-circle"
                  : syncStatus === "error"
                  ? "warning"
                  : "cloud-offline"
              }
              size={16}
              color={
                syncStatus === "synced"
                  ? "#4ECDC4"
                  : syncStatus === "error"
                  ? "#FF6B6B"
                  : "#888"
              }
            />
          )}
        </View>
        <Text variant="caption" color="muted" style={styles.syncStatusText}>
          {isLoading
            ? "Loading..."
            : isSyncing
            ? "Syncing..."
            : syncStatus === "synced"
            ? "Synced"
            : syncStatus === "error"
            ? "Offline"
            : "Local only"}
        </Text>
        {!isLoading && !isSyncing && syncStatus === "error" && (
          <Button
            variant="ghost"
            size="small"
            title={<Ionicons name="refresh" size={14} color="#FF6B6B" />}
            onPress={() => {
              // Force a sync attempt
              if (mealPlanApi && !isSyncingRef.current) {
                isSyncingRef.current = true;
                setIsSyncing(true);
                mealPlanApi
                  .syncMealPlans(meals, sections)
                  .then((result) => {
                    setSyncStatus("synced");
                    console.log("Manual sync successful:", result);
                  })
                  .catch((error) => {
                    setSyncStatus("error");
                    console.error("Manual sync failed:", error);
                  })
                  .finally(() => {
                    setIsSyncing(false);
                    isSyncingRef.current = false;
                  });
              }
            }}
            style={styles.syncButton}
          />
        )}
      </View>

      {/* Day navigation */}
      <View style={styles.dayNavRow}>
        <Button
          variant="ghost"
          size="small"
          style={styles.iconBtn}
          onPress={goToPrevDay}
          title={<Ionicons name="chevron-back" size={22} color="#FF6B6B" />}
        />
        <Text
          variant="title"
          size="medium"
          color="accent"
          style={styles.dayText}
        >
          {selectedDate}
        </Text>
        <Button
          variant="ghost"
          size="small"
          style={styles.iconBtn}
          onPress={goToNextDay}
          title={<Ionicons name="chevron-forward" size={22} color="#FF6B6B" />}
        />
      </View>
      {/* Sections as flat list with dividers */}
      <FlatList
        data={sections}
        keyExtractor={(section) => section}
        renderItem={({ item: section, index }) => (
          <View>
            {index > 0 && <Divider color="border" margin="small" />}
            <View style={styles.sectionRow}>
              <Text
                variant="title"
                size="large"
                color="primary"
                style={styles.sectionTitle}
              >
                {section}
              </Text>
              <Button
                variant="ghost"
                size="small"
                title={<Ionicons name="close" size={16} color="#888" />}
                onPress={() => handleRemoveSection(section)}
                style={styles.iconBtn}
              />
            </View>
            <View style={styles.mealList}>
              {(meals[selectedDate]?.[section] || []).map((recipe, idx) => (
                <View key={recipe.id ? recipe.id : idx} style={styles.mealItem}>
                  <View style={styles.mealItemContent}>
                    <Image
                      source={
                        isValidImageUrl(recipe.image)
                          ? { uri: recipe.image }
                          : placeholderImage
                      }
                      style={styles.mealItemImage}
                      resizeMode="cover"
                    />
                    <Text color="secondary" style={styles.mealItemText}>
                      {recipe.title ||
                        recipe.name ||
                        `Recipe #${recipe.id || idx + 1}`}
                    </Text>
                  </View>
                  <Button
                    variant="ghost"
                    size="small"
                    title={<Ionicons name="close" size={14} color="#888" />}
                    onPress={() => handleRemoveRecipe(section, idx)}
                    style={styles.iconBtn}
                  />
                </View>
              ))}
              <Button
                variant="outline"
                size="small"
                title={"+ Add Recipe"}
                onPress={() => handleAddRecipe(section)}
                style={styles.addRecipeBtn}
              />
            </View>
          </View>
        )}
        ListFooterComponent={
          <>
            <Divider color="border" margin="small" />
            <Button
              variant="secondary"
              size="medium"
              title={"+ Add Section"}
              onPress={handleAddSection}
              style={styles.addSectionBtn}
            />
          </>
        }
        contentContainerStyle={{ paddingBottom: 32 }}
      />
      {/* Section input modal */}
      <Modal visible={showSectionInput} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text
              variant="title"
              size="large"
              color="accent"
              style={{ marginBottom: 12 }}
            >
              Add Section
            </Text>
            <Input
              placeholder="Section name (e.g. Brunch, Snack)"
              value={newSection}
              onChangeText={setNewSection}
              autoFocus
              onSubmitEditing={handleSectionInput}
              style={{ marginBottom: 16 }}
            />
            <Button
              title="Add"
              variant="primary"
              onPress={handleSectionInput}
            />
            <Button
              title="Cancel"
              variant="ghost"
              onPress={() => setShowSectionInput(false)}
              style={{ marginTop: 8 }}
            />
          </View>
        </View>
      </Modal>
      {/* Recipe picker modal */}
      <Modal visible={showRecipePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text
              variant="title"
              size="large"
              color="accent"
              style={{ marginBottom: 16 }}
            >
              Add Recipe
            </Text>

            <Input
              placeholder="Search recipes..."
              value={search}
              onChangeText={setSearch}
              autoFocus
              style={{ marginBottom: 16 }}
            />

            {searchLoading ? (
              <ActivityIndicator
                size="large"
                color="#FF6B6B"
                style={{ marginVertical: 24 }}
              />
            ) : (
              <FlatList
                data={searchResults}
                keyExtractor={(item) =>
                  item.id?.toString() || Math.random().toString()
                }
                numColumns={2}
                renderItem={({ item }) => (
                  <View style={styles.searchResultCard}>
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
                          item.servings ||
                          item.recipe_yield ||
                          item.data?.recipeYield;
                        const s = extractServings(raw);
                        return s ? s : "-";
                      })()}
                      isFavorite={favoriteIds.has(item.id)}
                      onPress={() => handlePickRecipe(item)}
                      onToggleFavorite={() => handleToggleFavorite(item.id)}
                    />
                  </View>
                )}
                ListEmptyComponent={
                  <Text
                    color="muted"
                    style={{ textAlign: "center", marginTop: 20 }}
                  >
                    {search.trim()
                      ? "No recipes found."
                      : "Start typing to search recipes..."}
                  </Text>
                }
                contentContainerStyle={styles.searchResultsContainer}
                onEndReached={loadMoreResults}
                onEndReachedThreshold={0.3}
                ListFooterComponent={
                  isLoadingMore ? (
                    <ActivityIndicator
                      size="small"
                      color="#FF6B6B"
                      style={{ marginVertical: 10 }}
                    />
                  ) : null
                }
                showsVerticalScrollIndicator={true}
                removeClippedSubviews={false}
              />
            )}

            <Button
              title="Cancel"
              variant="ghost"
              onPress={() => setShowRecipePicker(false)}
              style={{ marginTop: 16 }}
            />
          </View>
        </View>
      </Modal>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
  },
  syncStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    gap: 8,
  },
  syncIndicator: {
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  syncStatusText: {
    fontSize: 12,
  },
  syncButton: {
    marginLeft: 8,
  },
  dayNavRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    gap: 8,
  },
  dayText: {
    marginHorizontal: 10,
    fontWeight: "bold",
  },
  iconBtn: {
    backgroundColor: "transparent",
    padding: 4,
    minWidth: 32,
    alignItems: "center",
    justifyContent: "center",
    elevation: 0,
    shadowOpacity: 0,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 4,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 20,
  },
  mealList: {
    marginTop: 2,
    marginBottom: 8,
  },
  mealItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  mealItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  mealItemImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: "#333",
  },
  mealItemText: {
    flex: 1,
    fontSize: 16,
  },
  addRecipeBtn: {
    marginTop: 6,
    borderRadius: 6,
    alignItems: "center",
    backgroundColor: "transparent",
    elevation: 0,
    shadowOpacity: 0,
  },
  addSectionBtn: {
    margin: 16,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#2a2a2a",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 500,
    padding: 24,
    borderRadius: 16,
    backgroundColor: "#232323",
    maxHeight: "85%",
  },
  searchResultsContainer: {
    paddingHorizontal: 4,
    paddingBottom: 16,
    minHeight: 300,
  },
  searchResultCard: {
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 8,
  },
});
