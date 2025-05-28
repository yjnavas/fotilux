// Utility for managing comment state across components
import { getPostComments } from '../services/postServices';

// Store for comment states
const commentStates = {};

// Event name constants
export const COMMENT_STATE_CHANGED_EVENT = 'commentStateChanged';
export const COMMENT_STATE_INITIALIZED_EVENT = 'commentStateInitialized';
export const COMMENT_STATE_CLEARED_EVENT = 'commentStateCleared';

/**
 * Update the comment state for a post
 * @param {string|number} postId - The post ID
 * @param {Array} comments - Array of comments
 */
export const updateCommentState = (postId, comments) => {
  // Ensure postId is a string for consistency
  const postIdStr = postId.toString();
  
  // Update state
  commentStates[postIdStr] = {
    comments: comments || [],
    count: comments ? comments.length : 0,
    timestamp: Date.now()
  };
  
  // Dispatch event to notify all components
  if (typeof window !== 'undefined') {
    const event = new CustomEvent(COMMENT_STATE_CHANGED_EVENT, {
      detail: { 
        postId: postIdStr, 
        comments: comments || [], 
        count: comments ? comments.length : 0 
      }
    });
    window.dispatchEvent(event);
  }
  
  // Persist count in localStorage for session persistence
  // We don't store full comments to avoid excessive storage
  try {
    if (typeof localStorage !== 'undefined') {
      const globalCommentStateString = localStorage.getItem('globalCommentState') || '{}';
      const globalCommentState = JSON.parse(globalCommentStateString);
      
      globalCommentState[postIdStr] = {
        count: comments ? comments.length : 0,
        timestamp: Date.now()
      };
      
      localStorage.setItem('globalCommentState', JSON.stringify(globalCommentState));
    }
  } catch (error) {
    console.error('Error persisting comment state to localStorage:', error);
  }
};

/**
 * Add a new comment to a post's comment state
 * @param {string|number} postId - The post ID
 * @param {object} newComment - The new comment to add
 */
export const addComment = (postId, newComment) => {
  const postIdStr = postId.toString();
  const currentState = getCommentState(postIdStr);
  
  let updatedComments = [];
  if (currentState && currentState.comments) {
    // Add to existing comments
    updatedComments = [...currentState.comments, newComment];
  } else {
    // Initialize with this comment
    updatedComments = [newComment];
  }
  
  // Update state with new comments array
  updateCommentState(postIdStr, updatedComments);
  
  return updatedComments;
};

/**
 * Get the comment state for a post
 * @param {string|number} postId - The post ID
 * @returns {object|null} - The comment state object, or null if not found
 */
export const getCommentState = (postId) => {
  const postIdStr = postId.toString();
  
  // First check memory state
  if (commentStates[postIdStr]) {
    return commentStates[postIdStr];
  }
  
  // Then check localStorage (only has count, not full comments)
  try {
    if (typeof localStorage !== 'undefined') {
      const globalCommentStateString = localStorage.getItem('globalCommentState') || '{}';
      const globalCommentState = JSON.parse(globalCommentStateString);
      
      if (globalCommentState[postIdStr]) {
        // We only store count in localStorage, not full comments
        return {
          count: globalCommentState[postIdStr].count,
          comments: [],
          timestamp: globalCommentState[postIdStr].timestamp
        };
      }
    }
  } catch (error) {
    console.error('Error reading comment state from localStorage:', error);
  }
  
  return null;
};

/**
 * Initialize comment states from API for posts
 * @param {Array} postIds - Array of post IDs to initialize
 * @returns {Promise<void>}
 */
export const initializeCommentStates = async (postIds) => {
  if (!postIds || !postIds.length) return;
  
  try {
    console.log('Initializing comment states for posts:', postIds);
    
    // Process each post ID
    for (const postId of postIds) {
      try {
        // Get comments for this post
        const response = await getPostComments(postId);
        
        if (response.success) {
          // Update state with comments
          updateCommentState(postId, response.data || []);
          
          console.log(`Comment state initialized for post ${postId}: count=${response.data ? response.data.length : 0}`);
        }
      } catch (postError) {
        console.error(`Error initializing comment state for post ${postId}:`, postError);
      }
    }
    
    // Dispatch event to notify components about initialization
    if (typeof window !== 'undefined') {
      const event = new CustomEvent(COMMENT_STATE_INITIALIZED_EVENT, {
        detail: { commentStates: { ...commentStates } }
      });
      window.dispatchEvent(event);
    }
  } catch (error) {
    console.error('Error initializing comment states:', error);
  }
};

/**
 * Clear all comment states (e.g., on logout)
 */
export const clearCommentStates = () => {
  // Clear all states
  Object.keys(commentStates).forEach(key => delete commentStates[key]);
  
  console.log('Comment states cleared');
  
  // Clear localStorage
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('globalCommentState');
    }
  } catch (error) {
    console.error('Error clearing comment states from localStorage:', error);
  }
  
  // Dispatch event to notify components
  if (typeof window !== 'undefined') {
    const event = new CustomEvent(COMMENT_STATE_CLEARED_EVENT);
    window.dispatchEvent(event);
  }
};

/**
 * Add an event listener for comment state changes
 * @param {Function} callback - The callback function to call when state changes
 * @param {string} eventType - The event type to listen for (default: COMMENT_STATE_CHANGED_EVENT)
 * @returns {Function} - A function to remove the event listener
 */
export const addCommentStateListener = (callback, eventType = COMMENT_STATE_CHANGED_EVENT) => {
  if (typeof window !== 'undefined') {
    window.addEventListener(eventType, callback);
    return () => window.removeEventListener(eventType, callback);
  }
  return () => {};
};
