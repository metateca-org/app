/**
 * FreeAstrologyAPI.gs
 * Integration with Free Astrology API as fallback
 */

const FreeAstrologyAPIService = {
  /**
   * Get natal chart from Free Astrology API
   * @param {Object} birthData - Birth data object
   * @returns {Object} Natal chart data
   */
  getNatalChart: function(birthData) {
    if (!ApiConfig.isFreeAstrologyApiEnabled()) {
      LoggerUtil.warn('Free Astrology API is not enabled');
      return { success: false, error: 'API not enabled' };
    }
    
    const validation = Validation.validateBirthData(birthData);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }
    
    try {
      const url = ApiConfig.getEndpointUrl('FREE_ASTROLOGY_API', 'natalChart');
      const apiKey = ApiConfig.getFreeAstrologyApiKey();
      
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
        LoggerUtil.info('Free API: Natal chart retrieved successfully', { name: birthData.name });
        return { success: true, data: response.data };
      } else {
        LoggerUtil.error('Free API: Failed to retrieve natal chart', { error: response.error });
        return { success: false, error: response.error };
      }
    } catch (error) {
      ErrorHandler.logError('FreeAstrologyAPIService.getNatalChart', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Get compatibility from Free Astrology API
   * @param {Object} person1 - First person's birth data
   * @param {Object} person2 - Second person's birth data
   * @returns {Object} Compatibility data
   */
  getCompatibility: function(person1, person2) {
    if (!ApiConfig.isFreeAstrologyApiEnabled()) {
      LoggerUtil.warn('Free Astrology API is not enabled');
      return { success: false, error: 'API not enabled' };
    }
    
    try {
      const url = ApiConfig.getEndpointUrl('FREE_ASTROLOGY_API', 'compatibility');
      const apiKey = ApiConfig.getFreeAstrologyApiKey();
      
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
        LoggerUtil.info('Free API: Compatibility data retrieved successfully');
        return { success: true, data: response.data };
      } else {
        LoggerUtil.error('Free API: Failed to retrieve compatibility data', { error: response.error });
        return { success: false, error: response.error };
      }
    } catch (error) {
      ErrorHandler.logError('FreeAstrologyAPIService.getCompatibility', error);
      return { success: false, error: error.message };
    }
  }
};

/**
 * Test Free Astrology API service
 */
function testFreeAstrologyAPI() {
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
  
      const result = FreeAstrologyAPIService.getNatalChart(birthData);
      Logger.log('Free API Natal chart result: ' + JSON.stringify(result));
    } catch (error) {
      Logger.log("Erro em testFreeAstrologyAPI: " + error.message);
      throw error;
    }
  } catch (error) {
    Logger.log("Erro em testFreeAstrologyAPI: " + error.message);
    throw error;
  }
}
