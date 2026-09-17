/**
 * WebHook.gs
 * Handles webhooks from external services
 */

const WebHook = {
  /**
   * Handle incoming webhook
   * @param {Object} payload - Webhook payload
   * @returns {Object} Webhook response
   */
  handleWebhook: function(payload) {
    try {
      LoggerUtil.info('Webhook received', { source: payload.source });
      
      let response = {};
      
      switch (payload.source) {
        case 'astrology-api':
          response = this.handleAstrologyApiWebhook(payload);
          break;
        case 'team-update':
          response = this.handleTeamUpdateWebhook(payload);
          break;
        default:
          response = { success: false, message: 'Unknown webhook source' };
      }
      
      return response;
    } catch (error) {
      ErrorHandler.logError('WebHook.handleWebhook', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Handle astrology API webhook
   * @param {Object} payload - Webhook payload
   * @returns {Object} Response
   */
  handleAstrologyApiWebhook: function(payload) {
    try {
      // Process astrology API data
      if (payload.natalChartData) {
        const memberId = payload.memberId;
        const natalChartData = payload.natalChartData;
        
        // Update member with natal chart data
        const updateData = {
          natalChart: natalChartData,
          lastAstrologyUpdate: DateTimeUtils.getCurrentDateTime()
        };
        
        const result = TeamMemberService.updateMember(memberId, updateData);
        return result;
      }
      
      return { success: false, message: 'No natal chart data in payload' };
    } catch (error) {
      ErrorHandler.logError('WebHook.handleAstrologyApiWebhook', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Handle team update webhook
   * @param {Object} payload - Webhook payload
   * @returns {Object} Response
   */
  handleTeamUpdateWebhook: function(payload) {
    try {
      if (payload.action === 'member-added') {
        return TeamMemberService.addMember(payload.memberData);
      } else if (payload.action === 'member-updated') {
        return TeamMemberService.updateMember(payload.memberId, payload.updateData);
      } else if (payload.action === 'member-deleted') {
        return TeamMemberService.deleteMember(payload.memberId);
      }
      
      return { success: false, message: 'Unknown team update action' };
    } catch (error) {
      ErrorHandler.logError('WebHook.handleTeamUpdateWebhook', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Verify webhook signature
   * @param {string} signature - Signature from webhook
   * @param {string} payload - Payload string
   * @param {string} secret - Secret key
   * @returns {boolean} True if signature is valid
   */
  verifySignature: function(signature, payload, secret) {
    try {
      try {
        // Create HMAC-SHA256 hash
        const hash = Utilities.computeHmacSha256Signature(payload, secret);
        const hashString = Utilities.base64Encode(hash);
      
        return hashString === signature;
      } catch (error) {
        ErrorHandler.logError('WebHook.verifySignature', error);
        return false;
      }
    } catch (error) {
      Logger.log("Erro em verifySignature: " + error.message);
      throw error;
    }
  }
};

/**
 * Test webhook handler
 */
function testWebhook() {
  try {
    const payload = {
      source: 'team-update',
      action: 'member-added',
      memberData: {
        name: 'Test Member',
        email: 'test@example.com',
        birthDate: '1990-01-01',
        birthTime: '12:00:00',
        birthLocation: 'Test Location',
        latitude: 0,
        longitude: 0
      }
    };
  
    const result = WebHook.handleWebhook(payload);
    Logger.log('Webhook result: ' + JSON.stringify(result));
  } catch (error) {
    Logger.log("Erro em testWebhook: " + error.message);
    throw error;
  }
}

