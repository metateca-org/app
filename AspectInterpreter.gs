/**
 * AspectInterpreter.gs
 * Interprets astrological aspects in detail
 */

const AspectInterpreter = {
  /**
   * Get detailed aspect interpretation
   * @param {string} planet1 - First planet
   * @param {string} planet2 - Second planet
   * @param {string} aspectType - Aspect type
   * @returns {Object} Detailed interpretation
   */
  getDetailedInterpretation: function(planet1, planet2, aspectType) {
    const interpretation = {
      planets: `${planet1} ${aspectType} ${planet2}`,
      quality: AspectCalculator.getAspectQuality(aspectType),
      meaning: this.getAspectMeaning(aspectType),
      combined: this.getCombinedPlanetMeaning(planet1, planet2, aspectType),
      challenges: this.getAspectChallenges(planet1, planet2, aspectType),
      opportunities: this.getAspectOpportunities(planet1, planet2, aspectType)
    };
    
    return interpretation;
  },
  
  /**
   * Get aspect meaning
   * @param {string} aspectType - Aspect type
   * @returns {string} Aspect meaning
   */
  getAspectMeaning: function(aspectType) {
    const meanings = {
      'Conjunction': 'Fusion of energies, intensity, new beginnings',
      'Sextile': 'Opportunity, ease, natural talent, support',
      'Square': 'Challenge, tension, growth through friction, dynamic',
      'Trine': 'Harmony, flow, natural ability, ease',
      'Opposition': 'Polarity, awareness, need for balance, projection',
      'Quincunx': 'Adjustment, fine-tuning, subtle tension, awareness'
    };
    
    return meanings[aspectType] || 'Aspect influence';
  },
  
  /**
   * Get combined planet meaning
   * @param {string} planet1 - First planet
   * @param {string} planet2 - Second planet
   * @param {string} aspectType - Aspect type
   * @returns {string} Combined meaning
   */
  getCombinedPlanetMeaning: function(planet1, planet2, aspectType) {
    const char1 = PlanetInterpreter.getPlanetCharacteristics(planet1);
    const char2 = PlanetInterpreter.getPlanetCharacteristics(planet2);
    
    if (!char1 || !char2) {
      return 'Combined meaning not available';
    }
    
    const quality = AspectCalculator.getAspectQuality(aspectType);
    
    if (quality === 'Harmonious') {
      return `${planet1}'s ${char1.keywords[0]} flows naturally with ${planet2}'s ${char2.keywords[0]}`;
    } else if (quality === 'Challenging') {
      return `${planet1}'s ${char1.keywords[0]} creates tension with ${planet2}'s ${char2.keywords[0]}, requiring integration`;
    } else {
      return `${planet1}'s ${char1.keywords[0]} blends with ${planet2}'s ${char2.keywords[0]}`;
    }
  },
  
  /**
   * Get aspect challenges
   * @param {string} planet1 - First planet
   * @param {string} planet2 - Second planet
   * @param {string} aspectType - Aspect type
   * @returns {Array} Challenges
   */
  getAspectChallenges: function(planet1, planet2, aspectType) {
    try {
      const challenges = [];
    
      if (aspectType === 'Conjunction') {
        challenges.push('Intensity may be overwhelming',
                        'Difficulty distinguishing between the two energies',
                        'Potential for obsession or compulsion');
      } else if (aspectType === 'Square') {
        challenges.push('Internal conflict between the two energies',
                        'Frustration and tension',
                        'Need for conscious effort to integrate');
      } else if (aspectType === 'Opposition') {
        challenges.push('Projection of one energy onto others',
                        'Difficulty seeing both perspectives equally',
                        'Need for balance and compromise');
      } else if (aspectType === 'Quincunx') {
        challenges.push('Subtle misalignment requiring adjustment',
                        'Difficulty understanding the connection',
                        'Need for fine-tuning and adaptation');
      }
    
      return challenges;
    } catch (error) {
      Logger.log("Erro em getAspectChallenges: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get aspect opportunities
   * @param {string} planet1 - First planet
   * @param {string} planet2 - Second planet
   * @param {string} aspectType - Aspect type
   * @returns {Array} Opportunities
   */
  getAspectOpportunities: function(planet1, planet2, aspectType) {
    try {
      const opportunities = [];
    
      if (aspectType === 'Conjunction') {
        opportunities.push('Powerful combined energy',
                           'Ability to focus intensely',
                           'Potential for significant achievement');
      } else if (aspectType === 'Sextile') {
        opportunities.push('Natural talents and abilities',
                           'Easy cooperation between energies',
                           'Supportive and flowing expression');
      } else if (aspectType === 'Trine') {
        opportunities.push('Effortless expression of both energies',
                           'Natural talent and ability',
                           'Harmonious integration');
      } else if (aspectType === 'Square') {
        opportunities.push('Motivation for growth and change',
                           'Development of resilience',
                           'Potential for breakthrough');
      } else if (aspectType === 'Opposition') {
        opportunities.push('Awareness of complementary perspectives',
                           'Potential for balance and wholeness',
                           'Opportunity for growth through others');
      }
    
      return opportunities;
    } catch (error) {
      Logger.log("Erro em getAspectOpportunities: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get aspect strength
   * @param {number} orb - Orb value
   * @param {string} aspectType - Aspect type
   * @returns {string} Strength description
   */
  getAspectStrength: function(orb, aspectType) {
    const maxOrb = AspectCalculator.getAspectOrb(aspectType);
    const strength = ((maxOrb - orb) / maxOrb) * 100;
    
    if (strength > 90) {
      return 'Exact - Very strong influence';
    } else if (strength > 70) {
      return 'Strong - Significant influence';
    } else if (strength > 50) {
      return 'Moderate - Noticeable influence';
    } else if (strength > 30) {
      return 'Weak - Subtle influence';
    } else {
      return 'Very weak - Minimal influence';
    }
  }
};

/**
 * Test aspect interpreter
 */
function testAspectInterpreter() {
  try {
    const interpretation = AspectInterpreter.getDetailedInterpretation('Sun', 'Moon', 'Conjunction');
    Logger.log('Sun-Moon Conjunction: ' + JSON.stringify(interpretation));
  } catch (error) {
    Logger.log("Erro em testAspectInterpreter: " + error.message);
    throw error;
  }
}

