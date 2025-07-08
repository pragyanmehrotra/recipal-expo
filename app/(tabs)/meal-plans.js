import React, { useState } from "react";
import { View, Modal, StyleSheet, FlatList } from "react-native";
import { Container, Button, Text, Card, Input } from "../../components";
import { Ionicons } from "@expo/vector-icons";

const DEFAULT_SECTIONS = ["Breakfast", "Lunch", "Dinner"];
const today = new Date().toISOString().slice(0, 10);

function addDays(dateStr, n) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
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
  // TODO: Replace with real favorites search results
  const [searchResults, setSearchResults] = useState([]);

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
    setSearchResults([]); // TODO: fetch favorites
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

  return (
    <Container
      backgroundColor="primary"
      padding="medium"
      style={styles.container}
    >
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
      {/* Sections */}
      <FlatList
        data={sections}
        keyExtractor={(section) => section}
        renderItem={({ item: section }) => (
          <Card style={styles.sectionBox}>
            <View style={styles.sectionHeader}>
              <Text
                variant="title"
                size="small"
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
                  <Text color="secondary">
                    {recipe.name || `Recipe #${recipe.id || idx + 1}`}
                  </Text>
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
          </Card>
        )}
        ListFooterComponent={
          <Button
            variant="secondary"
            size="medium"
            title={"+ Add Section"}
            onPress={handleAddSection}
            style={styles.addSectionBtn}
          />
        }
        contentContainerStyle={{ paddingBottom: 32 }}
      />
      {/* Section input modal */}
      <Modal visible={showSectionInput} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Card style={styles.modalCard}>
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
          </Card>
        </View>
      </Modal>
      {/* Recipe picker modal */}
      <Modal visible={showRecipePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <Card style={styles.modalCard}>
            <Text
              variant="title"
              size="large"
              color="accent"
              style={{ marginBottom: 12 }}
            >
              Add Recipe from Favorites
            </Text>
            <Input
              placeholder="Search your favorites..."
              value={search}
              onChangeText={setSearch}
              autoFocus
              // TODO: implement search logic
            />
            {/* TODO: Replace with RecipeCard list */}
            <FlatList
              data={searchResults}
              keyExtractor={(item) =>
                item.id?.toString() || Math.random().toString()
              }
              renderItem={({ item }) => (
                <Button
                  title={item.name || item.title || `Recipe #${item.id}`}
                  onPress={() => handlePickRecipe(item)}
                  variant="outline"
                  style={{ marginBottom: 8 }}
                />
              )}
              ListEmptyComponent={
                <Text color="muted">No favorites found.</Text>
              }
              style={{ maxHeight: 220 }}
            />
            <Button
              title="Cancel"
              variant="ghost"
              onPress={() => setShowRecipePicker(false)}
              style={{ marginTop: 8 }}
            />
          </Card>
        </View>
      </Modal>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
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
  sectionBox: {
    marginVertical: 8,
    backgroundColor: "#232323",
    borderRadius: 12,
    padding: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  sectionTitle: {
    fontWeight: "700",
  },
  mealList: {
    marginTop: 4,
  },
  mealItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
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
  },
  modalCard: {
    width: "90%",
    maxWidth: 400,
    padding: 24,
    borderRadius: 16,
    backgroundColor: "#232323",
  },
});
