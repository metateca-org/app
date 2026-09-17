/**
 * AspectCalculator.gs
 * Calculates astrological aspects between planets
 */

const AspectCalculator = {
  /**
   * Calculate aspect between two planets
   * @param {number} degree1 - First planet degree
   * @param {number} degree2 - Second planet degree
   * @returns {Object} Aspect information
   */
  calculateAspect: function(degree1, degree2) {
    const diff = Math.abs(degree1 - degree2);
    const normalizedDiff = diff > 180 ? 360 - diff : diff;
    
    // Check for aspects
    const aspects = [
      { name: 'Conjunction', angle: 0, orb: 8 },
      { name: 'Sextile', angle: 60, orb: 6 },
      { name: 'Square', angle: 90, orb: 8 },
      { name: 'Trine', angle: 120, orb: 8 },
      { name: 'Opposition', angle: 180, orb: 8 },
      { name: 'Quincunx', angle: 150, orb: 3 }
    ];
    
    for (let aspect of aspects) {
      const orb = Math.abs(normalizedDiff - aspect.angle);
      if (orb <= aspect.orb) {
        return {
          type: aspect.name,
          angle: aspect.angle,
          actualAngle: normalizedDiff,
          orb: orb,
          isExact: orb < 1,
          isApplying: degree1 < degree2
        };
      }
    }
    
    return null;
  },
  
  /**
   * Get aspect interpretation
   * @param {string} planet1 - First planet name
   * @param {string} planet2 - Second planet name
   * @param {string} aspectType - Aspect type (e.g., 'Conjunction')
   * @returns {string} Aspect interpretation
   */
  getAspectInterpretation: function(planet1, planet2, aspectType) {
    const interpretations = {
      'Conjunction': 'Blending of energies, intensity, emphasis',
      'Sextile': 'Harmonious, flowing, supportive',
      'Square': 'Tension, challenge, growth through friction',
      'Trine': 'Harmony, ease, natural talent',
      'Opposition': 'Polarity, balance needed, projection',
      'Quincunx': 'Adjustment needed, subtle tension'
    };
    
    const baseInterpretation = interpretations[aspectType] || 'Aspect influence';
    return `${planet1} ${aspectType} ${planet2}: ${baseInterpretation}`;
  },
  
  /**
   * Get aspect quality (harmonious or challenging)
   * @param {string} aspectType - Aspect type
   * @returns {string} Aspect quality
   */
  getAspectQuality: function(aspectType) {
    const harmonious = ['Sextile', 'Trine'];
    const challenging = ['Square', 'Opposition', 'Quincunx'];
    const neutral = ['Conjunction'];
    
    if (harmonious.includes(aspectType)) {
      return 'Harmonious';
    } else if (challenging.includes(aspectType)) {
      return 'Challenging';
    } else if (neutral.includes(aspectType)) {
      return 'Neutral (can be harmonious or challenging depending on planets)';
    }
    
    return 'Unknown';
  },
  
  /**
   * Get aspect orb
   * @param {string} aspectType - Aspect type
   * @returns {number} Orb in degrees
   */
  getAspectOrb: function(aspectType) {
    const orbs = {
      'Conjunction': 8,
      'Sextile': 6,
      'Square': 8,
      'Trine': 8,
      'Opposition': 8,
      'Quincunx': 3
    };
    
    return orbs[aspectType] || 0;
  },
  
  /**
   * Check if aspect is exact
   * @param {number} orb - Orb value
   * @returns {boolean} True if exact
   */
  isExactAspect: function(orb) {
    return orb < 1;
  },
  
  /**
   * Get major aspects
   * @returns {Array} Array of major aspect types
   */
  getMajorAspects: function() {
    return ['Conjunction', 'Sextile', 'Square', 'Trine', 'Opposition'];
  },
  
  /**
   * Get minor aspects
   * @returns {Array} Array of minor aspect types
   */
  getMinorAspects: function() {
    return ['Quincunx', 'Semi-sextile', 'Sesquiquadrate'];
  }
};

/**
 * Test aspect calculator
 */
function testAspectCalculator() {
  try {
    try {
      const aspect = AspectCalculator.calculateAspect(0, 60);
      Logger.log('Aspect between 0° and 60°: ' + JSON.stringify(aspect));
  
      Logger.log('Sextile interpretation: ' + AspectCalculator.getAspectInterpretation('Sun', 'Moon', 'Sextile'));
      Logger.log('Square quality: ' + AspectCalculator.getAspectQuality('Square'));
    } catch (error) {
      Logger.log("Erro em testAspectCalculator: " + error.message);
      throw error;
    }
  } catch (error) {
    Logger.log("Erro em testAspectCalculator: " + error.message);
    throw error;
  }
}

