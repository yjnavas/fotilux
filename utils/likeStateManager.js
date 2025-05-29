// Utility for managing like state across components
import { getPostLikes } from '../services/postServices';
import { createStateManager } from './stateManagerFactory';

// Create the like state manager using the factory
const likeManager = createStateManager({
  name: 'like',
  localStorageKey: 'globalLikeState',
  storeFullDataInStorage: true,
  
  // Function to fetch initial data
  fetchInitialData: async (params) => {
    const { postId, userId } = params;
    return await getPostLikes(postId);
  },
  
  // Function to process API response
  processApiResponse: (data, params) => {
    const { postId, userId } = params;
    const processedData = {};
    
    if (Array.isArray(data)) {
      // Check if current user has liked this post
      const userHasLiked = data.some(like => like.user_id === userId);
      const likeCount = data.length;
      
      processedData[postId] = {
        isLiked: userHasLiked,
        count: likeCount
      };
    }
    
    return processedData;
  }
});

// Export constants
export const LIKE_STATE_CHANGED_EVENT = likeManager.STATE_CHANGED_EVENT;
export const LIKE_STATE_INITIALIZED_EVENT = likeManager.STATE_INITIALIZED_EVENT;
export const LIKE_STATE_CLEARED_EVENT = likeManager.STATE_CLEARED_EVENT;

/**
 * Update the like state for a post
 * @param {string|number} postId - The post ID
 * @param {boolean} isLiked - Whether the post is liked
 * @param {number} count - The number of likes
 */
export const updateLikeState = (postId, isLiked, count) => {
  likeManager.updateState(postId, { isLiked, count: count || 0 });
};

/**
 * Get the like state for a post
 * @param {string|number} postId - The post ID
 * @returns {object|null} - The like state object, or null if not found
 */
export const getLikeState = (postId) => {
  return likeManager.getState(postId);
};

/**
 * Initialize like states from API for posts
 * @param {string|number} userId - The current user ID
 * @param {Array} postIds - Optional array of post IDs to initialize
 * @returns {Promise<void>}
 */
export const initializeLikeStates = async (userId, postIds = []) => {
  if (!userId) return;
  
  // If no specific postIds provided, we don't initialize anything yet
  // They will be initialized on demand when needed
  if (postIds.length > 0) {
    for (const postId of postIds) {
      try {
        await likeManager.initializeStates({ postId, userId });
      } catch (error) {
        console.error(`Error initializing like state for post ${postId}:`, error);
      }
    }
  }
};

/**
 * Clear all like states (e.g., on logout)
 */
export const clearLikeStates = () => {
  likeManager.clearStates();
};

/**
 * Add an event listener for like state changes
 * @param {Function} callback - The callback function to call when state changes
 * @param {string} eventType - The event type to listen for (default: LIKE_STATE_CHANGED_EVENT)
 * @returns {Function} - A function to remove the event listener
 */
export const addLikeStateListener = (callback, eventType = LIKE_STATE_CHANGED_EVENT) => {
  return likeManager.addStateListener(callback, eventType);
};
