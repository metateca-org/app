/**
 * StringUtils.gs
 * String utilities for Metateca
 */

const StringUtils = {
  /**
   * Capitalize first letter of a string
   * @param {string} str - The string to capitalize
   * @returns {string} Capitalized string
   */
  capitalize: function(str) {
    try {
      if (typeof str !== 'string' || str.length === 0) {
        return str;
      }
      return str.charAt(0).toUpperCase() + str.slice(1);
    } catch (error) {
      Logger.log("Erro em capitalize: " + error.message);
      throw error;
    }
  },
  
  /**
   * Convert string to title case
   * @param {string} str - The string to convert
   * @returns {string} Title case string
   */
  toTitleCase: function(str) {
    try {
      if (typeof str !== 'string') {
        return str;
      }
      return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    } catch (error) {
      Logger.log("Erro em toTitleCase: " + error.message);
      throw error;
    }
  },
  
  /**
   * Convert string to camelCase
   * @param {string} str - The string to convert
   * @returns {string} camelCase string
   */
  toCamelCase: function(str) {
    try {
      if (typeof str !== 'string') {
        return str;
      }
      return str.replace(/(?:^\\w|[A-Z]|\\b\\w)/g, function(word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      }).replace(/\\s+/g, '');
    } catch (error) {
      Logger.log("Erro em toCamelCase: " + error.message);
      throw error;
    }
  },
  
  /**
   * Convert string to snake_case
   * @param {string} str - The string to convert
   * @returns {string} snake_case string
   */
  toSnakeCase: function(str) {
    try {
      if (typeof str !== 'string') {
        return str;
      }
      return str.replace(/\\W+/g, '_')
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .toLowerCase();
    } catch (error) {
      Logger.log("Erro em toSnakeCase: " + error.message);
      throw error;
    }
  },
  
  /**
   * Truncate string to maximum length
   * @param {string} str - The string to truncate
   * @param {number} maxLength - Maximum length
   * @param {string} suffix - Suffix to add (default '...')
   * @returns {string} Truncated string
   */
  truncate: function(str, maxLength, suffix) {
    try {
      if (typeof str !== 'string') {
        return str;
      }
      suffix = suffix || '...';
      if (str.length <= maxLength) {
        return str;
      }
      return str.substring(0, maxLength - suffix.length) + suffix;
    } catch (error) {
      Logger.log("Erro em truncate: " + error.message);
      throw error;
    }
  },
  
  /**
   * Repeat a string
   * @param {string} str - The string to repeat
   * @param {number} count - Number of times to repeat
   * @returns {string} Repeated string
   */
  repeat: function(str, count) {
    if (typeof str !== 'string' || count < 0) {
      return '';
    }
    return str.repeat(count);
  },
  
  /**
   * Reverse a string
   * @param {string} str - The string to reverse
   * @returns {string} Reversed string
   */
  reverse: function(str) {
    try {
      if (typeof str !== 'string') {
        return str;
      }
      return str.split('').reverse().join('');
    } catch (error) {
      Logger.log("Erro em reverse: " + error.message);
      throw error;
    }
  },
  
  /**
   * Check if string contains substring
   * @param {string} str - The string to search in
   * @param {string} substring - The substring to find
   * @param {boolean} caseSensitive - Whether to be case sensitive
   * @returns {boolean} True if contains
   */
  contains: function(str, substring, caseSensitive) {
    if (typeof str !== 'string' || typeof substring !== 'string') {
      return false;
    }
    if (caseSensitive === false) {
      return str.toLowerCase().includes(substring.toLowerCase());
    }
    return str.includes(substring);
  },
  
  /**
   * Replace all occurrences of a substring
   * @param {string} str - The string to search in
   * @param {string} search - The substring to find
   * @param {string} replace - The replacement string
   * @returns {string} String with replacements
   */
  replaceAll: function(str, search, replace) {
    try {
      if (typeof str !== 'string') {
        return str;
      }
      return str.split(search).join(replace);
    } catch (error) {
      Logger.log("Erro em replaceAll: " + error.message);
      throw error;
    }
  },
  
  /**
   * Remove whitespace from string
   * @param {string} str - The string to clean
   * @returns {string} String without whitespace
   */
  removeWhitespace: function(str) {
    try {
      if (typeof str !== 'string') {
        return str;
      }
      return str.replace(/\\s+/g, '');
    } catch (error) {
      Logger.log("Erro em removeWhitespace: " + error.message);
      throw error;
    }
  },
  
  /**
   * Pad string with character
   * @param {string} str - The string to pad
   * @param {number} length - Target length
   * @param {string} char - Character to pad with
   * @returns {string} Padded string
   */
  padStart: function(str, length, char) {
    if (typeof str !== 'string') {
      return str;
    }
    char = char || ' ';
    while (str.length < length) {
      str = char + str;
    }
    return str;
  },
  
  /**
   * Pad string end with character
   * @param {string} str - The string to pad
   * @param {number} length - Target length
   * @param {string} char - Character to pad with
   * @returns {string} Padded string
   */
  padEnd: function(str, length, char) {
    if (typeof str !== 'string') {
      return str;
    }
    char = char || ' ';
    while (str.length < length) {
      str = str + char;
    }
    return str;
  },
  
  /**
   * Generate a random string
   * @param {number} length - Length of the string
   * @returns {string} Random string
   */
  generateRandom: function(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
};

/**
 * Test string utilities
 */
function testStringUtils() {
  Logger.log('Capitalize: ' + StringUtils.capitalize('hello'));
  Logger.log('Title case: ' + StringUtils.toTitleCase('hello world'));
  Logger.log('Truncate: ' + StringUtils.truncate('This is a long string', 10));
  Logger.log('Contains: ' + StringUtils.contains('Hello World', 'world', false));
  Logger.log('Random: ' + StringUtils.generateRandom(10));
}
