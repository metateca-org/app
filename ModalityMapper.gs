/**
 * ModalityMapper.gs
 * Maps zodiac signs to astrological modalities (Cardinal, Fixed, Mutable)
 */

const ModalityMapper = {
  /**
   * Get modality for a zodiac sign
   * @param {string} sign - Zodiac sign name
   * @returns {string} Modality name
   */
  getModality: function(sign) {
    for (let modality in Constants.MODALITIES) {
      if (Constants.MODALITIES[modality].includes(sign)) {
        return modality;
      }
    }
    return null;
  },
  
  /**
   * Get all signs for a modality
   * @param {string} modality - Modality name
   * @returns {Array} Array of signs
   */
  getSignsByModality: function(modality) {
    return Constants.MODALITIES[modality] || [];
  },
  
  /**
   * Get modality characteristics
   * @param {string} modality - Modality name
   * @returns {Object} Modality characteristics
   */
  getModalityCharacteristics: function(modality) {
    const characteristics = {
      'Cardinal': {
        name: 'Cardinal',
        description: 'Initiators and leaders',
        traits: ['initiative', 'leadership', 'action-oriented', 'pioneering', 'ambitious'],
        productivity: 'Excellent for starting projects and driving change',
        strength: 'Leadership and initiative'
      },
      'Fixed': {
        name: 'Fixed',
        description: 'Stabilizers and consolidators',
        traits: ['stability', 'persistence', 'reliability', 'determination', 'focused'],
        productivity: 'Excellent for completing projects and maintaining focus',
        strength: 'Stability and persistence'
      },
      'Mutable': {
        name: 'Mutable',
        description: 'Adaptors and communicators',
        traits: ['adaptability', 'communication', 'flexibility', 'curiosity', 'versatility'],
        productivity: 'Excellent for adaptation and communication',
        strength: 'Flexibility and communication'
      }
    };
    
    return characteristics[modality] || null;
  },
  
  /**
   * Get all modalities with their characteristics
   * @returns {Array} Array of modality information
   */
  getAllModalities: function() {
    try {
      const modalities = [];
      for (let modality in Constants.MODALITIES) {
        modalities.push({
          name: modality,
          characteristics: this.getModalityCharacteristics(modality),
          signs: this.getSignsByModality(modality)
        });
      }
      return modalities;
    } catch (error) {
      Logger.log("Erro em getAllModalities: " + error.message);
      throw error;
    }
  },
  
  /**
   * Calculate team modality distribution
   * @param {Array} teamMembers - Array of team members with sunSign
   * @returns {Object} Modality distribution
   */
  calculateTeamModalityDistribution: function(teamMembers) {
    const distribution = {
      Cardinal: 0,
      Fixed: 0,
      Mutable: 0,
      total: teamMembers.length
    };
    
    for (let member of teamMembers) {
      const modality = this.getModality(member.sunSign);
      if (modality && distribution.hasOwnProperty(modality)) {
        distribution[modality]++;
      }
    }
    
    // Calculate percentages
    distribution.cardinalPercent = (distribution.Cardinal / distribution.total * 100).toFixed(1);
    distribution.fixedPercent = (distribution.Fixed / distribution.total * 100).toFixed(1);
    distribution.mutablePercent = (distribution.Mutable / distribution.total * 100).toFixed(1);
    
    return distribution;
  },
  
  /**
   * Get modality compatibility
   * @param {string} modality1 - First modality
   * @param {string} modality2 - Second modality
   * @returns {number} Compatibility score (0-100)
   */
  getModalityCompatibility: function(modality1, modality2) {
    // Same modality: complementary
    if (modality1 === modality2) {
      return 80;
    }
    
    // All modalities work together in a balanced way
    // Cardinal initiates, Fixed consolidates, Mutable adapts
    return 70;
  },
  
  /**
   * Assess team modality balance
   * @param {Object} distribution - Modality distribution
   * @returns {Object} Assessment of team balance
   */
  assessTeamModalityBalance: function(distribution) {
    const modalities = ['Cardinal', 'Fixed', 'Mutable'];
    const percentages = [
      distribution.cardinalPercent,
      distribution.fixedPercent,
      distribution.mutablePercent
    ];
    
    const maxPercent = Math.max(...percentages);
    const minPercent = Math.min(...percentages);
    const balance = maxPercent - minPercent;
    
    let assessment = '';
    if (balance < 15) {
      assessment = 'Excellent modality balance - team has initiators, consolidators, and adapters';
    } else if (balance < 30) {
      assessment = 'Good modality balance with all three types represented';
    } else if (balance < 50) {
      assessment = 'Moderate modality imbalance - team may be stronger in one area';
    } else {
      assessment = 'Significant modality imbalance - team may lack certain capabilities';
    }
    
    return {
      balance: balance,
      assessment: assessment,
      strongest: modalities[percentages.indexOf(maxPercent)],
      weakest: modalities[percentages.indexOf(minPercent)],
      recommendation: this.getModalityRecommendation(distribution)
    };
  },
  
  /**
   * Get recommendation based on modality distribution
   * @param {Object} distribution - Modality distribution
   * @returns {string} Recommendation
   */
  getModalityRecommendation: function(distribution) {
    if (distribution.Cardinal > distribution.Fixed && distribution.Cardinal > distribution.Mutable) {
      return 'Team is strong in initiative and leadership. Focus on execution and follow-through.';
    } else if (distribution.Fixed > distribution.Cardinal && distribution.Fixed > distribution.Mutable) {
      return 'Team is strong in stability and persistence. Encourage more flexibility and adaptation.';
    } else if (distribution.Mutable > distribution.Cardinal && distribution.Mutable > distribution.Fixed) {
      return 'Team is strong in adaptation and communication. Ensure projects are completed and decisions are made.';
    } else {
      return 'Team has balanced modality distribution.';
    }
  }
};

/**
 * Test modality mapper
 */
function testModalityMapper() {
  try {
    Logger.log('Modality for Aries: ' + ModalityMapper.getModality('Aries'));
    Logger.log('Cardinal signs: ' + JSON.stringify(ModalityMapper.getSignsByModality('Cardinal')));
    Logger.log('Modality characteristics: ' + JSON.stringify(ModalityMapper.getModalityCharacteristics('Cardinal')));
  } catch (error) {
    Logger.log("Erro em testModalityMapper: " + error.message);
    throw error;
  }
}
