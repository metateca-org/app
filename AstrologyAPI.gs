/**
 * AstrologyAPI.gs
 * Integration with AstrologyAPI for natal chart calculations
 */

const AstrologyAPIService = {
  /**
   * Get natal chart data from AstrologyAPI
   * @param {Object} birthData - Birth data object
   * @returns {Object} Natal chart data
   */
  getNatalChart: function(birthData) {
    if (!ApiConfig.isAstrologyApiEnabled()) {
      LoggerUtil.warn('AstrologyAPI is not enabled');
      return { success: false, error: 'API not enabled' };
    }
    
    const validation = Validation.validateBirthData(birthData);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }
    
    try {
      const url = ApiConfig.getEndpointUrl('ASTROLOGY_API', 'natalChart');
      const apiKey = ApiConfig.getAstrologyApiKey();
      
      const payload = {
        date: birthData.birthDate,
        time: birthData.birthTime,
        latitude: birthData.latitude,
        longitude: birthData.longitude,
        timezone: birthData.timezone || 'UTC'
      };
      
      const response = UrlFetchServiceWrapper.fetchJSON(url, {
        method: 'post',
        payload: JSON.stringify(payload),
        headers: {
          'Authorization': 'Bearer ' + apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.success) {
        LoggerUtil.info('Natal chart retrieved successfully', { name: birthData.name });
        return { success: true, data: response.data };
      } else {
        LoggerUtil.error('Failed to retrieve natal chart', { error: response.error });
        return { success: false, error: response.error };
      }
    } catch (error) {
      ErrorHandler.logError('AstrologyAPIService.getNatalChart', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Get compatibility data from AstrologyAPI
   * @param {Object} person1 - First person's birth data
   * @param {Object} person2 - Second person's birth data
   * @returns {Object} Compatibility data
   */
  getCompatibility: function(person1, person2) {
    if (!ApiConfig.isAstrologyApiEnabled()) {
      LoggerUtil.warn('AstrologyAPI is not enabled');
      return { success: false, error: 'API not enabled' };
    }
    
    try {
      const url = ApiConfig.getEndpointUrl('ASTROLOGY_API', 'compatibility');
      const apiKey = ApiConfig.getAstrologyApiKey();
      
      const payload = {
        person1: person1,
        person2: person2
      };
      
      const response = UrlFetchServiceWrapper.fetchJSON(url, {
        method: 'post',
        payload: JSON.stringify(payload),
        headers: {
          'Authorization': 'Bearer ' + apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.success) {
        LoggerUtil.info('Compatibility data retrieved successfully');
        return { success: true, data: response.data };
      } else {
        LoggerUtil.error('Failed to retrieve compatibility data', { error: response.error });
        return { success: false, error: response.error };
      }
    } catch (error) {
      ErrorHandler.logError('AstrologyAPIService.getCompatibility', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Get transits data from AstrologyAPI
   * @param {string} date - Date for transits (YYYY-MM-DD)
   * @param {Object} natalChart - Natal chart data
   * @returns {Object} Transits data
   */
  getTransits: function(date, natalChart) {
    if (!ApiConfig.isAstrologyApiEnabled()) {
      LoggerUtil.warn('AstrologyAPI is not enabled');
      return { success: false, error: 'API not enabled' };
    }
    
    try {
      const url = ApiConfig.getEndpointUrl('ASTROLOGY_API', 'transits');
      const apiKey = ApiConfig.getAstrologyApiKey();
      
      const payload = {
        date: date,
        natalChart: natalChart
      };
      
      const response = UrlFetchServiceWrapper.fetchJSON(url, {
        method: 'post',
        payload: JSON.stringify(payload),
        headers: {
          'Authorization': 'Bearer ' + apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.success) {
        LoggerUtil.info('Transits data retrieved successfully');
        return { success: true, data: response.data };
      } else {
        LoggerUtil.error('Failed to retrieve transits data', { error: response.error });
        return { success: false, error: response.error };
      }
    } catch (error) {
      ErrorHandler.logError('AstrologyAPIService.getTransits', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Get progressions data from AstrologyAPI
   * @param {string} date - Date for progressions (YYYY-MM-DD)
   * @param {Object} natalChart - Natal chart data
   * @returns {Object} Progressions data
   */
  getProgressions: function(date, natalChart) {
    if (!ApiConfig.isAstrologyApiEnabled()) {
      LoggerUtil.warn('AstrologyAPI is not enabled');
      return { success: false, error: 'API not enabled' };
    }
    
    try {
      const url = ApiConfig.getEndpointUrl('ASTROLOGY_API', 'progressions');
      const apiKey = ApiConfig.getAstrologyApiKey();
      
      const payload = {
        date: date,
        natalChart: natalChart
      };
      
      const response = UrlFetchServiceWrapper.fetchJSON(url, {
        method: 'post',
        payload: JSON.stringify(payload),
        headers: {
          'Authorization': 'Bearer ' + apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.success) {
        LoggerUtil.info('Progressions data retrieved successfully');
        return { success: true, data: response.data };
      } else {
        LoggerUtil.error('Failed to retrieve progressions data', { error: response.error });
        return { success: false, error: response.error };
      }
    } catch (error) {
      ErrorHandler.logError('AstrologyAPIService.getProgressions', error);
      return { success: false, error: error.message };
    }
  }
};

/**
 * Test AstrologyAPI service
 */
function testAstrologyAPI() {
  try {
    try {
      const birthData = {
        name: 'Test Person',
        birthDate: '1990-04-15',
        birthTime: '12:30:00',
        birthLocation: 'New York, USA',
        latitude: 40.7128,
        longitude: -74.0060,
        timezone: 'America/New_York'
      };
  
      const result = AstrologyAPIService.getNatalChart(birthData);
      Logger.log('Natal chart result: ' + JSON.stringify(result));
    } catch (error) {
      Logger.log("Erro em testAstrologyAPI: " + error.message);
      throw error;
    }
  } catch (error) {
    Logger.log("Erro em testAstrologyAPI: " + error.message);
    throw error;
  }
}
