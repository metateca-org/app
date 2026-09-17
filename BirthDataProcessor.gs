/**
 * BirthDataProcessor.gs
 * Processing and validation of birth data
 */

const BirthDataProcessor = {
  /**
   * Process raw birth data
   * @param {Object} rawData - Raw birth data from form
   * @returns {Object} Processed birth data
   */
  process: function(rawData) {
    try {
      const validation = Validation.validateBirthData(rawData);
      if (!validation.valid) {
        return { success: false, errors: validation.errors };
      }
      
      const processed = {
        name: StringUtils.capitalize(rawData.name.trim()),
        birthDate: rawData.birthDate,
        birthTime: rawData.birthTime,
        birthLocation: rawData.birthLocation.trim(),
        latitude: parseFloat(rawData.latitude),
        longitude: parseFloat(rawData.longitude),
        timezone: rawData.timezone || 'UTC',
        email: rawData.email ? rawData.email.toLowerCase().trim() : '',
        age: DateTimeUtils.getAge(rawData.birthDate),
        sunSign: DateTimeUtils.getZodiacSignFromDate(rawData.birthDate),
        dayOfWeek: DateTimeUtils.getDayOfWeek(rawData.birthDate),
        processedAt: DateTimeUtils.getCurrentDateTime()
      };
      
      return { success: true, data: processed };
    } catch (error) {
      ErrorHandler.logError('BirthDataProcessor.process', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Normalize coordinates
   * @param {number} latitude - Latitude value
   * @param {number} longitude - Longitude value
   * @returns {Object} Normalized coordinates
   */
  normalizeCoordinates: function(latitude, longitude) {
    try {
      latitude = parseFloat(latitude);
      longitude = parseFloat(longitude);
    
      // Validate ranges
      if (!isFinite(latitude) || latitude < -90 || latitude > 90) {
        return { success: false, error: 'Latitude must be between -90 and 90' };
      }
    
      if (!isFinite(longitude) || longitude < -180 || longitude > 180) {
        return { success: false, error: 'Longitude must be between -180 and 180' };
      }
    
      return {
        success: true,
        data: {
          latitude: latitude,
          longitude: longitude
        }
      };
    } catch (error) {
      Logger.log("Erro em normalizeCoordinates: " + error.message);
      throw error;
    }
  },
  
  /**
   * Normalize timezone
   * @param {string} timezone - Timezone string
   * @returns {Object} Normalized timezone
   */
  normalizeTimezone: function(timezone) {
    const validTimezones = [
      'UTC', 'GMT',
      'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
      'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Madrid',
      'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Hong_Kong', 'Asia/Singapore',
      'Australia/Sydney', 'Australia/Melbourne'
    ];
    
    if (validTimezones.includes(timezone)) {
      return { success: true, timezone: timezone };
    }
    
    return { success: false, error: 'Invalid timezone: ' + timezone };
  },
  
  /**
   * Calculate birth time in UTC
   * @param {string} birthTime - Birth time in HH:MM:SS
   * @param {string} timezone - Timezone offset
   * @returns {string} UTC time in HH:MM:SS
   */
  calculateUTCTime: function(birthTime, timezone) {
    try {
      const timeParts = DateTimeUtils.parseTime(birthTime);
      
      // This is a simplified calculation; actual implementation would need proper timezone handling
      // For now, we'll just return the birth time as-is
      // In production, use a library like moment-timezone
      
      return birthTime;
    } catch (error) {
      ErrorHandler.logError('BirthDataProcessor.calculateUTCTime', error);
      return null;
    }
  },
  
  /**
   * Create birth data object for API call
   * @param {Object} processedData - Processed birth data
   * @returns {Object} Birth data object for API
   */
  createApiPayload: function(processedData) {
    return {
      name: processedData.name,
      date: processedData.birthDate,
      time: processedData.birthTime,
      latitude: processedData.latitude,
      longitude: processedData.longitude,
      timezone: processedData.timezone
    };
  },
  
  /**
   * Merge birth data with natal chart results
   * @param {Object} birthData - Birth data
   * @param {Object} natalChart - Natal chart data from API
   * @returns {Object} Merged data
   */
  mergeWithNatalChart: function(birthData, natalChart) {
    try {
      return ObjectUtils.merge(birthData, {
        natalChart: natalChart,
        mergedAt: DateTimeUtils.getCurrentDateTime()
      });
    } catch (error) {
      Logger.log("Erro em mergeWithNatalChart: " + error.message);
      throw error;
    }
  }
};

/**
 * Test birth data processor
 */
function testBirthDataProcessor() {
  try {
    const rawData = {
      name: 'john doe',
      birthDate: '1990-04-15',
      birthTime: '12:30:00',
      birthLocation: 'New York, USA',
      latitude: 40.7128,
      longitude: -74.0060,
      timezone: 'America/New_York',
      email: 'JOHN@EXAMPLE.COM'
    };
  
    const result = BirthDataProcessor.process(rawData);
    Logger.log('Processed birth data: ' + JSON.stringify(result));
  } catch (error) {
    Logger.log("Erro em testBirthDataProcessor: " + error.message);
    throw error;
  }
}
