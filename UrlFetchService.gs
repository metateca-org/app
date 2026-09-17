/**
 * UrlFetchService.gs
 * Wrapper for Google Apps Script UrlFetchApp with error handling and retry logic
 */

const UrlFetchServiceWrapper = {
  /**
   * Make a GET request
   * @param {string} url - The URL to fetch
   * @param {Object} options - Optional parameters (headers, timeout, etc.)
   * @returns {Object} Response object
   */
  get: function(url, options) {
    try {
      return this.fetch(url, Object.assign({ method: 'get' }, options));
    } catch (error) {
      Logger.log("Erro em get: " + error.message);
      throw error;
    }
  },
  
  /**
   * Make a POST request
   * @param {string} url - The URL to fetch
   * @param {*} payload - The payload to send
   * @param {Object} options - Optional parameters
   * @returns {Object} Response object
   */
  post: function(url, payload, options) {
    try {
      const fetchOptions = Object.assign({ method: 'post' }, options);
    
      if (typeof payload === 'object') {
        fetchOptions.payload = JSON.stringify(payload);
        fetchOptions.contentType = 'application/json';
      } else {
        fetchOptions.payload = payload;
      }
    
      return this.fetch(url, fetchOptions);
    } catch (error) {
      Logger.log("Erro em post: " + error.message);
      throw error;
    }
  },
  
  /**
   * Make a generic fetch request with retry logic
   * @param {string} url - The URL to fetch
   * @param {Object} options - Fetch options
   * @returns {Object} Response object
   */
  fetch: function(url, options) {
    options = options || {};
    const maxRetries = options.maxRetries || Constants.MAX_RETRIES;
    const timeout = options.timeout || Constants.API_TIMEOUT;
    
    let lastError = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const fetchOptions = {
          method: options.method || 'get',
          headers: options.headers || {},
          timeout: timeout,
          muteHttpExceptions: true
        };
        
        if (options.payload) {
          fetchOptions.payload = options.payload;
        }
        
        if (options.contentType) {
          fetchOptions.contentType = options.contentType;
        }
        
        const response = UrlFetchApp.fetch(url, fetchOptions);
        
        return {
          success: response.getResponseCode() < 400,
          statusCode: response.getResponseCode(),
          content: response.getContentText(),
          headers: response.getAllHeaders(),
          attempt: attempt + 1
        };
      } catch (error) {
        lastError = error;
        LoggerUtil.warn('Fetch attempt ' + (attempt + 1) + ' failed for ' + url, { error: error.message });
        
        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries - 1) {
          Utilities.sleep(Math.pow(2, attempt) * 1000);
        }
      }
    }
    
    // All retries failed
    return {
      success: false,
      statusCode: 0,
      content: '',
      error: lastError ? lastError.message : 'Unknown error',
      attempt: maxRetries
    };
  },
  
  /**
   * Fetch JSON data
   * @param {string} url - The URL to fetch
   * @param {Object} options - Optional parameters
   * @returns {Object} Parsed JSON response
   */
  fetchJSON: function(url, options) {
    const response = this.fetch(url, options);
    
    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Request failed'
      };
    }
    
    try {
      return {
        success: true,
        data: JSON.parse(response.content)
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to parse JSON: ' + error.message
      };
    }
  },
  
  /**
   * Fetch with authentication header
   * @param {string} url - The URL to fetch
   * @param {string} apiKey - The API key
   * @param {Object} options - Optional parameters
   * @returns {Object} Response object
   */
  fetchWithAuth: function(url, apiKey, options) {
    options = options || {};
    options.headers = options.headers || {};
    options.headers['Authorization'] = 'Bearer ' + apiKey;
    
    return this.fetch(url, options);
  },
  
  /**
   * Fetch with custom headers
   * @param {string} url - The URL to fetch
   * @param {Object} headers - Custom headers
   * @param {Object} options - Optional parameters
   * @returns {Object} Response object
   */
  fetchWithHeaders: function(url, headers, options) {
    try {
      options = options || {};
      options.headers = Object.assign(options.headers || {}, headers);
    
      return this.fetch(url, options);
    } catch (error) {
      Logger.log("Erro em fetchWithHeaders: " + error.message);
      throw error;
    }
  }
};

/**
 * Test URL fetch service
 */
function testUrlFetchService() {
  try {
    try {
      // Test GET request (using a public API)
      const response = UrlFetchServiceWrapper.get('https://api.github.com');
      Logger.log('GitHub API Response: ' + response.statusCode);
  
      // Test JSON fetch
      const jsonResponse = UrlFetchServiceWrapper.fetchJSON('https://api.github.com');
      Logger.log('JSON Response: ' + JSON.stringify(jsonResponse));
    } catch (error) {
      Logger.log("Erro em testUrlFetchService: " + error.message);
      throw error;
    }
  } catch (error) {
    Logger.log("Erro em testUrlFetchService: " + error.message);
    throw error;
  }
}
