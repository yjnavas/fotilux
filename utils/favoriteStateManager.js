// Utility for managing favorite state across components
import { get_post_favorites } from '../services/postServices';
import { createStateManager } from './stateManagerFactory';

// Create the favorite state manager using the factory
const favoriteManager = createStateManager({
  name: 'favorite',
  localStorageKey: 'globalFavoriteState',
  storeFullDataInStorage: true,
  
  // Function to fetch initial data
  fetchInitialData: async (params) => {
    const { userId } = params;
    return await get_post_favorites(userId);
  },
  
  // Function to process API response
  processApiResponse: (data) => {
    const processedData = {};
    
    // Process favorites data
    if (Array.isArray(data)) {
      data.forEach(favorite => {
        const postId = favorite.post_id.toString();
        processedData[postId] = { isFavorited: true };
      });
    }
    
    return processedData;
  }
});

// Export constants
export const FAVORITE_STATE_CHANGED_EVENT = favoriteManager.STATE_CHANGED_EVENT;
export const FAVORITE_STATE_INITIALIZED_EVENT = favoriteManager.STATE_INITIALIZED_EVENT;
export const FAVORITE_STATE_CLEARED_EVENT = favoriteManager.STATE_CLEARED_EVENT;

/**
 * Update the favorite state for a post
 * @param {string|number} postId - The post ID
 * @param {boolean} isFavorited - Whether the post is favorited
 */
export const updateFavoriteState = (postId, isFavorited) => {
  favoriteManager.updateState(postId, { isFavorited });
};

/**
 * Get the favorite state for a post
 * @param {string|number} postId - The post ID
 * @returns {boolean|null} - The favorite state, or null if not found
 */
export const getFavoriteState = (postId) => {
  const state = favoriteManager.getState(postId);
  return state?.isFavorited ?? null;
};

/**
 * Initialize favorite states from API for the current user
 * @param {string|number} userId - The current user ID
 * @returns {Promise<void>}
 */
export const initializeFavoriteStates = async (userId) => {
  if (!userId) return;
  await favoriteManager.initializeStates({ userId });
};

/**
 * Clear all favorite states (e.g., on logout)
 */
export const clearFavoriteStates = () => {
  favoriteManager.clearStates();
};

/**
 * Add an event listener for favorite state changes
 * @param {Function} callback - The callback function to call when state changes
 * @param {string} eventType - The event type to listen for (default: FAVORITE_STATE_CHANGED_EVENT)
 * @returns {Function} - A function to remove the event listener
 */
export const addFavoriteStateListener = (callback, eventType = FAVORITE_STATE_CHANGED_EVENT) => {
  return favoriteManager.addStateListener(callback, eventType);
};
