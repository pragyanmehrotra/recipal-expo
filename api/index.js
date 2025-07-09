import * as SecureStore from "expo-secure-store";
import { useMemo } from "react";
import { API_CONFIG } from "../constants";

// Create API client with authentication
export function useApiClient() {
  // No Clerk, so no isLoaded check

  const makeRequest = async (endpoint, options = {}) => {
    let token = await SecureStore.getItemAsync("jwt");

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const url = `${API_CONFIG.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  };

  return useMemo(
    () => ({
      get: (endpoint) => makeRequest(endpoint, { method: "GET" }),
      post: (endpoint, data) =>
        makeRequest(endpoint, {
          method: "POST",
          body: JSON.stringify(data),
        }),
      put: (endpoint, data) =>
        makeRequest(endpoint, {
          method: "PUT",
          body: JSON.stringify(data),
        }),
      delete: (endpoint) => makeRequest(endpoint, { method: "DELETE" }),
    }),
    []
  );
}

// Recipe API functions
export function useRecipeApi() {
  const api = useApiClient();

  // Return null if API client is not ready
  if (!api) {
    return null;
  }

  return useMemo(
    () => ({
      searchRecipes: (query, options = {}) => {
        // Support pagination for search queries, including offset=0
        let url = `${
          API_CONFIG.endpoints.recipes
        }/search?query=${encodeURIComponent(query)}`;
        if (options.hasOwnProperty("number"))
          url += `&number=${options.number}`;
        if (options.hasOwnProperty("offset"))
          url += `&offset=${options.offset}`;
        return api.get(url);
      },

      getRecipe: (id) => api.get(`${API_CONFIG.endpoints.recipes}/${id}`),

      getUserRecipes: () => api.get(API_CONFIG.endpoints.userRecipes),

      createUserRecipe: (recipeData) =>
        api.post(API_CONFIG.endpoints.userRecipes, recipeData),

      updateUserRecipe: (id, recipeData) =>
        api.put(`${API_CONFIG.endpoints.userRecipes}/${id}`, recipeData),

      deleteUserRecipe: (id) =>
        api.delete(`${API_CONFIG.endpoints.userRecipes}/${id}`),
    }),
    [api]
  );
}

// Meal Plan API functions
export function useMealPlanApi() {
  const api = useApiClient();

  // Return null if API client is not ready
  if (!api) {
    return null;
  }

  return useMemo(
    () => ({
      getMealPlans: () => api.get(API_CONFIG.endpoints.mealPlans),

      createMealPlan: (planData) =>
        api.post(API_CONFIG.endpoints.mealPlans, planData),

      updateMealPlan: (id, planData) =>
        api.put(`${API_CONFIG.endpoints.mealPlans}/${id}`, planData),

      deleteMealPlan: (id) =>
        api.delete(`${API_CONFIG.endpoints.mealPlans}/${id}`),

      // New sync functions
      syncMealPlans: (meals, sections) =>
        api.post(`${API_CONFIG.endpoints.mealPlans}/sync`, { meals, sections }),

      getCompleteMealPlan: () =>
        api.get(`${API_CONFIG.endpoints.mealPlans}/complete`),
    }),
    [api]
  );
}

// Grocery List API functions
export function useGroceryListApi() {
  const api = useApiClient();

  // Return null if API client is not ready
  if (!api) {
    return null;
  }

  return useMemo(
    () => ({
      getGroceryLists: () => api.get(API_CONFIG.endpoints.groceryLists),

      createGroceryList: (listData) =>
        api.post(API_CONFIG.endpoints.groceryLists, listData),

      updateGroceryList: (id, listData) =>
        api.put(`${API_CONFIG.endpoints.groceryLists}/${id}`, listData),

      deleteGroceryList: (id) =>
        api.delete(`${API_CONFIG.endpoints.groceryLists}/${id}`),
    }),
    [api]
  );
}

// Favorite API functions
export function useFavoriteApi() {
  const api = useApiClient();
  if (!api) return null;

  return useMemo(
    () => ({
      listFavorites: () => api.get(API_CONFIG.endpoints.favorites),
      addFavorite: (recipe_id) =>
        api.post(API_CONFIG.endpoints.favorites, { recipe_id }),
      removeFavorite: (recipe_id) =>
        api.delete(`${API_CONFIG.endpoints.favorites}/${recipe_id}`),
    }),
    [api]
  );
}
