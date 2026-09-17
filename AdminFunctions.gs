/**
 * AdminFunctions.gs
 * Administrative functions for Metateca
 */

const AdminFunctions = {
  /**
   * Reset all data
   * @returns {Object} Result of reset
   */
  resetAllData: function() {
    try {
      PropertiesServiceHandler.clearAllScriptProperties();
      LoggerUtil.info('All data has been reset');
      return { success: true, message: 'All data has been reset' };
    } catch (error) {
      ErrorHandler.logError('AdminFunctions.resetAllData', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Export team data
   * @returns {Object} Team data for export
   */
  exportTeamData: function() {
    try {
      const members = PropertiesServiceHandler.getScriptProperty(Constants.MEMBERS_KEY, []);
      const timestamp = DateTimeUtils.getCurrentDateTime();
      
      const exportData = {
        exportedAt: timestamp,
        teamSize: members.length,
        members: members,
        elementDistribution: ElementMapper.calculateTeamElementDistribution(members),
        modalityDistribution: ModalityMapper.calculateTeamModalityDistribution(members)
      };
      
      LoggerUtil.info('Team data exported', { teamSize: members.length });
      
      return { success: true, data: exportData };
    } catch (error) {
      ErrorHandler.logError('AdminFunctions.exportTeamData', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Import team data
   * @param {Object} importData - Data to import
   * @returns {Object} Result of import
   */
  importTeamData: function(importData) {
    try {
      if (!importData.members || !Array.isArray(importData.members)) {
        return { success: false, error: 'Invalid import data format' };
      }
      
      PropertiesServiceHandler.saveScriptProperty(Constants.MEMBERS_KEY, importData.members);
      
      LoggerUtil.info('Team data imported', { teamSize: importData.members.length });
      
      return {
        success: true,
        message: 'Team data imported successfully',
        teamSize: importData.members.length
      };
    } catch (error) {
      ErrorHandler.logError('AdminFunctions.importTeamData', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Get system statistics
   * @returns {Object} System statistics
   */
  getSystemStatistics: function() {
    try {
      const members = PropertiesServiceHandler.getScriptProperty(Constants.MEMBERS_KEY, []);
      const allProps = PropertiesServiceHandler.getAllScriptProperties();
      
      const stats = {
        teamSize: members.length,
        totalProperties: Object.keys(allProps).length,
        storageUsed: JSON.stringify(allProps).length,
        lastUpdated: DateTimeUtils.getCurrentDateTime(),
        elementDistribution: ElementMapper.calculateTeamElementDistribution(members),
        modalityDistribution: ModalityMapper.calculateTeamModalityDistribution(members)
      };
      
      return { success: true, data: stats };
    } catch (error) {
      ErrorHandler.logError('AdminFunctions.getSystemStatistics', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Get system logs
   * @returns {Object} System logs
   */
  getSystemLogs: function() {
    try {
      const logs = LoggerUtil.getAllLogs();
      return { success: true, data: logs };
    } catch (error) {
      ErrorHandler.logError('AdminFunctions.getSystemLogs', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Clear system logs
   * @returns {Object} Result of clearing logs
   */
  clearSystemLogs: function() {
    try {
      LoggerUtil.clearAllLogs();
      LoggerUtil.info('System logs cleared');
      return { success: true, message: 'System logs cleared' };
    } catch (error) {
      ErrorHandler.logError('AdminFunctions.clearSystemLogs', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Verify system health
   * @returns {Object} System health status
   */
  verifySystemHealth: function() {
    try {
      const health = {
        timestamp: DateTimeUtils.getCurrentDateTime(),
        checks: {}
      };
      
      // Check if members data exists
      try {
        const members = PropertiesServiceHandler.getScriptProperty(Constants.MEMBERS_KEY, []);
        health.checks.membersData = { status: 'OK', count: members.length };
      } catch (e) {
        health.checks.membersData = { status: 'ERROR', message: e.message };
      }
      
      // Check if API config is accessible
      try {
        const apiUrl = ApiConfig.getAstrologyApiUrl();
        health.checks.apiConfig = { status: 'OK', apiUrl: apiUrl };
      } catch (e) {
        health.checks.apiConfig = { status: 'ERROR', message: e.message };
      }
      
      // Check if constants are loaded
      try {
        const appName = Constants.APP_NAME;
        health.checks.constants = { status: 'OK', appName: appName };
      } catch (e) {
        health.checks.constants = { status: 'ERROR', message: e.message };
      }
      
      return { success: true, data: health };
    } catch (error) {
      ErrorHandler.logError('AdminFunctions.verifySystemHealth', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Generate system report
   * @returns {Object} System report
   */
  generateSystemReport: function() {
    try {
      const stats = this.getSystemStatistics();
      const health = this.verifySystemHealth();
      const logs = this.getSystemLogs();
      
      const report = {
        generatedAt: DateTimeUtils.getCurrentDateTime(),
        statistics: stats.data,
        health: health.data,
        recentLogs: {
          info: logs.data.INFO ? logs.data.INFO.split('\n').slice(-10) : [],
          errors: logs.data.ERROR ? logs.data.ERROR.split('\n').slice(-10) : []
        }
      };
      
      return { success: true, data: report };
    } catch (error) {
      ErrorHandler.logError('AdminFunctions.generateSystemReport', error);
      return { success: false, error: error.message };
    }
  }
};

/**
 * Test admin functions
 */
function testAdminFunctions() {
  try {
    try {
      Logger.log('System Health: ' + JSON.stringify(AdminFunctions.verifySystemHealth()));
      Logger.log('System Statistics: ' + JSON.stringify(AdminFunctions.getSystemStatistics()));
    } catch (error) {
      Logger.log("Erro em testAdminFunctions: " + error.message);
      throw error;
    }
  } catch (error) {
    Logger.log("Erro em testAdminFunctions: " + error.message);
    throw error;
  }
}
