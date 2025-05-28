// Utility for managing like state across components
import { getPostLikes } from '../services/postServices';

// Store for like states
const likeStates = {};

// Event name constants
export const LIKE_STATE_CHANGED_EVENT = 'likeStateChanged';
export const LIKE_STATE_INITIALIZED_EVENT = 'likeStateInitialized';
export const LIKE_STATE_CLEARED_EVENT = 'likeStateCleared';

/**
 * Update the like state for a post
 * @param {string|number} postId - The post ID
 * @param {boolean} isLiked - Whether the post is liked
 * @param {number} count - The number of likes
 */
export const updateLikeState = (postId, isLiked, count) => {
  // Ensure postId is a string for consistency
  const postIdStr = postId.toString();
  
  // Update state
  likeStates[postIdStr] = {
    isLiked,
    count: count || 0,
    timestamp: Date.now()
  };
  
  // Dispatch event to notify all components
  if (typeof window !== 'undefined') {
    const event = new CustomEvent(LIKE_STATE_CHANGED_EVENT, {
      detail: { postId: postIdStr, isLiked, count }
    });
    window.dispatchEvent(event);
  }
  
  // Persist in localStorage for session persistence
  try {
    if (typeof localStorage !== 'undefined') {
      const globalLikeStateString = localStorage.getItem('globalLikeState') || '{}';
      const globalLikeState = JSON.parse(globalLikeStateString);
      
      globalLikeState[postIdStr] = {
        isLiked,
        count: count || 0,
        timestamp: Date.now()
      };
      
      localStorage.setItem('globalLikeState', JSON.stringify(globalLikeState));
    }
  } catch (error) {
    console.error('Error persisting like state to localStorage:', error);
  }
};

/**
 * Get the like state for a post
 * @param {string|number} postId - The post ID
 * @returns {object|null} - The like state object, or null if not found
 */
export const getLikeState = (postId) => {
  const postIdStr = postId.toString();
  
  // First check memory state
  if (likeStates[postIdStr]) {
    return likeStates[postIdStr];
  }
  
  // Then check localStorage
  try {
    if (typeof localStorage !== 'undefined') {
      const globalLikeStateString = localStorage.getItem('globalLikeState') || '{}';
      const globalLikeState = JSON.parse(globalLikeStateString);
      
      if (globalLikeState[postIdStr]) {
        // Update memory state from localStorage
        likeStates[postIdStr] = globalLikeState[postIdStr];
        return globalLikeState[postIdStr];
      }
    }
  } catch (error) {
    console.error('Error reading like state from localStorage:', error);
  }
  
  return null;
};

/**
 * Initialize like states from API for posts
 * @param {Array} postIds - Array of post IDs to initialize
 * @param {string|number} userId - The current user ID
 * @returns {Promise<void>}
 */
export const initializeLikeStates = async (postIds, userId) => {
  if (!postIds || !postIds.length || !userId) return;
  
  try {
    console.log('Initializing like states for posts:', postIds);
    
    // Process each post ID
    for (const postId of postIds) {
      try {
        // Get likes for this post
        const response = await getPostLikes(postId);
        
        if (response.success && response.data) {
          // Check if current user has liked this post
          const userHasLiked = response.data.some(like => like.user_id === userId);
          const likeCount = response.data.length;
          
          // Update state
          updateLikeState(postId, userHasLiked, likeCount);
          
          console.log(`Like state initialized for post ${postId}: liked=${userHasLiked}, count=${likeCount}`);
        }
      } catch (postError) {
        console.error(`Error initializing like state for post ${postId}:`, postError);
      }
    }
    
    // Dispatch event to notify components about initialization
    if (typeof window !== 'undefined') {
      const event = new CustomEvent(LIKE_STATE_INITIALIZED_EVENT, {
        detail: { likeStates: { ...likeStates } }
      });
      window.dispatchEvent(event);
    }
  } catch (error) {
    console.error('Error initializing like states:', error);
  }
};

/**
 * Clear all like states (e.g., on logout)
 */
export const clearLikeStates = () => {
  // Clear all states
  Object.keys(likeStates).forEach(key => delete likeStates[key]);
  
  console.log('Like states cleared');
  
  // Clear localStorage
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('globalLikeState');
    }
  } catch (error) {
    console.error('Error clearing like states from localStorage:', error);
  }
  
  // Dispatch event to notify components
  if (typeof window !== 'undefined') {
    const event = new CustomEvent(LIKE_STATE_CLEARED_EVENT);
    window.dispatchEvent(event);
  }
};

/**
 * Add an event listener for like state changes
 * @param {Function} callback - The callback function to call when state changes
 * @param {string} eventType - The event type to listen for (default: LIKE_STATE_CHANGED_EVENT)
 * @returns {Function} - A function to remove the event listener
 */
export const addLikeStateListener = (callback, eventType = LIKE_STATE_CHANGED_EVENT) => {
  if (typeof window !== 'undefined') {
    window.addEventListener(eventType, callback);
    return () => window.removeEventListener(eventType, callback);
  }
  return () => {};
};
