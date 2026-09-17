/**
 * ScriptProperties.gs
 * Utilities for managing script properties
 */

const ScriptPropertiesUtil = {
  /**
   * Initialize default properties
   */
  initializeDefaults: function() {
    try {
      const props = PropertiesService.getScriptProperties();
    
      // Set default values if not already set
      if (!props.getProperty('APP_VERSION')) {
        props.setProperty('APP_VERSION', Constants.APP_VERSION);
      }
    
      if (!props.getProperty('INITIALIZED_AT')) {
        props.setProperty('INITIALIZED_AT', DateTimeUtils.getCurrentDateTime().date);
      }
    
      if (!props.getProperty(Constants.MEMBERS_KEY)) {
        props.setProperty(Constants.MEMBERS_KEY, JSON.stringify([]));
      }
    
      LoggerUtil.info('Script properties initialized');
    } catch (error) {
      Logger.log("Erro em initializeDefaults: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get all script properties
   * @returns {Object} All properties
   */
  getAll: function() {
    try {
      return PropertiesService.getScriptProperties().getProperties();
    } catch (error) {
      Logger.log("Erro em getAll: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get property value
   * @param {string} key - Property key
   * @param {*} defaultValue - Default value if not found
   * @returns {*} Property value
   */
  get: function(key, defaultValue) {
    try {
      const props = PropertiesService.getScriptProperties();
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
   * Set property value
   * @param {string} key - Property key
   * @param {*} value - Property value
   */
  set: function(key, value) {
    const props = PropertiesService.getScriptProperties();
    
    if (typeof value === 'object') {
      props.setProperty(key, JSON.stringify(value));
    } else {
      props.setProperty(key, String(value));
    }
  },
  
  /**
   * Delete property
   * @param {string} key - Property key
   */
  delete: function(key) {
    try {
      PropertiesService.getScriptProperties().deleteProperty(key);
    } catch (error) {
      Logger.log("Erro em delete: " + error.message);
      throw error;
    }
  },
  
  /**
   * Clear all properties
   */
  clear: function() {
    try {
      PropertiesService.getScriptProperties().deleteAllProperties();
    } catch (error) {
      Logger.log("Erro em clear: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get property size in bytes
   * @returns {number} Size in bytes
   */
  getSize: function() {
    try {
      const props = this.getAll();
      return JSON.stringify(props).length;
    } catch (error) {
      Logger.log("Erro em getSize: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get property count
   * @returns {number} Number of properties
   */
  getCount: function() {
    try {
      return Object.keys(this.getAll()).length;
    } catch (error) {
      Logger.log("Erro em getCount: " + error.message);
      throw error;
    }
  }
};

/**
 * Test script properties
 */
function testScriptProperties() {
  ScriptPropertiesUtil.initializeDefaults();
  Logger.log('Properties count: ' + ScriptPropertiesUtil.getCount());
  Logger.log('Properties size: ' + ScriptPropertiesUtil.getSize() + ' bytes');
}

