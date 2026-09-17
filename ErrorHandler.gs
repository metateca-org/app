/**
 * ErrorHandler.gs
 * Centralized error handling for Metateca
 */

const ErrorHandler = {
  /**
   * Log an error with context
   * @param {string} context - The context where the error occurred
   * @param {Error} error - The error object
   */
  logError: function(context, error) {
    try {
      const timestamp = new Date().toISOString();
      const errorMessage = `[${timestamp}] Error in ${context}: ${error.message}`;
      Logger.log(errorMessage);
      Logger.log('Stack: ' + error.stack);
    
      // Store error in properties for debugging
      const errorLog = PropertiesService.getScriptProperties().getProperty('error_log') || '';
      const updatedLog = errorLog + '\n' + errorMessage;
      PropertiesService.getScriptProperties().setProperty('error_log', updatedLog);
    } catch (error) {
      Logger.log("Erro em logError: " + error.message);
      throw error;
    }
  },
  
  /**
   * Create a standardized error response
   * @param {string} message - The error message
   * @param {number} code - The error code
   * @returns {Object} Standardized error response
   */
  createErrorResponse: function(message, code) {
    try {
      return {
        success: false,
        error: {
          message: message,
          code: code,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      Logger.log("Erro em createErrorResponse: " + error.message);
      throw error;
    }
  },
  
  /**
   * Handle API errors
   * @param {Object} response - The API response object
   * @param {string} apiName - The name of the API
   * @returns {Object} Parsed error or null if no error
   */
  handleApiError: function(response, apiName) {
    try {
      if (response.getResponseCode() >= 400) {
        const errorData = {
          api: apiName,
          statusCode: response.getResponseCode(),
          message: response.getContentText(),
          timestamp: new Date().toISOString()
        };
        Logger.log('API Error: ' + JSON.stringify(errorData));
        return errorData;
      }
      return null;
    } catch (error) {
      Logger.log("Erro em handleApiError: " + error.message);
      throw error;
    }
  },
  
  /**
   * Validate required parameters
   * @param {Object} data - The data object to validate
   * @param {Array} requiredFields - Array of required field names
   * @returns {Object} Validation result with success flag and error message
   */
  validateRequired: function(data, requiredFields) {
    try {
      const missing = [];
      for (let field of requiredFields) {
        if (!data[field]) {
          missing.push(field);
        }
      }
    
      if (missing.length > 0) {
        return {
          valid: false,
          message: 'Missing required fields: ' + missing.join(', ')
        };
      }
    
      return {
        valid: true,
        message: 'Validation passed'
      };
    } catch (error) {
      Logger.log("Erro em validateRequired: " + error.message);
      throw error;
    }
  },
  
  /**
   * Validate data type
   * @param {*} value - The value to validate
   * @param {string} expectedType - The expected type
   * @returns {boolean} True if type matches
   */
  validateType: function(value, expectedType) {
    const actualType = typeof value;
    if (expectedType === 'array') {
      return Array.isArray(value);
    }
    return actualType === expectedType;
  },
  
  /**
   * Get the error log
   * @returns {string} The error log
   */
  getErrorLog: function() {
    try {
      return PropertiesService.getScriptProperties().getProperty('error_log') || '';
    } catch (error) {
      Logger.log("Erro em getErrorLog: " + error.message);
      throw error;
    }
  },
  
  /**
   * Clear the error log
   */
  clearErrorLog: function() {
    try {
      PropertiesService.getScriptProperties().deleteProperty('error_log');
    } catch (error) {
      Logger.log("Erro em clearErrorLog: " + error.message);
      throw error;
    }
  }
};

/**
 * Test error handling
 */
function testErrorHandling() {
  try {
    try {
      throw new Error('Test error message');
    } catch (error) {
      ErrorHandler.logError('testErrorHandling', error);
      const response = ErrorHandler.createErrorResponse(error.message, 500);
      Logger.log('Error Response: ' + JSON.stringify(response));
    }
  } catch (error) {
    Logger.log("Erro em testErrorHandling: " + error.message);
    throw error;
  }
}
