/**
 * DocumentProperties.gs
 * Utilities for managing document properties
 */

const DocumentPropertiesUtil = {
  /**
   * Get all document properties
   * @returns {Object} All document properties
   */
  getAll: function() {
    try {
      return PropertiesService.getDocumentProperties().getProperties();
    } catch (error) {
      Logger.log("Erro em getAll: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get document property value
   * @param {string} key - Property key
   * @param {*} defaultValue - Default value if not found
   * @returns {*} Property value
   */
  get: function(key, defaultValue) {
    try {
      const props = PropertiesService.getDocumentProperties();
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
   * Set document property value
   * @param {string} key - Property key
   * @param {*} value - Property value
   */
  set: function(key, value) {
    const props = PropertiesService.getDocumentProperties();
    
    if (typeof value === 'object') {
      props.setProperty(key, JSON.stringify(value));
    } else {
      props.setProperty(key, String(value));
    }
  },
  
  /**
   * Delete document property
   * @param {string} key - Property key
   */
  delete: function(key) {
    try {
      PropertiesService.getDocumentProperties().deleteProperty(key);
    } catch (error) {
      Logger.log("Erro em delete: " + error.message);
      throw error;
    }
  },
  
  /**
   * Clear all document properties
   */
  clear: function() {
    try {
      PropertiesService.getDocumentProperties().deleteAllProperties();
    } catch (error) {
      Logger.log("Erro em clear: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get document metadata
   * @returns {Object} Document metadata
   */
  getMetadata: function() {
    try {
      return this.get('metadata', {
        createdAt: DateTimeUtils.getCurrentDateTime(),
        lastModified: DateTimeUtils.getCurrentDateTime(),
        version: '1.0'
      });
    } catch (error) {
      Logger.log("Erro em getMetadata: " + error.message);
      throw error;
    }
  },
  
  /**
   * Update document metadata
   */
  updateMetadata: function() {
    const metadata = this.getMetadata();
    metadata.lastModified = DateTimeUtils.getCurrentDateTime();
    this.set('metadata', metadata);
  },
  
  /**
   * Get document configuration
   * @returns {Object} Document configuration
   */
  getConfiguration: function() {
    try {
      return this.get('configuration', {
        autoSave: true,
        syncInterval: 300,
        maxRetries: 3
      });
    } catch (error) {
      Logger.log("Erro em getConfiguration: " + error.message);
      throw error;
    }
  },
  
  /**
   * Set document configuration
   * @param {Object} config - Configuration object
   */
  setConfiguration: function(config) {
    this.set('configuration', config);
  }
};

/**
 * Test document properties
 */
function testDocumentProperties() {
  try {
    try {
      DocumentPropertiesUtil.set('test_key', { name: 'Test', value: 123 });
      Logger.log('Document property: ' + JSON.stringify(DocumentPropertiesUtil.get('test_key')));
  
      DocumentPropertiesUtil.updateMetadata();
      Logger.log('Document metadata: ' + JSON.stringify(DocumentPropertiesUtil.getMetadata()));
    } catch (error) {
      Logger.log("Erro em testDocumentProperties: " + error.message);
      throw error;
    }
  } catch (error) {
    Logger.log("Erro em testDocumentProperties: " + error.message);
    throw error;
  }
}

