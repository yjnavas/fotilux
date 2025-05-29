// Generic state manager factory
import { Platform } from 'react-native';

/**
 * Creates a state manager with standardized methods
 * @param {Object} config - Configuration for the state manager
 * @returns {Object} - The state manager object with standardized methods
 */
export const createStateManager = (config) => {
  const {
    name,                    // Name of the state manager (e.g., 'favorite', 'like', 'comment')
    fetchInitialData,        // Function to fetch initial data from API
    localStorageKey,         // Key for localStorage
    storeFullDataInStorage,  // Whether to store full data in localStorage or just metadata
    processApiResponse       // Function to process API response into state format
  } = config;

  // Constants
  const STATE_CHANGED_EVENT = `${name}StateChanged`;
  const STATE_INITIALIZED_EVENT = `${name}StateInitialized`;
  const STATE_CLEARED_EVENT = `${name}StateCleared`;

  // Private state store
  const states = {};

  /**
   * Update state for an item
   * @param {string|number} itemId - The item ID
   * @param {any} data - The data to store
   */
  const updateState = (itemId, data) => {
    // Ensure itemId is a string for consistency
    const itemIdStr = itemId.toString();
    
    // Update state
    states[itemIdStr] = {
      ...data,
      timestamp: Date.now()
    };
    
    // Dispatch event to notify all components
    if (typeof window !== 'undefined') {
      const event = new CustomEvent(STATE_CHANGED_EVENT, {
        detail: { itemId: itemIdStr, ...data }
      });
      window.dispatchEvent(event);
    }
    
    // Persist in localStorage for session persistence
    if (Platform.OS === 'web' && localStorageKey) {
      try {
        const globalStateString = localStorage.getItem(localStorageKey) || '{}';
        const globalState = JSON.parse(globalStateString);
        
        globalState[itemIdStr] = storeFullDataInStorage 
          ? { ...data, timestamp: Date.now() }
          : { timestamp: Date.now(), count: data.count || 0 };
        
        localStorage.setItem(localStorageKey, JSON.stringify(globalState));
      } catch (error) {
        console.error(`Error persisting ${name} state to localStorage:`, error);
      }
    }
  };

  /**
   * Get state for an item
   * @param {string|number} itemId - The item ID
   * @returns {object|null} - The state object, or null if not found
   */
  const getState = (itemId) => {
    const itemIdStr = itemId.toString();
    
    // First check memory state
    if (states[itemIdStr]) {
      return states[itemIdStr];
    }
    
    // Then check localStorage if available
    if (Platform.OS === 'web' && localStorageKey) {
      try {
        const globalStateString = localStorage.getItem(localStorageKey) || '{}';
        const globalState = JSON.parse(globalStateString);
        
        if (globalState[itemIdStr]) {
          // Update memory state from localStorage
          states[itemIdStr] = globalState[itemIdStr];
          return globalState[itemIdStr];
        }
      } catch (error) {
        console.error(`Error reading ${name} state from localStorage:`, error);
      }
    }
    
    return null;
  };

  /**
   * Initialize states from API
   * @param {Object} params - Parameters needed for initialization
   * @returns {Promise<void>}
   */
  const initializeStates = async (params) => {
    try {
      console.log(`Initializing ${name} states with params:`, params);
      
      // Clear existing states first
      clearStates();
      
      // Get data from API using the provided function
      const response = await fetchInitialData(params);
      
      if (response.success) {
        // Process data using the provided function
        const processedData = processApiResponse(response.data, params);
        
        // Update states with processed data
        Object.entries(processedData).forEach(([itemId, data]) => {
          updateState(itemId, data);
        });
        
        console.log(`${name} states initialized:`, Object.keys(states).length);
        
        // Dispatch event to notify components
        if (typeof window !== 'undefined') {
          const event = new CustomEvent(STATE_INITIALIZED_EVENT, {
            detail: { states: { ...states } }
          });
          window.dispatchEvent(event);
        }
      } else {
        console.error(`Failed to initialize ${name} states:`, response.msg);
      }
    } catch (error) {
      console.error(`Error initializing ${name} states:`, error);
    }
  };

  /**
   * Clear all states
   */
  const clearStates = () => {
    // Clear all states
    Object.keys(states).forEach(key => delete states[key]);
    
    console.log(`${name} states cleared`);
    
    // Clear localStorage if available
    if (Platform.OS === 'web' && localStorageKey) {
      try {
        localStorage.removeItem(localStorageKey);
      } catch (error) {
        console.error(`Error clearing ${name} states from localStorage:`, error);
      }
    }
    
    // Dispatch event to notify components
    if (typeof window !== 'undefined') {
      const event = new CustomEvent(STATE_CLEARED_EVENT);
      window.dispatchEvent(event);
    }
  };

  /**
   * Add an event listener for state changes
   * @param {Function} callback - The callback function to call when state changes
   * @param {string} eventType - The event type to listen for
   * @returns {Function} - A function to remove the event listener
   */
  const addStateListener = (callback, eventType = STATE_CHANGED_EVENT) => {
    if (typeof window !== 'undefined') {
      window.addEventListener(eventType, callback);
      return () => window.removeEventListener(eventType, callback);
    }
    return () => {};
  };

  // Return the public API
  return {
    updateState,
    getState,
    initializeStates,
    clearStates,
    addStateListener,
    STATE_CHANGED_EVENT,
    STATE_INITIALIZED_EVENT,
    STATE_CLEARED_EVENT
  };
};
