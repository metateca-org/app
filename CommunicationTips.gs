/**
 * CommunicationTips.gs
 * Generates communication tips based on astrological profiles
 */

const CommunicationTips = {
  /**
   * Generate communication tips for a team member
   * @param {string} memberId - Member ID or email
   * @returns {Object} Communication tips
   */
  generateTips: function(memberId) {
    try {
      const memberResult = TeamMemberService.getMember(memberId);
      if (!memberResult.success) {
        return memberResult;
      }
      
      const member = memberResult.data;
      const element = ElementMapper.getElement(member.sunSign);
      const modality = ModalityMapper.getModality(member.sunSign);
      
      const tips = {
        member: member.name,
        sunSign: member.sunSign,
        element: element,
        modality: modality,
        
        // Communication style
        communicationStyle: this.getCommunicationStyle(element, modality),
        
        // How to communicate with this person
        howToCommunicateWithThem: this.getHowToCommunicate(element, modality),
        
        // How they prefer to receive feedback
        feedbackPreferences: this.getFeedbackPreferences(element, modality),
        
        // Conflict resolution style
        conflictStyle: this.getConflictStyle(element, modality),
        
        // Motivational factors
        motivators: this.getMotivators(element, modality),
        
        // Communication challenges
        challenges: this.getCommunicationChallenges(element, modality),
        
        // Tips for team collaboration
        collaborationTips: this.getCollaborationTips(element, modality),
        
        generatedAt: DateTimeUtils.getCurrentDateTime()
      };
      
      return { success: true, data: tips };
    } catch (error) {
      ErrorHandler.logError('CommunicationTips.generateTips', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Get communication style
   * @param {string} element - Element name
   * @param {string} modality - Modality name
   * @returns {string} Communication style
   */
  getCommunicationStyle: function(element, modality) {
    let style = '';
    
    if (element === 'Fire') {
      style = 'Direct, enthusiastic, and passionate. Prefers quick, action-oriented communication.';
    } else if (element === 'Earth') {
      style = 'Practical, detailed, and organized. Prefers clear, step-by-step communication.';
    } else if (element === 'Air') {
      style = 'Intellectual, flexible, and communicative. Prefers discussion and idea exchange.';
    } else if (element === 'Water') {
      style = 'Empathetic, intuitive, and sensitive. Prefers understanding emotions and context.';
    }
    
    return style;
  },
  
  /**
   * Get how to communicate with this person
   * @param {string} element - Element name
   * @param {string} modality - Modality name
   * @returns {Array} Communication tips
   */
  getHowToCommunicate: function(element, modality) {
    try {
      const tips = [];
    
      if (element === 'Fire') {
        tips.push('Be energetic and enthusiastic', 'Keep communication concise', 'Focus on action and results', 'Avoid lengthy explanations');
      } else if (element === 'Earth') {
        tips.push('Provide detailed information', 'Use organized, structured communication', 'Give time to process', 'Provide written documentation');
      } else if (element === 'Air') {
        tips.push('Engage in discussion', 'Share ideas and perspectives', 'Provide intellectual stimulation', 'Use clear, logical arguments');
      } else if (element === 'Water') {
        tips.push('Be empathetic and understanding', 'Acknowledge emotions', 'Create safe space for discussion', 'Show genuine interest');
      }
    
      return tips;
    } catch (error) {
      Logger.log("Erro em getHowToCommunicate: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get feedback preferences
   * @param {string} element - Element name
   * @param {string} modality - Modality name
   * @returns {Object} Feedback preferences
   */
  getFeedbackPreferences: function(element, modality) {
    let preferences = {};
    
    if (element === 'Fire') {
      preferences = {
        style: 'Direct and immediate',
        focus: 'Results and impact',
        frequency: 'Regular and frequent',
        delivery: 'In person or real-time'
      };
    } else if (element === 'Earth') {
      preferences = {
        style: 'Detailed and constructive',
        focus: 'Specific improvements and steps',
        frequency: 'Scheduled and planned',
        delivery: 'Written or in-person with time to prepare'
      };
    } else if (element === 'Air') {
      preferences = {
        style: 'Intellectual and analytical',
        focus: 'Logic and reasoning',
        frequency: 'As needed for discussion',
        delivery: 'Discussion or written analysis'
      };
    } else if (element === 'Water') {
      preferences = {
        style: 'Compassionate and supportive',
        focus: 'Growth and development',
        frequency: 'Regular and consistent',
        delivery: 'Private and one-on-one'
      };
    }
    
    return preferences;
  },
  
  /**
   * Get conflict resolution style
   * @param {string} element - Element name
   * @param {string} modality - Modality name
   * @returns {Object} Conflict style
   */
  getConflictStyle: function(element, modality) {
    let style = {};
    
    if (element === 'Fire') {
      style = {
        approach: 'Direct confrontation',
        preference: 'Quick resolution',
        avoid: 'Passive-aggressive behavior',
        tip: 'Give them space to express passion, then move to solutions'
      };
    } else if (element === 'Earth') {
      style = {
        approach: 'Methodical analysis',
        preference: 'Logical discussion',
        avoid: 'Emotional outbursts',
        tip: 'Present facts and allow time for consideration'
      };
    } else if (element === 'Air') {
      style = {
        approach: 'Rational discussion',
        preference: 'Understanding different perspectives',
        avoid: 'Emotional appeals',
        tip: 'Use logic and reason to find common ground'
      };
    } else if (element === 'Water') {
      style = {
        approach: 'Emotional understanding',
        preference: 'Harmony and reconciliation',
        avoid: 'Harsh criticism',
        tip: 'Acknowledge feelings and seek understanding'
      };
    }
    
    return style;
  },
  
  /**
   * Get motivators
   * @param {string} element - Element name
   * @param {string} modality - Modality name
   * @returns {Array} Motivators
   */
  getMotivators: function(element, modality) {
    try {
      const motivators = [];
    
      if (element === 'Fire') {
        motivators.push('Recognition and visibility', 'Challenging projects', 'Leadership opportunities', 'Excitement and novelty');
      } else if (element === 'Earth') {
        motivators.push('Security and stability', 'Clear goals and milestones', 'Tangible results', 'Appreciation for hard work');
      } else if (element === 'Air') {
        motivators.push('Intellectual challenges', 'Learning opportunities', 'Variety and new ideas', 'Collaborative problem-solving');
      } else if (element === 'Water') {
        motivators.push('Team harmony', 'Meaningful work', 'Personal growth', 'Helping others');
      }
    
      return motivators;
    } catch (error) {
      Logger.log("Erro em getMotivators: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get communication challenges
   * @param {string} element - Element name
   * @param {string} modality - Modality name
   * @returns {Array} Challenges
   */
  getCommunicationChallenges: function(element, modality) {
    try {
      const challenges = [];
    
      if (element === 'Fire') {
        challenges.push('May interrupt others', 'Can be impatient', 'May not listen to details', 'Can be overly blunt');
      } else if (element === 'Earth') {
        challenges.push('May be slow to respond', 'Can be rigid in thinking', 'May get lost in details', 'Can be overly cautious');
      } else if (element === 'Air') {
        challenges.push('May not follow through', 'Can be indecisive', 'May lack emotional awareness', 'Can be too theoretical');
      } else if (element === 'Water') {
        challenges.push('May take things personally', 'Can be overly sensitive', 'May avoid conflict', 'Can be moody');
      }
    
      return challenges;
    } catch (error) {
      Logger.log("Erro em getCommunicationChallenges: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get collaboration tips
   * @param {string} element - Element name
   * @param {string} modality - Modality name
   * @returns {Array} Collaboration tips
   */
  getCollaborationTips: function(element, modality) {
    try {
      const tips = [];
    
      if (element === 'Fire') {
        tips.push('Pair with detail-oriented team members', 'Give them leadership roles', 'Channel their energy into projects', 'Celebrate their contributions');
      } else if (element === 'Earth') {
        tips.push('Rely on them for planning', 'Give them time to work', 'Appreciate their thoroughness', 'Use them for quality assurance');
      } else if (element === 'Air') {
        tips.push('Use them for communication', 'Involve them in problem-solving', 'Ask for their perspective', 'Use them as coordinators');
      } else if (element === 'Water') {
        tips.push('Create supportive environment', 'Value their emotional intelligence', 'Use them for team cohesion', 'Involve them in mentoring');
      }
    
      return tips;
    } catch (error) {
      Logger.log("Erro em getCollaborationTips: " + error.message);
      throw error;
    }
  }
};

/**
 * Test communication tips
 */
function testCommunicationTips() {
  try {
    try {
      // Add a test member first
      const memberData = {
        name: 'Test Person',
        email: 'test@example.com',
        birthDate: '1990-04-15',
        birthTime: '12:30:00',
        birthLocation: 'New York, USA',
        latitude: 40.7128,
        longitude: -74.0060
      };
  
      TeamMemberService.addMember(memberData);
  
      const result = CommunicationTips.generateTips('test@example.com');
      Logger.log('Communication tips: ' + JSON.stringify(result));
    } catch (error) {
      Logger.log("Erro em testCommunicationTips: " + error.message);
      throw error;
    }
  } catch (error) {
    Logger.log("Erro em testCommunicationTips: " + error.message);
    throw error;
  }
}
