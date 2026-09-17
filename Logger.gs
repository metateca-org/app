/**
 * Logger.gs
 * Logging utilities for Metateca
 */

const LoggerUtil = {
  LOG_LEVELS: {
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR'
  },
  
  /**
   * Log a message with level
   * @param {string} level - The log level
   * @param {string} message - The message to log
   * @param {Object} data - Optional data to log
   */
  log: function(level, message, data) {
    try {
      const timestamp = new Date().toISOString();
      let logMessage = `[${timestamp}] [${level}] ${message}`;
    
      if (data) {
        logMessage += ' | Data: ' + JSON.stringify(data);
      }
    
      Logger.log(logMessage);
    
      // Store in properties for later retrieval
      this.storeLog(level, message, data);
    } catch (error) {
      Logger.log("Erro em log: " + error.message);
      throw error;
    }
  },
  
  /**
   * Log debug message
   * @param {string} message - The message
   * @param {Object} data - Optional data
   */
  debug: function(message, data) {
    this.log(this.LOG_LEVELS.DEBUG, message, data);
  },
  
  /**
   * Log info message
   * @param {string} message - The message
   * @param {Object} data - Optional data
   */
  info: function(message, data) {
    this.log(this.LOG_LEVELS.INFO, message, data);
  },
  
  /**
   * Log warning message
   * @param {string} message - The message
   * @param {Object} data - Optional data
   */
  warn: function(message, data) {
    this.log(this.LOG_LEVELS.WARN, message, data);
  },
  
  /**
   * Log error message
   * @param {string} message - The message
   * @param {Object} data - Optional data
   */
  error: function(message, data) {
    this.log(this.LOG_LEVELS.ERROR, message, data);
  },
  
  /**
   * Store log in properties
   * @param {string} level - The log level
   * @param {string} message - The message
   * @param {Object} data - Optional data
   */
  storeLog: function(level, message, data) {
    try {
      const props = PropertiesService.getScriptProperties();
      const logKey = 'log_' + level;
      const existingLog = props.getProperty(logKey) || '';
      const timestamp = new Date().toISOString();
    
      let newEntry = `[${timestamp}] ${message}`;
      if (data) {
        newEntry += ' | ' + JSON.stringify(data);
      }
    
      const updatedLog = existingLog + '\n' + newEntry;
    
      // Keep only last 100 entries to avoid storage limits
      const entries = updatedLog.split('\n').slice(-100);
      props.setProperty(logKey, entries.join('\n'));
    } catch (error) {
      Logger.log("Erro em storeLog: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get logs by level
   * @param {string} level - The log level
   * @returns {string} The logs
   */
  getLogs: function(level) {
    try {
      const logKey = 'log_' + level;
      return PropertiesService.getScriptProperties().getProperty(logKey) || '';
    } catch (error) {
      Logger.log("Erro em getLogs: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get all logs
   * @returns {Object} Object with logs by level
   */
  getAllLogs: function() {
    try {
      const props = PropertiesService.getScriptProperties();
      const logs = {};
    
      for (let level in this.LOG_LEVELS) {
        const logKey = 'log_' + this.LOG_LEVELS[level];
        logs[this.LOG_LEVELS[level]] = props.getProperty(logKey) || '';
      }
    
      return logs;
    } catch (error) {
      Logger.log("Erro em getAllLogs: " + error.message);
      throw error;
    }
  },
  
  /**
   * Clear logs by level
   * @param {string} level - The log level
   */
  clearLogs: function(level) {
    try {
      const logKey = 'log_' + level;
      PropertiesService.getScriptProperties().deleteProperty(logKey);
    } catch (error) {
      Logger.log("Erro em clearLogs: " + error.message);
      throw error;
    }
  },
  
  /**
   * Clear all logs
   */
  clearAllLogs: function() {
    try {
      const props = PropertiesService.getScriptProperties();
      for (let level in this.LOG_LEVELS) {
        const logKey = 'log_' + this.LOG_LEVELS[level];
        props.deleteProperty(logKey);
      }
    } catch (error) {
      Logger.log("Erro em clearAllLogs: " + error.message);
      throw error;
    }
  }
};

/**
 * Test logging
 */
function testLogging() {
  try {
    try {
      LoggerUtil.debug('Debug message', { test: true });
      LoggerUtil.info('Info message', { test: true });
      LoggerUtil.warn('Warning message', { test: true });
      LoggerUtil.error('Error message', { test: true });
  
      Logger.log('All logs:');
      Logger.log(JSON.stringify(LoggerUtil.getAllLogs()));
    } catch (error) {
      Logger.log("Erro em testLogging: " + error.message);
      throw error;
    }
  } catch (error) {
    Logger.log("Erro em testLogging: " + error.message);
    throw error;
  }
}
