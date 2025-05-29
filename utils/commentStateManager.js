// Utility for managing comment state across components
import { getPostComments } from '../services/postServices';
import { createStateManager } from './stateManagerFactory';

// Create the comment state manager using the factory
const commentManager = createStateManager({
  name: 'comment',
  localStorageKey: 'globalCommentState',
  storeFullDataInStorage: false, // Only store counts in localStorage, not full comments
  
  // Function to fetch initial data
  fetchInitialData: async (params) => {
    const { postId } = params;
    return await getPostComments(postId);
  },
  
  // Function to process API response
  processApiResponse: (data, params) => {
    const { postId } = params;
    const processedData = {};
    
    const comments = Array.isArray(data) ? data : [];
    processedData[postId] = {
      comments,
      count: comments.length
    };
    
    return processedData;
  }
});

// Export constants
export const COMMENT_STATE_CHANGED_EVENT = commentManager.STATE_CHANGED_EVENT;
export const COMMENT_STATE_INITIALIZED_EVENT = commentManager.STATE_INITIALIZED_EVENT;
export const COMMENT_STATE_CLEARED_EVENT = commentManager.STATE_CLEARED_EVENT;

/**
 * Update the comment state for a post
 * @param {string|number} postId - The post ID
 * @param {Array} comments - Array of comments
 */
export const updateCommentState = (postId, comments) => {
  const commentsArray = comments || [];
  commentManager.updateState(postId, {
    comments: commentsArray,
    count: commentsArray.length
  });
};

/**
 * Add a new comment to a post's comment state
 * @param {string|number} postId - The post ID
 * @param {object} newComment - The new comment to add
 * @returns {Array} - Updated comments array
 */
export const addComment = (postId, newComment) => {
  const currentState = getCommentState(postId);
  
  let updatedComments = [];
  if (currentState && Array.isArray(currentState.comments)) {
    // Add to existing comments
    updatedComments = [...currentState.comments, newComment];
  } else {
    // Initialize with this comment
    updatedComments = [newComment];
  }
  
  // Update state with new comments array
  updateCommentState(postId, updatedComments);
  
  return updatedComments;
};

/**
 * Get the comment state for a post
 * @param {string|number} postId - The post ID
 * @returns {object|null} - The comment state object, or null if not found
 */
export const getCommentState = (postId) => {
  const state = commentManager.getState(postId);
  
  // If we only have count from localStorage but no comments array
  if (state && state.count !== undefined && !state.comments) {
    return {
      ...state,
      comments: []
    };
  }
  
  return state;
};

/**
 * Initialize comment states from API for posts
 * @param {string|number} userId - The current user ID (not used but kept for API consistency)
 * @param {Array} postIds - Optional array of post IDs to initialize
 * @returns {Promise<void>}
 */
export const initializeCommentStates = async (userId, postIds = []) => {
  // If no specific postIds provided, we don't initialize anything yet
  // They will be initialized on demand when needed
  if (postIds.length > 0) {
    for (const postId of postIds) {
      try {
        await commentManager.initializeStates({ postId });
      } catch (error) {
        console.error(`Error initializing comment state for post ${postId}:`, error);
      }
    }
  }
};

/**
 * Clear all comment states (e.g., on logout)
 */
export const clearCommentStates = () => {
  commentManager.clearStates();
};

/**
 * Add an event listener for comment state changes
 * @param {Function} callback - The callback function to call when state changes
 * @param {string} eventType - The event type to listen for (default: COMMENT_STATE_CHANGED_EVENT)
 * @returns {Function} - A function to remove the event listener
 */
export const addCommentStateListener = (callback, eventType = COMMENT_STATE_CHANGED_EVENT) => {
  return commentManager.addStateListener(callback, eventType);
};
