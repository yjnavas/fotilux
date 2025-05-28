// Utility for managing favorite state across components
import { get_post_favorites } from '../services/postServices';

// Store for favorite states
const favoriteStates = {};

// Event name constants
export const FAVORITE_STATE_CHANGED_EVENT = 'favoriteStateChanged';
export const FAVORITE_STATE_INITIALIZED_EVENT = 'favoriteStateInitialized';
export const FAVORITE_STATE_CLEARED_EVENT = 'favoriteStateCleared';

/**
 * Update the favorite state for a post
 * @param {string|number} postId - The post ID
 * @param {boolean} isFavorited - Whether the post is favorited
 */
export const updateFavoriteState = (postId, isFavorited) => {
  // Ensure postId is a string for consistency
  const postIdStr = postId.toString();
  
  // Update state
  favoriteStates[postIdStr] = {
    isFavorited,
    timestamp: Date.now()
  };
  
  // Dispatch event to notify all components
  if (typeof window !== 'undefined') {
    const event = new CustomEvent(FAVORITE_STATE_CHANGED_EVENT, {
      detail: { postId: postIdStr, isFavorited }
    });
    window.dispatchEvent(event);
  }
};

/**
 * Get the favorite state for a post
 * @param {string|number} postId - The post ID
 * @returns {boolean|null} - The favorite state, or null if not found
 */
export const getFavoriteState = (postId) => {
  const postIdStr = postId.toString();
  return favoriteStates[postIdStr]?.isFavorited ?? null;
};

/**
 * Initialize favorite states from API for the current user
 * @param {string|number} userId - The current user ID
 * @returns {Promise<void>}
 */
export const initializeFavoriteStates = async (userId) => {
  if (!userId) return;
  
  try {
    console.log('Initializing favorite states for user:', userId);
    
    // Clear existing states first
    clearFavoriteStates();
    
    // Get all user favorites from API
    const response = await get_post_favorites(userId);
    
    if (response.success && response.data) {
      // Process favorites data
      response.data.forEach(favorite => {
        const postId = favorite.post_id.toString();
        favoriteStates[postId] = {
          isFavorited: true,
          timestamp: Date.now()
        };
      });
      
      console.log('Favorite states initialized:', Object.keys(favoriteStates).length, 'favorites');
      
      // Dispatch event to notify components
      if (typeof window !== 'undefined') {
        const event = new CustomEvent(FAVORITE_STATE_INITIALIZED_EVENT, {
          detail: { favoriteStates: { ...favoriteStates } }
        });
        window.dispatchEvent(event);
      }
    } else {
      console.error('Failed to initialize favorite states:', response.msg);
    }
  } catch (error) {
    console.error('Error initializing favorite states:', error);
  }
};

/**
 * Clear all favorite states (e.g., on logout)
 */
export const clearFavoriteStates = () => {
  // Clear all states
  Object.keys(favoriteStates).forEach(key => delete favoriteStates[key]);
  
  console.log('Favorite states cleared');
  
  // Dispatch event to notify components
  if (typeof window !== 'undefined') {
    const event = new CustomEvent(FAVORITE_STATE_CLEARED_EVENT);
    window.dispatchEvent(event);
  }
};

/**
 * Add an event listener for favorite state changes
 * @param {Function} callback - The callback function to call when state changes
 * @param {string} eventType - The event type to listen for (default: FAVORITE_STATE_CHANGED_EVENT)
 * @returns {Function} - A function to remove the event listener
 */
export const addFavoriteStateListener = (callback, eventType = FAVORITE_STATE_CHANGED_EVENT) => {
  if (typeof window !== 'undefined') {
    window.addEventListener(eventType, callback);
    return () => window.removeEventListener(eventType, callback);
  }
  return () => {};
};
