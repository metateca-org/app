/**
 * Validation.gs
 * Input validation utilities for Metateca
 */

const Validation = {
  /**
   * Validate email address
   * @param {string} email - The email to validate
   * @returns {boolean} True if valid email
   */
  isValidEmail: function(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  /**
   * Validate date format (YYYY-MM-DD)
   * @param {string} dateString - The date string
   * @returns {boolean} True if valid date
   */
  isValidDate: function(dateString) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
      return false;
    }
    
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  },
  
  /**
   * Validate time format (HH:MM:SS)
   * @param {string} timeString - The time string
   * @returns {boolean} True if valid time
   */
  isValidTime: function(timeString) {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    return timeRegex.test(timeString);
  },
  
  /**
   * Validate zodiac sign
   * @param {string} sign - The sign name
   * @returns {boolean} True if valid sign
   */
  isValidZodiacSign: function(sign) {
    return Constants.ZODIAC_SIGNS.includes(sign);
  },
  
  /**
   * Validate planet name
   * @param {string} planet - The planet name
   * @returns {boolean} True if valid planet
   */
  isValidPlanet: function(planet) {
    return Constants.PLANETS.includes(planet);
  },
  
  /**
   * Validate element
   * @param {string} element - The element name
   * @returns {boolean} True if valid element
   */
  isValidElement: function(element) {
    try {
      return Object.keys(Constants.ELEMENTS).includes(element);
    } catch (error) {
      Logger.log("Erro em isValidElement: " + error.message);
      throw error;
    }
  },
  
  /**
   * Validate modality
   * @param {string} modality - The modality name
   * @returns {boolean} True if valid modality
   */
  isValidModality: function(modality) {
    try {
      return Object.keys(Constants.MODALITIES).includes(modality);
    } catch (error) {
      Logger.log("Erro em isValidModality: " + error.message);
      throw error;
    }
  },
  
  /**
   * Validate birth data object
   * @param {Object} birthData - The birth data object
   * @returns {Object} Validation result
   */
  validateBirthData: function(birthData) {
    try {
      const errors = [];
    
      if (!birthData.name || typeof birthData.name !== 'string') {
        errors.push('Name is required and must be a string');
      }
    
      if (!birthData.birthDate || !this.isValidDate(birthData.birthDate)) {
        errors.push('Birth date is required and must be in YYYY-MM-DD format');
      }
    
      if (!birthData.birthTime || !this.isValidTime(birthData.birthTime)) {
        errors.push('Birth time is required and must be in HH:MM:SS format');
      }
    
      if (!birthData.birthLocation || typeof birthData.birthLocation !== 'string') {
        errors.push('Birth location is required');
      }
    
      if (typeof birthData.latitude !== 'number' || !isFinite(birthData.latitude) ||
          birthData.latitude < -90 || birthData.latitude > 90) {
        errors.push('Latitude is required and must be a number');
      }
    
      if (typeof birthData.longitude !== 'number' || !isFinite(birthData.longitude) ||
          birthData.longitude < -180 || birthData.longitude > 180) {
        errors.push('Longitude is required and must be a number');
      }
    
      return {
        valid: errors.length === 0,
        errors: errors
      };
    } catch (error) {
      Logger.log("Erro em validateBirthData: " + error.message);
      throw error;
    }
  },
  
  /**
   * Validate team member data
   * @param {Object} memberData - The member data
   * @returns {Object} Validation result
   */
  validateTeamMemberData: function(memberData) {
    try {
      let errors = [];

      if (!memberData.email || !this.isValidEmail(memberData.email)) {
        errors.push('Valid email is required');
      }

      if (!memberData.name || typeof memberData.name !== 'string') {
        errors.push('Name is required');
      }

      const birthValidation = this.validateBirthData(memberData);
      if (!birthValidation.valid) {
        errors = errors.concat(birthValidation.errors);
      }
    
      return {
        valid: errors.length === 0,
        errors: errors
      };
    } catch (error) {
      Logger.log("Erro em validateTeamMemberData: " + error.message);
      throw error;
    }
  },
  
  /**
   * Validate string length
   * @param {string} str - The string to validate
   * @param {number} minLength - Minimum length
   * @param {number} maxLength - Maximum length
   * @returns {boolean} True if valid
   */
  isValidStringLength: function(str, minLength, maxLength) {
    if (typeof str !== 'string') {
      return false;
    }
    return str.length >= minLength && str.length <= maxLength;
  },
  
  /**
   * Validate number range
   * @param {number} num - The number to validate
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {boolean} True if valid
   */
  isValidNumberRange: function(num, min, max) {
    return typeof num === 'number' && num >= min && num <= max;
  },
  
  /**
   * Sanitize string input
   * @param {string} str - The string to sanitize
   * @returns {string} Sanitized string
   */
  sanitizeString: function(str) {
    try {
      if (typeof str !== 'string') {
        return '';
      }
      return str.trim().replace(/[<>\"']/g, '');
    } catch (error) {
      Logger.log("Erro em sanitizeString: " + error.message);
      throw error;
    }
  }
};

/**
 * Test validation functions
 */
function testValidation() {
  Logger.log('[LGPD] Evento registrado; detalhes sensíveis omitidos.');
  Logger.log('Testing date validation: ' + Validation.isValidDate('2000-01-01'));
  Logger.log('Testing time validation: ' + Validation.isValidTime('12:30:45'));
  Logger.log('Testing zodiac sign: ' + Validation.isValidZodiacSign('Aries'));
  Logger.log('Testing planet: ' + Validation.isValidPlanet('Sun'));
}
