/**
 * PropertiesServiceHandler.gs
 * Wrapper for Google Apps Script PropertiesService
 */

const PropertiesServiceHandler = {
  /**
   * Save data to script properties
   * @param {string} key - The property key
   * @param {*} value - The value to save
   */
  saveScriptProperty: function(key, value) {
    try {
      const props = PropertiesService.getScriptProperties();
      if (typeof value === 'object') {
        props.setProperty(key, JSON.stringify(value));
      } else {
        props.setProperty(key, String(value));
      }
    } catch (error) {
      Logger.log("Erro em saveScriptProperty: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get data from script properties
   * @param {string} key - The property key
   * @param {*} defaultValue - Default value if not found
   * @returns {*} The property value
   */
  getScriptProperty: function(key, defaultValue) {
    try {
      const props = PropertiesService.getScriptProperties();
      const value = props.getProperty(key);
    
      if (value === null || value === undefined) {
        return defaultValue;
      }
    
      // Try to parse as JSON
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    } catch (error) {
      Logger.log("Erro em getScriptProperty: " + error.message);
      throw error;
    }
  },
  
  /**
   * Delete script property
   * @param {string} key - The property key
   */
  deleteScriptProperty: function(key) {
    PropertiesService.getScriptProperties().deleteProperty(key);
  },
  
  /**
   * Save data to user properties
   * @param {string} key - The property key
   * @param {*} value - The value to save
   */
  saveUserProperty: function(key, value) {
    try {
      const props = PropertiesService.getUserProperties();
      if (typeof value === 'object') {
        props.setProperty(key, JSON.stringify(value));
      } else {
        props.setProperty(key, String(value));
      }
    } catch (error) {
      Logger.log("Erro em saveUserProperty: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get data from user properties
   * @param {string} key - The property key
   * @param {*} defaultValue - Default value if not found
   * @returns {*} The property value
   */
  getUserProperty: function(key, defaultValue) {
    try {
      const props = PropertiesService.getUserProperties();
      const value = props.getProperty(key);
    
      if (value === null || value === undefined) {
        return defaultValue;
      }
    
      // Try to parse as JSON
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    } catch (error) {
      Logger.log("Erro em getUserProperty: " + error.message);
      throw error;
    }
  },
  
  /**
   * Delete user property
   * @param {string} key - The property key
   */
  deleteUserProperty: function(key) {
    PropertiesService.getUserProperties().deleteProperty(key);
  },
  
  /**
   * Save data to document properties
   * @param {string} key - The property key
   * @param {*} value - The value to save
   */
  saveDocumentProperty: function(key, value) {
    try {
      const props = PropertiesService.getDocumentProperties();
      if (typeof value === 'object') {
        props.setProperty(key, JSON.stringify(value));
      } else {
        props.setProperty(key, String(value));
      }
    } catch (error) {
      Logger.log("Erro em saveDocumentProperty: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get data from document properties
   * @param {string} key - The property key
   * @param {*} defaultValue - Default value if not found
   * @returns {*} The property value
   */
  getDocumentProperty: function(key, defaultValue) {
    try {
      const props = PropertiesService.getDocumentProperties();
      const value = props.getProperty(key);
    
      if (value === null || value === undefined) {
        return defaultValue;
      }
    
      // Try to parse as JSON
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    } catch (error) {
      Logger.log("Erro em getDocumentProperty: " + error.message);
      throw error;
    }
  },
  
  /**
   * Delete document property
   * @param {string} key - The property key
   */
  deleteDocumentProperty: function(key) {
    PropertiesService.getDocumentProperties().deleteProperty(key);
  },
  
  /**
   * Get all script properties
   * @returns {Object} All script properties
   */
  getAllScriptProperties: function() {
    return PropertiesService.getScriptProperties().getProperties();
  },
  
  /**
   * Get all user properties
   * @returns {Object} All user properties
   */
  getAllUserProperties: function() {
    try {
      return PropertiesService.getUserProperties().getProperties();
    } catch (error) {
      Logger.log("Erro em getAllUserProperties: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get all document properties
   * @returns {Object} All document properties
   */
  getAllDocumentProperties: function() {
    try {
      return PropertiesService.getDocumentProperties().getProperties();
    } catch (error) {
      Logger.log("Erro em getAllDocumentProperties: " + error.message);
      throw error;
    }
  },
  
  /**
   * Clear all script properties
   */
  clearAllScriptProperties: function() {
    try {
      PropertiesService.getScriptProperties().deleteAllProperties();
    } catch (error) {
      Logger.log("Erro em clearAllScriptProperties: " + error.message);
      throw error;
    }
  },
  
  /**
   * Clear all user properties
   */
  clearAllUserProperties: function() {
    try {
      PropertiesService.getUserProperties().deleteAllProperties();
    } catch (error) {
      Logger.log("Erro em clearAllUserProperties: " + error.message);
      throw error;
    }
  },
  
  /**
   * Clear all document properties
   */
  clearAllDocumentProperties: function() {
    try {
      PropertiesService.getDocumentProperties().deleteAllProperties();
    } catch (error) {
      Logger.log("Erro em clearAllDocumentProperties: " + error.message);
      throw error;
    }
  }
};

/**
 * Test properties service handler
 */
function testPropertiesServiceHandler() {
  try {
    PropertiesServiceHandler.saveScriptProperty('test_key', { name: 'Test', value: 123 });
    Logger.log('Saved property: ' + JSON.stringify(PropertiesServiceHandler.getScriptProperty('test_key')));
  
    PropertiesServiceHandler.saveUserProperty('user_test', 'User data');
    Logger.log('User property: ' + PropertiesServiceHandler.getUserProperty('user_test'));
  } catch (error) {
    Logger.log("Erro em testPropertiesServiceHandler: " + error.message);
    throw error;
  }
}
