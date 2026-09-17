/**
 * ApiConfig.gs
 * Configuration for external APIs (AstrologyAPI, Free Astrology API, etc.)
 */

const ApiConfig = {
  // AstrologyAPI Configuration
  ASTROLOGY_API: {
    enabled: true,
    baseUrl: 'https://api.astrology.com/v1',
    apiKey: PropertiesService.getScriptProperties().getProperty('ASTROLOGY_API_KEY') || '',
    endpoints: {
      natalChart: '/natal-chart',
      compatibility: '/compatibility',
      transits: '/transits',
      progressions: '/progressions'
    }
  },
  
  // Free Astrology API Configuration
  FREE_ASTROLOGY_API: {
    enabled: true,
    baseUrl: 'https://api.astro-api.com/v1',
    apiKey: PropertiesService.getScriptProperties().getProperty('FREE_ASTROLOGY_API_KEY') || '',
    endpoints: {
      natalChart: '/natal-chart',
      compatibility: '/compatibility'
    }
  },
  
  // Fallback API (if primary APIs fail)
  FALLBACK_API: {
    enabled: true,
    baseUrl: 'https://astro-api.io/v1',
    apiKey: PropertiesService.getScriptProperties().getProperty('FALLBACK_API_KEY') || ''
  },

  getAstrologyApiUrl: function() {
    return this.ASTROLOGY_API.baseUrl;
  },

  getAstrologyApiKey: function() {
    return this.ASTROLOGY_API.apiKey;
  },

  getFreeAstrologyApiUrl: function() {
    return this.FREE_ASTROLOGY_API.baseUrl;
  },

  getFreeAstrologyApiKey: function() {
    return this.FREE_ASTROLOGY_API.apiKey;
  },

  setAstrologyApiKey: function(key) {
    try {
      PropertiesService.getScriptProperties().setProperty('ASTROLOGY_API_KEY', key);
      this.ASTROLOGY_API.apiKey = key;
    } catch (error) {
      Logger.log("Erro em setAstrologyApiKey: " + error.message);
      throw error;
    }
  },

  setFreeAstrologyApiKey: function(key) {
    try {
      PropertiesService.getScriptProperties().setProperty('FREE_ASTROLOGY_API_KEY', key);
      this.FREE_ASTROLOGY_API.apiKey = key;
    } catch (error) {
      Logger.log("Erro em setFreeAstrologyApiKey: " + error.message);
      throw error;
    }
  },

  isAstrologyApiEnabled: function() {
    return this.ASTROLOGY_API.enabled && this.ASTROLOGY_API.apiKey !== '';
  },

  isFreeAstrologyApiEnabled: function() {
    return this.FREE_ASTROLOGY_API.enabled && this.FREE_ASTROLOGY_API.apiKey !== '';
  },

  getEndpointUrl: function(apiName, endpoint) {
    const apiConfig = this[apiName];
    if (!apiConfig || !apiConfig.endpoints || !apiConfig.endpoints[endpoint]) {
      return '';
    }
    return apiConfig.baseUrl + apiConfig.endpoints[endpoint];
  },

  getAllApiConfigs: function() {
    return this;
  }
};

/**
 * Get the Astrology API base URL
 * @returns {string} The base URL for Astrology API
 */
function getAstrologyApiUrl() {
  return ApiConfig.getAstrologyApiUrl();
}

/**
 * Get the Astrology API key
 * @returns {string} The API key
 */
function getAstrologyApiKey() {
  return ApiConfig.getAstrologyApiKey();
}

/**
 * Get the Free Astrology API base URL
 * @returns {string} The base URL for Free Astrology API
 */
function getFreeAstrologyApiUrl() {
  return ApiConfig.getFreeAstrologyApiUrl();
}

/**
 * Get the Free Astrology API key
 * @returns {string} The API key
 */
function getFreeAstrologyApiKey() {
  return ApiConfig.getFreeAstrologyApiKey();
}

/**
 * Set the Astrology API key
 * @param {string} key - The API key to set
 */
function setAstrologyApiKey(key) {
  ApiConfig.setAstrologyApiKey(key);
}

/**
 * Set the Free Astrology API key
 * @param {string} key - The API key to set
 */
function setFreeAstrologyApiKey(key) {
  ApiConfig.setFreeAstrologyApiKey(key);
}

/**
 * Check if Astrology API is enabled
 * @returns {boolean} True if enabled
 */
function isAstrologyApiEnabled() {
  return ApiConfig.isAstrologyApiEnabled();
}

/**
 * Check if Free Astrology API is enabled
 * @returns {boolean} True if enabled
 */
function isFreeAstrologyApiEnabled() {
  return ApiConfig.isFreeAstrologyApiEnabled();
}

/**
 * Get the endpoint URL for a specific API and endpoint
 * @param {string} apiName - The API name (e.g., 'ASTROLOGY_API')
 * @param {string} endpoint - The endpoint name
 * @returns {string} The full endpoint URL
 */
function getEndpointUrl(apiName, endpoint) {
  return ApiConfig.getEndpointUrl(apiName, endpoint);
}

/**
 * Get all configured APIs
 * @returns {Object} Object containing all API configurations
 */
function getAllApiConfigs() {
  return ApiConfig.getAllApiConfigs();
}
