/**
 * UserProperties.gs
 * Utilities for managing user properties
 */

const UserPropertiesUtil = {
  /**
   * Get all user properties
   * @returns {Object} All user properties
   */
  getAll: function() {
    try {
      return PropertiesService.getUserProperties().getProperties();
    } catch (error) {
      Logger.log("Erro em getAll: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get user property value
   * @param {string} key - Property key
   * @param {*} defaultValue - Default value if not found
   * @returns {*} Property value
   */
  get: function(key, defaultValue) {
    try {
      const props = PropertiesService.getUserProperties();
      const value = props.getProperty(key);
    
      if (value === null || value === undefined) {
        return defaultValue;
      }
    
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    } catch (error) {
      Logger.log("Erro em get: " + error.message);
      throw error;
    }
  },
  
  /**
   * Set user property value
   * @param {string} key - Property key
   * @param {*} value - Property value
   */
  set: function(key, value) {
    const props = PropertiesService.getUserProperties();
    
    if (typeof value === 'object') {
      props.setProperty(key, JSON.stringify(value));
    } else {
      props.setProperty(key, String(value));
    }
  },
  
  /**
   * Delete user property
   * @param {string} key - Property key
   */
  delete: function(key) {
    try {
      PropertiesService.getUserProperties().deleteProperty(key);
    } catch (error) {
      Logger.log("Erro em delete: " + error.message);
      throw error;
    }
  },
  
  /**
   * Clear all user properties
   */
  clear: function() {
    try {
      PropertiesService.getUserProperties().deleteAllProperties();
    } catch (error) {
      Logger.log("Erro em clear: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get user preferences
   * @returns {Object} User preferences
   */
  getPreferences: function() {
    try {
      return this.get('preferences', {
        theme: 'light',
        language: 'pt-BR',
        notifications: true,
        emailUpdates: false
      });
    } catch (error) {
      Logger.log("Erro em getPreferences: " + error.message);
      throw error;
    }
  },
  
  /**
   * Set user preferences
   * @param {Object} preferences - User preferences
   */
  setPreferences: function(preferences) {
    this.set('preferences', preferences);
  },
  
  /**
   * Get user theme
   * @returns {string} Theme name
   */
  getTheme: function() {
    const prefs = this.getPreferences();
    return prefs.theme || 'light';
  },
  
  /**
   * Set user theme
   * @param {string} theme - Theme name
   */
  setTheme: function(theme) {
    const prefs = this.getPreferences();
    prefs.theme = theme;
    this.setPreferences(prefs);
  },
  
  /**
   * Get user language
   * @returns {string} Language code
   */
  getLanguage: function() {
    const prefs = this.getPreferences();
    return prefs.language || 'pt-BR';
  },
  
  /**
   * Set user language
   * @param {string} language - Language code
   */
  setLanguage: function(language) {
    const prefs = this.getPreferences();
    prefs.language = language;
    this.setPreferences(prefs);
  }
};

/**
 * Test user properties
 */
function testUserProperties() {
  try {
    UserPropertiesUtil.setPreferences({
      theme: 'dark',
      language: 'en-US',
      notifications: true,
      emailUpdates: true
    });
  
    Logger.log('User preferences: ' + JSON.stringify(UserPropertiesUtil.getPreferences()));
    Logger.log('User theme: ' + UserPropertiesUtil.getTheme());
    Logger.log('User language: ' + UserPropertiesUtil.getLanguage());
  } catch (error) {
    Logger.log("Erro em testUserProperties: " + error.message);
    throw error;
  }
}

