/**
 * UserProfileService.gs
 * Service for managing user profiles
 */

const UserProfileService = {
  /**
   * Get a user profile
   * @param {string} userId - User ID or email
   * @returns {Object} User profile
   */
  getProfile: function(userId) {
    try {
      const memberResult = TeamMemberService.getMember(userId);
      if (!memberResult.success) {
        return memberResult;
      }
      
      const member = memberResult.data;
      
      // Build comprehensive profile
      const profile = {
        id: member.email,
        name: member.name,
        email: member.email,
        birthDate: member.birthDate,
        birthTime: member.birthTime,
        birthLocation: member.birthLocation,
        age: member.age,
        sunSign: member.sunSign,
        dayOfWeek: member.dayOfWeek,
        
        // Astrological info
        element: ElementMapper.getElement(member.sunSign),
        modality: ModalityMapper.getModality(member.sunSign),
        
        // Productivity profile
        productivityProfile: member.productivityProfile,
        
        // Additional info
        joinedAt: member.processedAt,
        lastUpdated: DateTimeUtils.getCurrentDateTime()
      };
      
      return { success: true, data: profile };
    } catch (error) {
      ErrorHandler.logError('UserProfileService.getProfile', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Update a user profile
   * @param {string} userId - User ID or email
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated profile
   */
  updateProfile: function(userId, updateData) {
    try {
      // Update team member
      const updateResult = TeamMemberService.updateMember(userId, updateData);
      if (!updateResult.success) {
        return updateResult;
      }
      
      // Return updated profile
      return this.getProfile(userId);
    } catch (error) {
      ErrorHandler.logError('UserProfileService.updateProfile', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Get user preferences
   * @param {string} userId - User ID or email
   * @returns {Object} User preferences
   */
  getPreferences: function(userId) {
    try {
      const prefKey = 'prefs_' + userId;
      const preferences = PropertiesServiceHandler.getUserProperty(prefKey, {
        theme: 'light',
        language: 'pt-BR',
        notifications: true,
        emailUpdates: false
      });
      
      return { success: true, data: preferences };
    } catch (error) {
      ErrorHandler.logError('UserProfileService.getPreferences', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Update user preferences
   * @param {string} userId - User ID or email
   * @param {Object} preferences - Preferences to update
   * @returns {Object} Updated preferences
   */
  updatePreferences: function(userId, preferences) {
    try {
      try {
        const prefKey = 'prefs_' + userId;
        const currentPrefs = PropertiesServiceHandler.getUserProperty(prefKey, {});
        const updatedPrefs = ObjectUtils.merge(currentPrefs, preferences);
      
        PropertiesServiceHandler.saveUserProperty(prefKey, updatedPrefs);
      
        LoggerUtil.info('User preferences updated', { userId: userId });
      
        return { success: true, data: updatedPrefs };
      } catch (error) {
        ErrorHandler.logError('UserProfileService.updatePreferences', error);
        return { success: false, error: error.message };
      }
    } catch (error) {
      Logger.log("Erro em updatePreferences: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get user statistics
   * @param {string} userId - User ID or email
   * @returns {Object} User statistics
   */
  getStatistics: function(userId) {
    try {
      const memberResult = TeamMemberService.getMember(userId);
      if (!memberResult.success) {
        return memberResult;
      }
      
      const member = memberResult.data;
      const allMembers = PropertiesServiceHandler.getScriptProperty(Constants.MEMBERS_KEY, []);
      
      // Calculate statistics
      const element = ElementMapper.getElement(member.sunSign);
      const membersWithSameElement = allMembers.filter(m => ElementMapper.getElement(m.sunSign) === element);
      
      const modality = ModalityMapper.getModality(member.sunSign);
      const membersWithSameModality = allMembers.filter(m => ModalityMapper.getModality(m.sunSign) === modality);
      
      const stats = {
        userId: userId,
        teamSize: allMembers.length,
        membersWithSameElement: membersWithSameElement.length,
        membersWithSameModality: membersWithSameModality.length,
        elementPercentage: (membersWithSameElement.length / allMembers.length * 100).toFixed(1),
        modalityPercentage: (membersWithSameModality.length / allMembers.length * 100).toFixed(1)
      };
      
      return { success: true, data: stats };
    } catch (error) {
      ErrorHandler.logError('UserProfileService.getStatistics', error);
      return { success: false, error: error.message };
    }
  }
};

/**
 * Test user profile service
 */
function testUserProfileService() {
  try {
    try {
      // First add a member
      const memberData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        birthDate: '1995-06-20',
        birthTime: '14:45:00',
        birthLocation: 'Los Angeles, USA',
        latitude: 34.0522,
        longitude: -118.2437
      };
  
      TeamMemberService.addMember(memberData);
  
      // Get profile
      const profileResult = UserProfileService.getProfile('jane@example.com');
      Logger.log('User profile: ' + JSON.stringify(profileResult));
  
      // Get preferences
      const prefsResult = UserProfileService.getPreferences('jane@example.com');
      Logger.log('User preferences: ' + JSON.stringify(prefsResult));
    } catch (error) {
      Logger.log("Erro em testUserProfileService: " + error.message);
      throw error;
    }
  } catch (error) {
    Logger.log("Erro em testUserProfileService: " + error.message);
    throw error;
  }
}
