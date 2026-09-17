/**
 * PlanetInterpreter.gs
 * Interprets planetary positions and meanings
 */

const PlanetInterpreter = {
  /**
   * Get planet characteristics
   * @param {string} planet - Planet name
   * @returns {Object} Planet characteristics
   */
  getPlanetCharacteristics: function(planet) {
    const characteristics = {
      'Sun': {
        meaning: 'Core identity, ego, will',
        keywords: ['identity', 'purpose', 'vitality', 'consciousness'],
        house_meaning: 'Area of self-expression and life purpose'
      },
      'Moon': {
        meaning: 'Emotions, instincts, subconscious',
        keywords: ['emotions', 'instincts', 'nurturing', 'security'],
        house_meaning: 'Area of emotional comfort and security'
      },
      'Mercury': {
        meaning: 'Communication, intellect, reasoning',
        keywords: ['communication', 'intellect', 'learning', 'adaptability'],
        house_meaning: 'Area of communication and intellectual focus'
      },
      'Venus': {
        meaning: 'Love, values, aesthetics, pleasure',
        keywords: ['love', 'beauty', 'values', 'harmony'],
        house_meaning: 'Area of relationships and values'
      },
      'Mars': {
        meaning: 'Action, desire, aggression, courage',
        keywords: ['action', 'desire', 'courage', 'competition'],
        house_meaning: 'Area of action and drive'
      },
      'Jupiter': {
        meaning: 'Expansion, luck, wisdom, growth',
        keywords: ['expansion', 'luck', 'wisdom', 'abundance'],
        house_meaning: 'Area of growth and opportunity'
      },
      'Saturn': {
        meaning: 'Limitation, discipline, responsibility, time',
        keywords: ['discipline', 'responsibility', 'limitation', 'structure'],
        house_meaning: 'Area of challenge and growth through discipline'
      },
      'Uranus': {
        meaning: 'Innovation, rebellion, change, freedom',
        keywords: ['innovation', 'rebellion', 'change', 'freedom'],
        house_meaning: 'Area of innovation and sudden change'
      },
      'Neptune': {
        meaning: 'Dreams, spirituality, illusion, compassion',
        keywords: ['dreams', 'spirituality', 'compassion', 'illusion'],
        house_meaning: 'Area of spirituality and dreams'
      },
      'Pluto': {
        meaning: 'Transformation, power, regeneration, death/rebirth',
        keywords: ['transformation', 'power', 'regeneration', 'intensity'],
        house_meaning: 'Area of deep transformation'
      }
    };
    
    return characteristics[planet] || null;
  },
  
  /**
   * Get planet in sign interpretation
   * @param {string} planet - Planet name
   * @param {string} sign - Sign name
   * @returns {string} Interpretation
   */
  getPlanetInSignInterpretation: function(planet, sign) {
    try {
      const planetChar = this.getPlanetCharacteristics(planet);
      const signChar = SignInterpreter.getSignCharacteristics(sign);
    
      if (!planetChar || !signChar) {
        return 'Interpretation not available';
      }
    
      // Create a combined interpretation
      return `${planet} in ${sign}: ${planetChar.meaning} expressed through ${signChar.element} element (${signChar.traits.join(', ')})`;
    } catch (error) {
      Logger.log("Erro em getPlanetInSignInterpretation: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get planet in house interpretation
   * @param {string} planet - Planet name
   * @param {number} house - House number
   * @returns {string} Interpretation
   */
  getPlanetInHouseInterpretation: function(planet, house) {
    const planetChar = this.getPlanetCharacteristics(planet);
    const houseMeaning = NatalChartCalculator.getHouseMeaning(house);
    
    if (!planetChar) {
      return 'Interpretation not available';
    }
    
    return `${planet} in House ${house}: ${planetChar.meaning} affecting ${houseMeaning}`;
  },
  
  /**
   * Get retrograde planet meaning
   * @param {string} planet - Planet name
   * @returns {string} Retrograde meaning
   */
  getRetrogradeeMeaning: function(planet) {
    const meanings = {
      'Mercury': 'Communication challenges, review and reflection',
      'Venus': 'Relationship reassessment, value reconsideration',
      'Mars': 'Delayed action, internal drive, reassessing goals',
      'Jupiter': 'Internal growth, spiritual development',
      'Saturn': 'Karmic lessons, internal discipline',
      'Uranus': 'Internal revolution, personal transformation',
      'Neptune': 'Spiritual introspection, inner dreams',
      'Pluto': 'Internal transformation, psychological depth'
    };
    
    return meanings[planet] || 'Retrograde motion indicates internalization of the planet\'s energy';
  },
  
  /**
   * Get planet dignity (exaltation, detriment, fall)
   * @param {string} planet - Planet name
   * @param {string} sign - Sign name
   * @returns {string} Dignity status
   */
  getPlanetDignity: function(planet, sign) {
    const dignities = {
      'Sun': { exaltation: 'Aries', detriment: 'Libra', fall: 'Libra' },
      'Moon': { exaltation: 'Taurus', detriment: 'Scorpio', fall: 'Scorpio' },
      'Mercury': { exaltation: 'Virgo', detriment: 'Sagittarius', fall: 'Pisces' },
      'Venus': { exaltation: 'Pisces', detriment: 'Aries', fall: 'Virgo' },
      'Mars': { exaltation: 'Capricorn', detriment: 'Libra', fall: 'Cancer' },
      'Jupiter': { exaltation: 'Cancer', detriment: 'Gemini', fall: 'Capricorn' },
      'Saturn': { exaltation: 'Libra', detriment: 'Cancer', fall: 'Aries' }
    };
    
    if (!dignities[planet]) {
      return 'Neutral';
    }
    
    const planetDignities = dignities[planet];
    if (sign === planetDignities.exaltation) {
      return 'Exalted - Strong and beneficial';
    } else if (sign === planetDignities.detriment) {
      return 'In Detriment - Weakened expression';
    } else if (sign === planetDignities.fall) {
      return 'In Fall - Challenged expression';
    }
    
    return 'Neutral';
  }
};

/**
 * Test planet interpreter
 */
function testPlanetInterpreter() {
  try {
    try {
      Logger.log('Sun characteristics: ' + JSON.stringify(PlanetInterpreter.getPlanetCharacteristics('Sun')));
      Logger.log('Sun in Aries: ' + PlanetInterpreter.getPlanetInSignInterpretation('Sun', 'Aries'));
      Logger.log('Mercury retrograde: ' + PlanetInterpreter.getRetrogradeeMeaning('Mercury'));
    } catch (error) {
      Logger.log("Erro em testPlanetInterpreter: " + error.message);
      throw error;
    }
  } catch (error) {
    Logger.log("Erro em testPlanetInterpreter: " + error.message);
    throw error;
  }
}

