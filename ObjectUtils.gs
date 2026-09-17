/**
 * ObjectUtils.gs
 * Object utilities for Metateca
 */

const ObjectUtils = {
  /**
   * Get object keys
   * @param {Object} obj - The object
   * @returns {Array} Array of keys
   */
  keys: function(obj) {
    try {
      if (typeof obj !== 'object' || obj === null) {
        return [];
      }
      return Object.keys(obj);
    } catch (error) {
      Logger.log("Erro em keys: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get object values
   * @param {Object} obj - The object
   * @returns {Array} Array of values
   */
  values: function(obj) {
    try {
      if (typeof obj !== 'object' || obj === null) {
        return [];
      }
      return Object.values(obj);
    } catch (error) {
      Logger.log("Erro em values: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get object entries
   * @param {Object} obj - The object
   * @returns {Array} Array of [key, value] pairs
   */
  entries: function(obj) {
    try {
      if (typeof obj !== 'object' || obj === null) {
        return [];
      }
      return Object.entries(obj);
    } catch (error) {
      Logger.log("Erro em entries: " + error.message);
      throw error;
    }
  },
  
  /**
   * Check if object has property
   * @param {Object} obj - The object
   * @param {string} key - The property key
   * @returns {boolean} True if has property
   */
  hasProperty: function(obj, key) {
    if (typeof obj !== 'object' || obj === null) {
      return false;
    }
    return obj.hasOwnProperty(key);
  },
  
  /**
   * Get property value
   * @param {Object} obj - The object
   * @param {string} key - The property key
   * @param {*} defaultValue - Default value if not found
   * @returns {*} Property value or default
   */
  getProperty: function(obj, key, defaultValue) {
    if (typeof obj !== 'object' || obj === null) {
      return defaultValue;
    }
    return obj.hasOwnProperty(key) ? obj[key] : defaultValue;
  },
  
  /**
   * Set property value
   * @param {Object} obj - The object
   * @param {string} key - The property key
   * @param {*} value - The value to set
   * @returns {Object} Modified object
   */
  setProperty: function(obj, key, value) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
    obj[key] = value;
    return obj;
  },
  
  /**
   * Delete property
   * @param {Object} obj - The object
   * @param {string} key - The property key
   * @returns {Object} Modified object
   */
  deleteProperty: function(obj, key) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
    delete obj[key];
    return obj;
  },
  
  /**
   * Merge objects
   * @param {Object} obj1 - First object
   * @param {Object} obj2 - Second object
   * @returns {Object} Merged object
   */
  merge: function(obj1, obj2) {
    try {
      if (typeof obj1 !== 'object' || obj1 === null) {
        return obj2;
      }
      if (typeof obj2 !== 'object' || obj2 === null) {
        return obj1;
      }
      return Object.assign({}, obj1, obj2);
    } catch (error) {
      Logger.log("Erro em merge: " + error.message);
      throw error;
    }
  },
  
  /**
   * Deep merge objects
   * @param {Object} obj1 - First object
   * @param {Object} obj2 - Second object
   * @returns {Object} Deep merged object
   */
  deepMerge: function(obj1, obj2) {
    try {
      if (typeof obj1 !== 'object' || obj1 === null) {
        return obj2;
      }
      if (typeof obj2 !== 'object' || obj2 === null) {
        return obj1;
      }
    
      const result = Object.assign({}, obj1);
      for (let key in obj2) {
        if (obj2.hasOwnProperty(key)) {
          if (typeof obj2[key] === 'object' && obj2[key] !== null && typeof result[key] === 'object' && result[key] !== null) {
            result[key] = this.deepMerge(result[key], obj2[key]);
          } else {
            result[key] = obj2[key];
          }
        }
      }
      return result;
    } catch (error) {
      Logger.log("Erro em deepMerge: " + error.message);
      throw error;
    }
  },
  
  /**
   * Clone object
   * @param {Object} obj - The object to clone
   * @returns {Object} Cloned object
   */
  clone: function(obj) {
    try {
      if (typeof obj !== 'object' || obj === null) {
        return obj;
      }
      return JSON.parse(JSON.stringify(obj));
    } catch (error) {
      Logger.log("Erro em clone: " + error.message);
      throw error;
    }
  },
  
  /**
   * Check if object is empty
   * @param {Object} obj - The object
   * @returns {boolean} True if empty
   */
  isEmpty: function(obj) {
    try {
      if (typeof obj !== 'object' || obj === null) {
        return true;
      }
      return Object.keys(obj).length === 0;
    } catch (error) {
      Logger.log("Erro em isEmpty: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get object size
   * @param {Object} obj - The object
   * @returns {number} Number of properties
   */
  size: function(obj) {
    try {
      if (typeof obj !== 'object' || obj === null) {
        return 0;
      }
      return Object.keys(obj).length;
    } catch (error) {
      Logger.log("Erro em size: " + error.message);
      throw error;
    }
  },
  
  /**
   * Convert object to JSON string
   * @param {Object} obj - The object
   * @param {number} spaces - Number of spaces for indentation
   * @returns {string} JSON string
   */
  toJSON: function(obj, spaces) {
    try {
      try {
        return JSON.stringify(obj, null, spaces || 0);
      } catch (e) {
        return '';
      }
    } catch (error) {
      Logger.log("Erro em toJSON: " + error.message);
      throw error;
    }
  },
  
  /**
   * Parse JSON string to object
   * @param {string} jsonString - The JSON string
   * @returns {Object} Parsed object or null
   */
  fromJSON: function(jsonString) {
    try {
      try {
        return JSON.parse(jsonString);
      } catch (e) {
        return null;
      }
    } catch (error) {
      Logger.log("Erro em fromJSON: " + error.message);
      throw error;
    }
  }
};

/**
 * Test object utilities
 */
function testObjectUtils() {
  try {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { c: 3, d: 4 };
    Logger.log('Keys: ' + JSON.stringify(ObjectUtils.keys(obj1)));
    Logger.log('Values: ' + JSON.stringify(ObjectUtils.values(obj1)));
    Logger.log('Merged: ' + JSON.stringify(ObjectUtils.merge(obj1, obj2)));
    Logger.log('Size: ' + ObjectUtils.size(obj1));
    Logger.log('Is empty: ' + ObjectUtils.isEmpty(obj1));
  } catch (error) {
    Logger.log("Erro em testObjectUtils: " + error.message);
    throw error;
  }
}
