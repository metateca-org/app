/**
 * TeamMemberService.gs
 * Service for managing team members
 */

const TeamMemberService = {
  /**
   * Add a new team member
   * @param {Object} memberData - Member data including birth information
   * @returns {Object} Result of adding member
   */
  addMember: function(memberData) {
    try {
      try {
        // Validate member data
        const validation = Validation.validateTeamMemberData(memberData);
        if (!validation.valid) {
          return { success: false, errors: validation.errors };
        }
      
        // Process birth data
        const processedData = BirthDataProcessor.process(memberData);
        if (!processedData.success) {
          return processedData;
        }
      
        const member = processedData.data;
      
        // Generate productivity profile
        const profileResult = ProductivityProfileGenerator.generateProfile(member);
        if (!profileResult.success) {
          return profileResult;
        }
      
        member.productivityProfile = profileResult.data;

        // Get all members (raw storage; getAllMembers() returns enriched copies)
        const members = PropertiesServiceHandler.getScriptProperty(Constants.MEMBERS_KEY, []) || [];
      
        // Check if member already exists
        const existingIndex = members.findIndex(m => m.email === member.email);
        if (existingIndex >= 0) {
          members[existingIndex] = member;
        } else {
          members.push(member);
        }
      
        // Save to properties
        PropertiesServiceHandler.saveScriptProperty(Constants.MEMBERS_KEY, members);
      
        LoggerUtil.info('Team member added', { email: member.email, name: member.name });
      
        return {
          success: true,
          message: 'Member added successfully',
          data: member
        };
      } catch (error) {
        ErrorHandler.logError('TeamMemberService.addMember', error);
        return { success: false, error: error.message };
      }
    } catch (error) {
      Logger.log("Erro em addMember: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get all team members
   * @returns {Object} All team members
   */
  getAllMembers: function() {
    try {
      try {
        const members = PropertiesServiceHandler.getScriptProperty(Constants.MEMBERS_KEY, []);
        // Enrich copies with element/modality so list views don't need server-only
        // mappers on the client. Storage shape is left untouched.
        const enriched = (members || []).map(function(m) {
          return Object.assign({}, m, {
            element: m.element || ElementMapper.getElement(m.sunSign),
            modality: m.modality || ModalityMapper.getModality(m.sunSign)
          });
        });
        return { success: true, data: enriched };
      } catch (error) {
        ErrorHandler.logError('TeamMemberService.getAllMembers', error);
        return { success: false, error: error.message };
      }
    } catch (error) {
      Logger.log("Erro em getAllMembers: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get a specific team member
   * @param {string} memberId - Member email or ID
   * @returns {Object} Team member data
   */
  getMember: function(memberId) {
    try {
      const members = PropertiesServiceHandler.getScriptProperty(Constants.MEMBERS_KEY, []);
      const member = members.find(m => m.email === memberId || m.name === memberId);
      
      if (!member) {
        return { success: false, error: 'Member not found' };
      }
      
      return { success: true, data: member };
    } catch (error) {
      ErrorHandler.logError('TeamMemberService.getMember', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Update a team member
   * @param {string} memberId - Member email or ID
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated member data
   */
  updateMember: function(memberId, updateData) {
    try {
      try {
        const members = PropertiesServiceHandler.getScriptProperty(Constants.MEMBERS_KEY, []);
        const memberIndex = members.findIndex(m => m.email === memberId || m.name === memberId);
      
        if (memberIndex < 0) {
          return { success: false, error: 'Member not found' };
        }
      
        // Merge update data
        members[memberIndex] = ObjectUtils.merge(members[memberIndex], updateData);
      
        // Save updated members
        PropertiesServiceHandler.saveScriptProperty(Constants.MEMBERS_KEY, members);
      
        LoggerUtil.info('Team member updated', { email: memberId });
      
        return {
          success: true,
          message: 'Member updated successfully',
          data: members[memberIndex]
        };
      } catch (error) {
        ErrorHandler.logError('TeamMemberService.updateMember', error);
        return { success: false, error: error.message };
      }
    } catch (error) {
      Logger.log("Erro em updateMember: " + error.message);
      throw error;
    }
  },
  
  /**
   * Delete a team member
   * @param {string} memberId - Member email or ID
   * @returns {Object} Result of deletion
   */
  deleteMember: function(memberId) {
    try {
      try {
        const members = PropertiesServiceHandler.getScriptProperty(Constants.MEMBERS_KEY, []);
        const memberIndex = members.findIndex(m => m.email === memberId || m.name === memberId);
      
        if (memberIndex < 0) {
          return { success: false, error: 'Member not found' };
        }
      
        const deletedMember = members[memberIndex];
        members.splice(memberIndex, 1);
      
        // Save updated members
        PropertiesServiceHandler.saveScriptProperty(Constants.MEMBERS_KEY, members);
      
        LoggerUtil.info('Team member deleted', { email: memberId });
      
        return {
          success: true,
          message: 'Member deleted successfully',
          data: deletedMember
        };
      } catch (error) {
        ErrorHandler.logError('TeamMemberService.deleteMember', error);
        return { success: false, error: error.message };
      }
    } catch (error) {
      Logger.log("Erro em deleteMember: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get team members by element
   * @param {string} element - Element name
   * @returns {Object} Members with that element
   */
  getMembersByElement: function(element) {
    try {
      try {
        const members = PropertiesServiceHandler.getScriptProperty(Constants.MEMBERS_KEY, []);
        const filtered = members.filter(m => ElementMapper.getElement(m.sunSign) === element);
      
        return { success: true, data: filtered };
      } catch (error) {
        ErrorHandler.logError('TeamMemberService.getMembersByElement', error);
        return { success: false, error: error.message };
      }
    } catch (error) {
      Logger.log("Erro em getMembersByElement: " + error.message);
      throw error;
    }
  },
  
  /**
   * Search members by name, email, sign, element, modality or birth location.
   * Matches both the stored English values and common PT-BR labels.
   * @param {string} query - Free-text query
   * @returns {Object} { success, data: { query, results, count } }
   */
  search: function(query) {
    try {
      const all = this.getAllMembers().data || [];
      const q = String(query || '').trim().toLowerCase();
      if (!q) {
        return { success: true, data: { query: '', results: all, count: all.length } };
      }

      const signPt = {
        Aries: 'aries aries', Taurus: 'taurus touro', Gemini: 'gemini gemeos',
        Cancer: 'cancer cancer', Leo: 'leo leao', Virgo: 'virgo virgem',
        Libra: 'libra', Scorpio: 'scorpio escorpiao', Sagittarius: 'sagittarius sagitario',
        Capricorn: 'capricorn capricornio', Aquarius: 'aquarius aquario', Pisces: 'pisces peixes'
      };
      const elementPt = { Fire: 'fire fogo', Earth: 'earth terra', Air: 'air ar', Water: 'water agua' };
      const modalityPt = { Cardinal: 'cardinal', Fixed: 'fixed fixo', Mutable: 'mutable mutavel' };

      const results = all.filter(function(m) {
        const haystack = [
          m.name, m.email, m.sunSign, m.element, m.modality, m.birthLocation,
          signPt[m.sunSign], elementPt[m.element], modalityPt[m.modality]
        ].join(' ').toLowerCase();
        return haystack.indexOf(q) >= 0;
      });

      return { success: true, data: { query: query, results: results, count: results.length } };
    } catch (error) {
      ErrorHandler.logError('TeamMemberService.search', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get team size
   * @returns {Object} Team size
   */
  getTeamSize: function() {
    try {
      const members = PropertiesServiceHandler.getScriptProperty(Constants.MEMBERS_KEY, []);
      return { success: true, data: members.length };
    } catch (error) {
      ErrorHandler.logError('TeamMemberService.getTeamSize', error);
      return { success: false, error: error.message };
    }
  }
};

/**
 * Test team member service
 */
function testTeamMemberService() {
  try {
    try {
      const memberData = {
        name: 'John Doe',
        email: 'john@example.com',
        birthDate: '1990-04-15',
        birthTime: '12:30:00',
        birthLocation: 'New York, USA',
        latitude: 40.7128,
        longitude: -74.0060
      };
  
      const result = TeamMemberService.addMember(memberData);
      Logger.log('Add member result: ' + JSON.stringify(result));
  
      const allMembers = TeamMemberService.getAllMembers();
      Logger.log('All members: ' + JSON.stringify(allMembers));
    } catch (error) {
      Logger.log("Erro em testTeamMemberService: " + error.message);
      throw error;
    }
  } catch (error) {
    Logger.log("Erro em testTeamMemberService: " + error.message);
    throw error;
  }
}
