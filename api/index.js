import { useAuth } from "@clerk/clerk-expo";
import { API_CONFIG } from "../constants";

// Create API client with authentication
export function useApiClient() {
  const { getToken, isLoaded } = useAuth();

  // Don't return API client until Clerk is loaded
  if (!isLoaded) {
    return null;
  }

  const makeRequest = async (endpoint, options = {}) => {
    let token = null;

    // Only try to get token if getToken function exists (Clerk is loaded)
    if (getToken && typeof getToken === "function") {
      try {
        token = await getToken();
      } catch (error) {
        console.warn("Failed to get auth token:", error);
      }
    }

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

  return {
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
  };
}

// Recipe API functions
export function useRecipeApi() {
  const api = useApiClient();

  // Return null if API client is not ready
  if (!api) {
    return null;
  }

  return {
    searchRecipes: (query, options = {}) =>
      api.get(`${API_CONFIG.endpoints.recipes}/search?query=${query}`),

    getRecipe: (id) => api.get(`${API_CONFIG.endpoints.recipes}/${id}`),

    getUserRecipes: () => api.get(API_CONFIG.endpoints.userRecipes),

    createUserRecipe: (recipeData) =>
      api.post(API_CONFIG.endpoints.userRecipes, recipeData),

    updateUserRecipe: (id, recipeData) =>
      api.put(`${API_CONFIG.endpoints.userRecipes}/${id}`, recipeData),

    deleteUserRecipe: (id) =>
      api.delete(`${API_CONFIG.endpoints.userRecipes}/${id}`),
  };
}

// Meal Plan API functions
export function useMealPlanApi() {
  const api = useApiClient();

  // Return null if API client is not ready
  if (!api) {
    return null;
  }

  return {
    getMealPlans: () => api.get(API_CONFIG.endpoints.mealPlans),

    createMealPlan: (planData) =>
      api.post(API_CONFIG.endpoints.mealPlans, planData),

    updateMealPlan: (id, planData) =>
      api.put(`${API_CONFIG.endpoints.mealPlans}/${id}`, planData),

    deleteMealPlan: (id) =>
      api.delete(`${API_CONFIG.endpoints.mealPlans}/${id}`),
  };
}

// Grocery List API functions
export function useGroceryListApi() {
  const api = useApiClient();

  // Return null if API client is not ready
  if (!api) {
    return null;
  }

  return {
    getGroceryLists: () => api.get(API_CONFIG.endpoints.groceryLists),

    createGroceryList: (listData) =>
      api.post(API_CONFIG.endpoints.groceryLists, listData),

    updateGroceryList: (id, listData) =>
      api.put(`${API_CONFIG.endpoints.groceryLists}/${id}`, listData),

    deleteGroceryList: (id) =>
      api.delete(`${API_CONFIG.endpoints.groceryLists}/${id}`),
  };
}
