/**
 * CacheServiceHandler.gs
 * Wrapper for Google Apps Script CacheService
 */

const CacheServiceHandler = {
  /**
   * Save data to script cache
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} expirationSeconds - Expiration time in seconds
   */
  setScriptCache: function(key, value, expirationSeconds) {
    try {
      const cache = CacheService.getScriptCache();
      expirationSeconds = expirationSeconds || Constants.CACHE_DURATION;
    
      if (typeof value === 'object') {
        cache.put(key, JSON.stringify(value), expirationSeconds);
      } else {
        cache.put(key, String(value), expirationSeconds);
      }
    } catch (error) {
      Logger.log("Erro em setScriptCache: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get data from script cache
   * @param {string} key - Cache key
   * @returns {*} Cached value or null
   */
  getScriptCache: function(key) {
    try {
      const cache = CacheService.getScriptCache();
      const value = cache.get(key);
    
      if (!value) {
        return null;
      }
    
      // Try to parse as JSON
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    } catch (error) {
      Logger.log("Erro em getScriptCache: " + error.message);
      throw error;
    }
  },
  
  /**
   * Remove from script cache
   * @param {string} key - Cache key
   */
  removeScriptCache: function(key) {
    const cache = CacheService.getScriptCache();
    cache.remove(key);
  },
  
  /**
   * Save data to user cache
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} expirationSeconds - Expiration time in seconds
   */
  setUserCache: function(key, value, expirationSeconds) {
    try {
      const cache = CacheService.getUserCache();
      expirationSeconds = expirationSeconds || Constants.CACHE_DURATION;
    
      if (typeof value === 'object') {
        cache.put(key, JSON.stringify(value), expirationSeconds);
      } else {
        cache.put(key, String(value), expirationSeconds);
      }
    } catch (error) {
      Logger.log("Erro em setUserCache: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get data from user cache
   * @param {string} key - Cache key
   * @returns {*} Cached value or null
   */
  getUserCache: function(key) {
    try {
      const cache = CacheService.getUserCache();
      const value = cache.get(key);
    
      if (!value) {
        return null;
      }
    
      // Try to parse as JSON
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    } catch (error) {
      Logger.log("Erro em getUserCache: " + error.message);
      throw error;
    }
  },
  
  /**
   * Remove from user cache
   * @param {string} key - Cache key
   */
  removeUserCache: function(key) {
    const cache = CacheService.getUserCache();
    cache.remove(key);
  },
  
  /**
   * Save data to document cache
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} expirationSeconds - Expiration time in seconds
   */
  setDocumentCache: function(key, value, expirationSeconds) {
    try {
      const cache = CacheService.getDocumentCache();
      expirationSeconds = expirationSeconds || Constants.CACHE_DURATION;
    
      if (typeof value === 'object') {
        cache.put(key, JSON.stringify(value), expirationSeconds);
      } else {
        cache.put(key, String(value), expirationSeconds);
      }
    } catch (error) {
      Logger.log("Erro em setDocumentCache: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get data from document cache
   * @param {string} key - Cache key
   * @returns {*} Cached value or null
   */
  getDocumentCache: function(key) {
    try {
      const cache = CacheService.getDocumentCache();
      const value = cache.get(key);
    
      if (!value) {
        return null;
      }
    
      // Try to parse as JSON
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    } catch (error) {
      Logger.log("Erro em getDocumentCache: " + error.message);
      throw error;
    }
  },
  
  /**
   * Remove from document cache
   * @param {string} key - Cache key
   */
  removeDocumentCache: function(key) {
    const cache = CacheService.getDocumentCache();
    cache.remove(key);
  }
};

/**
 * Test cache service handler
 */
function testCacheServiceHandler() {
  try {
    CacheServiceHandler.setScriptCache('test_key', { name: 'Test', value: 123 }, 3600);
    Logger.log('Cached value: ' + JSON.stringify(CacheServiceHandler.getScriptCache('test_key')));
    CacheServiceHandler.removeScriptCache('test_key');
    Logger.log('After removal: ' + CacheServiceHandler.getScriptCache('test_key'));
  } catch (error) {
    Logger.log("Erro em testCacheServiceHandler: " + error.message);
    throw error;
  }
}

