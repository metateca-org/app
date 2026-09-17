/**
 * GasClientHandler.gs
 * Backend aggregation helpers (team overview, system status, etc.).
 *
 * NOTE: the `Api` registry in Code.gs is the single entry point for the
 * frontend. The aggregation methods below (getTeamOverview, getSystemStatus, ...)
 * are reused from there. `handleAsyncRequest` is a legacy action dispatcher
 * kept only for backwards compatibility -- prefer adding actions to `Api`.
 */

const GasClientHandler = {
  /**
   * [LEGACY] Action dispatcher. Use the `Api` registry / doPost in Code.gs instead.
   * @param {string} action - Action name
   * @param {Object} data - Request data
   * @returns {Object} Response object
   */
  handleAsyncRequest: function(action, data) {
    try {
      LoggerUtil.debug('Async request received', { action: action, data: data });
      
      let response = {};
      
      switch (action) {
        case 'getTeamOverview':
          response = this.getTeamOverview();
          break;
        case 'getTeamMember':
          response = this.getTeamMember(data.memberId);
          break;
        case 'getTeamDynamics':
          response = this.getTeamDynamics();
          break;
        case 'getProductivityProfile':
          response = this.getProductivityProfile(data.memberId);
          break;
        case 'getCommunicationTips':
          response = this.getCommunicationTips(data.memberId);
          break;
        case 'getProjectRoles':
          response = this.getProjectRoles();
          break;
        case 'getSystemStatus':
          response = this.getSystemStatus();
          break;
        default:
          response = { success: false, message: 'Unknown action: ' + action };
      }
      
      return response;
    } catch (error) {
      ErrorHandler.logError('GasClientHandler.handleAsyncRequest', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Get team overview
   * @returns {Object} Team overview data
   */
  getTeamOverview: function() {
    try {
      const members = PropertiesServiceHandler.getScriptProperty(Constants.MEMBERS_KEY, []);
      const elementDist = ElementMapper.calculateTeamElementDistribution(members);
      const modalityDist = ModalityMapper.calculateTeamModalityDistribution(members);
      
      return {
        success: true,
        data: {
          teamSize: members.length,
          elementDistribution: elementDist,
          modalityDistribution: modalityDist,
          lastUpdated: DateTimeUtils.getCurrentDateTime()
        }
      };
    } catch (error) {
      ErrorHandler.logError('GasClientHandler.getTeamOverview', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Get team member data
   * @param {string} memberId - Member ID
   * @returns {Object} Member data
   */
  getTeamMember: function(memberId) {
    try {
      const memberResult = TeamMemberService.getMember(memberId);
      if (!memberResult.success) {
        return memberResult;
      }
      
      const profileResult = UserProfileService.getProfile(memberId);
      return profileResult;
    } catch (error) {
      ErrorHandler.logError('GasClientHandler.getTeamMember', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Get team dynamics
   * @returns {Object} Team dynamics analysis
   */
  getTeamDynamics: function() {
    try {
      return TeamDynamicsAnalyzer.analyzeTeam();
    } catch (error) {
      ErrorHandler.logError('GasClientHandler.getTeamDynamics', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Get productivity profile
   * @param {string} memberId - Member ID
   * @returns {Object} Productivity profile
   */
  getProductivityProfile: function(memberId) {
    try {
      const memberResult = TeamMemberService.getMember(memberId);
      if (!memberResult.success) {
        return memberResult;
      }
      
      const member = memberResult.data;
      const profileResult = ProductivityProfileGenerator.generateProfile(member);
      return profileResult;
    } catch (error) {
      ErrorHandler.logError('GasClientHandler.getProductivityProfile', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Get communication tips
   * @param {string} memberId - Member ID
   * @returns {Object} Communication tips
   */
  getCommunicationTips: function(memberId) {
    try {
      return CommunicationTips.generateTips(memberId);
    } catch (error) {
      ErrorHandler.logError('GasClientHandler.getCommunicationTips', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Get project roles
   * @returns {Object} Project role suggestions
   */
  getProjectRoles: function() {
    try {
      return ProjectRoleSuggester.suggestRoles();
    } catch (error) {
      ErrorHandler.logError('GasClientHandler.getProjectRoles', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Get system status
   * @returns {Object} System status
   */
  getSystemStatus: function() {
    try {
      return AdminFunctions.verifySystemHealth();
    } catch (error) {
      ErrorHandler.logError('GasClientHandler.getSystemStatus', error);
      return { success: false, error: error.message };
    }
  }
};

/**
 * Test gas client handler
 */
function testGasClientHandler() {
  try {
    const result = GasClientHandler.handleAsyncRequest('getTeamOverview', {});
    Logger.log('Team overview: ' + JSON.stringify(result));
  } catch (error) {
    Logger.log("Erro em testGasClientHandler: " + error.message);
    throw error;
  }
}

