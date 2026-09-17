/**
 * ProductivityProfileGenerator.gs
 * Generates productivity profiles based on astrological data
 */

const ProductivityProfileGenerator = {
  /**
   * Generate a productivity profile for a team member
   * @param {Object} birthData - Birth data with astrological info
   * @returns {Object} Productivity profile
   */
  generateProfile: function(birthData) {
    try {
      const element = ElementMapper.getElement(birthData.sunSign);
      const modality = ModalityMapper.getModality(birthData.sunSign);
      const elementTraits = ElementMapper.getElementTraits(element);
      const modalityTraits = ModalityMapper.getModalityCharacteristics(modality);
      
      const profile = {
        memberId: birthData.email || StringUtils.generateRandom(10),
        name: birthData.name,
        sunSign: birthData.sunSign,
        element: element,
        modality: modality,
        age: birthData.age,
        
        // Productivity characteristics
        elementName: elementTraits.name,
        elementTraits: elementTraits.traits,
        elementProductivity: elementTraits.productivity,
        
        modalityName: modalityTraits.name,
        modalityTraits: modalityTraits.traits,
        modalityProductivity: modalityTraits.productivity,
        
        // Suggested roles based on profile
        suggestedRoles: this.suggestRoles(element, modality),
        
        // Communication style
        communicationStyle: this.getCommunicationStyle(element, modality),
        
        // Strengths
        strengths: this.getStrengths(element, modality),
        
        // Challenges
        challenges: this.getChallenges(element, modality),
        
        // Productivity tips
        productivityTips: this.getProductivityTips(element, modality),
        
        // Generated at
        generatedAt: DateTimeUtils.getCurrentDateTime()
      };
      
      return { success: true, data: profile };
    } catch (error) {
      ErrorHandler.logError('ProductivityProfileGenerator.generateProfile', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Suggest project roles based on element and modality
   * @param {string} element - Element name
   * @param {string} modality - Modality name
   * @returns {Array} Array of suggested roles
   */
  suggestRoles: function(element, modality) {
    try {
      const roles = [];
    
      // Cardinal initiators
      if (modality === 'Cardinal') {
        roles.push('Project Manager', 'Team Lead', 'Strategist');
      }
    
      // Fixed consolidators
      if (modality === 'Fixed') {
        roles.push('Executor', 'Quality Assurance', 'Specialist');
      }
    
      // Mutable adapters
      if (modality === 'Mutable') {
        roles.push('Communicator', 'Coordinator', 'Analyst');
      }
    
      // Fire elements
      if (element === 'Fire') {
        roles.push('Innovator', 'Leader', 'Motivator');
      }
    
      // Earth elements
      if (element === 'Earth') {
        roles.push('Planner', 'Organizer', 'Implementer');
      }
    
      // Air elements
      if (element === 'Air') {
        roles.push('Communicator', 'Analyst', 'Strategist');
      }
    
      // Water elements
      if (element === 'Water') {
        roles.push('Mediator', 'Counselor', 'Collaborator');
      }
    
      return ArrayUtils.unique(roles);
    } catch (error) {
      Logger.log("Erro em suggestRoles: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get communication style
   * @param {string} element - Element name
   * @param {string} modality - Modality name
   * @returns {string} Communication style description
   */
  getCommunicationStyle: function(element, modality) {
    let style = '';
    
    if (element === 'Fire') {
      style = 'Direct, enthusiastic, and passionate communication. Prefers quick decisions and action.';
    } else if (element === 'Earth') {
      style = 'Practical, organized, and clear communication. Prefers detailed information and step-by-step explanations.';
    } else if (element === 'Air') {
      style = 'Intellectual, flexible, and communicative. Prefers discussion and exchange of ideas.';
    } else if (element === 'Water') {
      style = 'Empathetic, intuitive, and sensitive communication. Prefers understanding emotions and motivations.';
    }
    
    return style;
  },
  
  /**
   * Get strengths based on element and modality
   * @param {string} element - Element name
   * @param {string} modality - Modality name
   * @returns {Array} Array of strengths
   */
  getStrengths: function(element, modality) {
    try {
      const strengths = [];
    
      // Add element-based strengths
      const elementTraits = ElementMapper.getElementTraits(element);
      if (elementTraits) {
        strengths.push(...elementTraits.traits);
      }
    
      // Add modality-based strengths
      const modalityTraits = ModalityMapper.getModalityCharacteristics(modality);
      if (modalityTraits) {
        strengths.push(...modalityTraits.traits);
      }
    
      return ArrayUtils.unique(strengths);
    } catch (error) {
      Logger.log("Erro em getStrengths: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get challenges based on element and modality
   * @param {string} element - Element name
   * @param {string} modality - Modality name
   * @returns {Array} Array of challenges
   */
  getChallenges: function(element, modality) {
    try {
      const challenges = [];
    
      if (element === 'Fire') {
        challenges.push('May be impatient', 'Can be impulsive', 'May overlook details');
      } else if (element === 'Earth') {
        challenges.push('May be overly cautious', 'Can resist change', 'May focus too much on details');
      } else if (element === 'Air') {
        challenges.push('May lack follow-through', 'Can be indecisive', 'May be too theoretical');
      } else if (element === 'Water') {
        challenges.push('May be overly emotional', 'Can take things personally', 'May avoid conflict');
      }
    
      return challenges;
    } catch (error) {
      Logger.log("Erro em getChallenges: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get productivity tips
   * @param {string} element - Element name
   * @param {string} modality - Modality name
   * @returns {Array} Array of productivity tips
   */
  getProductivityTips: function(element, modality) {
    try {
      const tips = [];
    
      if (element === 'Fire') {
        tips.push('Channel enthusiasm into focused projects', 'Set clear deadlines to maintain momentum', 'Collaborate with detail-oriented team members');
      } else if (element === 'Earth') {
        tips.push('Break large projects into manageable steps', 'Create detailed timelines and checklists', 'Allow time for thorough planning');
      } else if (element === 'Air') {
        tips.push('Communicate ideas clearly to team', 'Use brainstorming sessions effectively', 'Follow up on decisions with action steps');
      } else if (element === 'Water') {
        tips.push('Create supportive team environment', 'Use intuition for problem-solving', 'Balance emotional needs with deadlines');
      }
    
      if (modality === 'Cardinal') {
        tips.push('Lead by example and take initiative', 'Delegate tasks to others', 'Focus on big-picture goals');
      } else if (modality === 'Fixed') {
        tips.push('Maintain consistency and reliability', 'Build expertise in your area', 'Provide stability for the team');
      } else if (modality === 'Mutable') {
        tips.push('Adapt quickly to changing circumstances', 'Facilitate communication between team members', 'Help team stay flexible');
      }
    
      return tips;
    } catch (error) {
      Logger.log("Erro em getProductivityTips: " + error.message);
      throw error;
    }
  }
};

/**
 * Test productivity profile generator
 */
function testProductivityProfileGenerator() {
  try {
    const birthData = {
      name: 'Test Person',
      sunSign: 'Aries',
      age: 34,
      email: 'test@example.com'
    };
  
    const result = ProductivityProfileGenerator.generateProfile(birthData);
    Logger.log('Productivity profile: ' + JSON.stringify(result));
  } catch (error) {
    Logger.log("Erro em testProductivityProfileGenerator: " + error.message);
    throw error;
  }
}
