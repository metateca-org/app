/**
 * ArrayUtils.gs
 * Array utilities for Metateca
 */

const ArrayUtils = {
  /**
   * Check if array contains value
   * @param {Array} arr - The array
   * @param {*} value - The value to find
   * @returns {boolean} True if contains
   */
  contains: function(arr, value) {
    if (!Array.isArray(arr)) {
      return false;
    }
    return arr.includes(value);
  },
  
  /**
   * Find index of value in array
   * @param {Array} arr - The array
   * @param {*} value - The value to find
   * @returns {number} Index or -1 if not found
   */
  indexOf: function(arr, value) {
    if (!Array.isArray(arr)) {
      return -1;
    }
    return arr.indexOf(value);
  },
  
  /**
   * Remove element from array
   * @param {Array} arr - The array
   * @param {*} value - The value to remove
   * @returns {Array} New array without the value
   */
  remove: function(arr, value) {
    try {
      if (!Array.isArray(arr)) {
        return arr;
      }
      return arr.filter(item => item !== value);
    } catch (error) {
      Logger.log("Erro em remove: " + error.message);
      throw error;
    }
  },
  
  /**
   * Remove element at index
   * @param {Array} arr - The array
   * @param {number} index - The index to remove
   * @returns {Array} New array without the element
   */
  removeAt: function(arr, index) {
    try {
      if (!Array.isArray(arr) || index < 0 || index >= arr.length) {
        return arr;
      }
      return arr.slice(0, index).concat(arr.slice(index + 1));
    } catch (error) {
      Logger.log("Erro em removeAt: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get unique values from array
   * @param {Array} arr - The array
   * @returns {Array} Array with unique values
   */
  unique: function(arr) {
    if (!Array.isArray(arr)) {
      return arr;
    }
    return [...new Set(arr)];
  },
  
  /**
   * Flatten nested array
   * @param {Array} arr - The array to flatten
   * @param {number} depth - Depth to flatten (default 1)
   * @returns {Array} Flattened array
   */
  flatten: function(arr, depth) {
    try {
      if (!Array.isArray(arr)) {
        return arr;
      }
      depth = depth || 1;
      let result = [];
      for (let item of arr) {
        if (Array.isArray(item) && depth > 0) {
          result = result.concat(this.flatten(item, depth - 1));
        } else {
          result.push(item);
        }
      }
      return result;
    } catch (error) {
      Logger.log("Erro em flatten: " + error.message);
      throw error;
    }
  },
  
  /**
   * Sort array
   * @param {Array} arr - The array to sort
   * @param {string} order - 'asc' or 'desc'
   * @returns {Array} Sorted array
   */
  sort: function(arr, order) {
    try {
      if (!Array.isArray(arr)) {
        return arr;
      }
      order = order || 'asc';
      const sorted = [...arr].sort();
      return order === 'desc' ? sorted.reverse() : sorted;
    } catch (error) {
      Logger.log("Erro em sort: " + error.message);
      throw error;
    }
  },
  
  /**
   * Reverse array
   * @param {Array} arr - The array to reverse
   * @returns {Array} Reversed array
   */
  reverse: function(arr) {
    if (!Array.isArray(arr)) {
      return arr;
    }
    return [...arr].reverse();
  },
  
  /**
   * Get first element
   * @param {Array} arr - The array
   * @returns {*} First element or undefined
   */
  first: function(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
      return undefined;
    }
    return arr[0];
  },
  
  /**
   * Get last element
   * @param {Array} arr - The array
   * @returns {*} Last element or undefined
   */
  last: function(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
      return undefined;
    }
    return arr[arr.length - 1];
  },
  
  /**
   * Get element at index
   * @param {Array} arr - The array
   * @param {number} index - The index
   * @returns {*} Element or undefined
   */
  at: function(arr, index) {
    if (!Array.isArray(arr) || index < 0 || index >= arr.length) {
      return undefined;
    }
    return arr[index];
  },
  
  /**
   * Slice array
   * @param {Array} arr - The array
   * @param {number} start - Start index
   * @param {number} end - End index
   * @returns {Array} Sliced array
   */
  slice: function(arr, start, end) {
    try {
      if (!Array.isArray(arr)) {
        return arr;
      }
      return arr.slice(start, end);
    } catch (error) {
      Logger.log("Erro em slice: " + error.message);
      throw error;
    }
  },
  
  /**
   * Concat arrays
   * @param {Array} arr1 - First array
   * @param {Array} arr2 - Second array
   * @returns {Array} Concatenated array
   */
  concat: function(arr1, arr2) {
    try {
      if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
        return arr1;
      }
      return arr1.concat(arr2);
    } catch (error) {
      Logger.log("Erro em concat: " + error.message);
      throw error;
    }
  },
  
  /**
   * Join array elements
   * @param {Array} arr - The array
   * @param {string} separator - Separator string
   * @returns {string} Joined string
   */
  join: function(arr, separator) {
    try {
      if (!Array.isArray(arr)) {
        return '';
      }
      separator = separator || ',';
      return arr.join(separator);
    } catch (error) {
      Logger.log("Erro em join: " + error.message);
      throw error;
    }
  },
  
  /**
   * Check if array is empty
   * @param {Array} arr - The array
   * @returns {boolean} True if empty
   */
  isEmpty: function(arr) {
    return !Array.isArray(arr) || arr.length === 0;
  },
  
  /**
   * Get array length
   * @param {Array} arr - The array
   * @returns {number} Length or 0
   */
  length: function(arr) {
    return Array.isArray(arr) ? arr.length : 0;
  }
};

/**
 * Test array utilities
 */
function testArrayUtils() {
  try {
    const arr = [1, 2, 3, 2, 4, 5];
    Logger.log('Contains 3: ' + ArrayUtils.contains(arr, 3));
    Logger.log('Unique: ' + JSON.stringify(ArrayUtils.unique(arr)));
    Logger.log('First: ' + ArrayUtils.first(arr));
    Logger.log('Last: ' + ArrayUtils.last(arr));
    Logger.log('Sorted: ' + JSON.stringify(ArrayUtils.sort(arr, 'asc')));
  } catch (error) {
    Logger.log("Erro em testArrayUtils: " + error.message);
    throw error;
  }
}
