/**
 * NatalChartCalculator.gs
 * Calculates natal chart positions and data
 */

const NatalChartCalculator = {
  /**
   * Calculate natal chart from API data
   * @param {Object} apiData - Data from astrology API
   * @returns {Object} Calculated natal chart
   */
  calculateChart: function(apiData) {
    try {
      const chart = {
        birthData: apiData,
        sunSign: apiData.sun ? apiData.sun.sign : null,
        moonSign: apiData.moon ? apiData.moon.sign : null,
        ascendant: apiData.ascendant ? apiData.ascendant.sign : null,
        planets: this.extractPlanets(apiData),
        houses: this.extractHouses(apiData),
        aspects: this.extractAspects(apiData),
        calculatedAt: DateTimeUtils.getCurrentDateTime()
      };
      
      return { success: true, data: chart };
    } catch (error) {
      ErrorHandler.logError('NatalChartCalculator.calculateChart', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Extract planet positions
   * @param {Object} apiData - API data
   * @returns {Array} Planet positions
   */
  extractPlanets: function(apiData) {
    try {
      const planets = [];
    
      if (apiData.planets) {
        for (let planetName in apiData.planets) {
          const planet = apiData.planets[planetName];
          planets.push({
            name: planetName,
            sign: planet.sign,
            degree: planet.degree,
            retrograde: planet.retrograde || false
          });
        }
      }
    
      return planets;
    } catch (error) {
      Logger.log("Erro em extractPlanets: " + error.message);
      throw error;
    }
  },
  
  /**
   * Extract house positions
   * @param {Object} apiData - API data
   * @returns {Array} House positions
   */
  extractHouses: function(apiData) {
    try {
      const houses = [];
    
      if (apiData.houses) {
        for (let i = 1; i <= 12; i++) {
          const house = apiData.houses[i];
          if (house) {
            houses.push({
              house: i,
              sign: house.sign,
              degree: house.degree
            });
          }
        }
      }
    
      return houses;
    } catch (error) {
      Logger.log("Erro em extractHouses: " + error.message);
      throw error;
    }
  },
  
  /**
   * Extract aspects
   * @param {Object} apiData - API data
   * @returns {Array} Aspects
   */
  extractAspects: function(apiData) {
    try {
      const aspects = [];
    
      if (apiData.aspects && Array.isArray(apiData.aspects)) {
        for (let aspect of apiData.aspects) {
          aspects.push({
            planet1: aspect.planet1,
            planet2: aspect.planet2,
            type: aspect.type,
            orb: aspect.orb
          });
        }
      }
    
      return aspects;
    } catch (error) {
      Logger.log("Erro em extractAspects: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get planet in sign interpretation
   * @param {string} planet - Planet name
   * @param {string} sign - Sign name
   * @returns {string} Interpretation
   */
  getPlanetInSignInterpretation: function(planet, sign) {
    // Simplified interpretation database
    const interpretations = {
      'Sun-Aries': 'Direct, courageous, pioneering spirit',
      'Sun-Taurus': 'Stable, practical, reliable',
      'Sun-Gemini': 'Communicative, curious, adaptable',
      'Sun-Cancer': 'Emotional, nurturing, protective',
      'Sun-Leo': 'Creative, confident, generous',
      'Sun-Virgo': 'Analytical, practical, detail-oriented',
      'Moon-Aries': 'Emotionally direct, quick to react',
      'Moon-Taurus': 'Emotionally stable, comfort-seeking',
      'Moon-Gemini': 'Emotionally curious, communicative',
      'Mercury-Aries': 'Quick thinking, direct communication',
      'Mercury-Taurus': 'Practical thinking, steady communication',
      'Venus-Aries': 'Passionate, direct in love',
      'Venus-Taurus': 'Loyal, sensual, stable in love'
    };
    
    const key = planet + '-' + sign;
    return interpretations[key] || 'See detailed astrological interpretation';
  },
  
  /**
   * Get house interpretation
   * @param {number} house - House number
   * @returns {string} House meaning
   */
  getHouseMeaning: function(house) {
    const meanings = {
      1: 'Self, appearance, personality',
      2: 'Finances, possessions, values',
      3: 'Communication, siblings, short journeys',
      4: 'Home, family, roots',
      5: 'Creativity, romance, children',
      6: 'Work, health, daily routines',
      7: 'Relationships, partnerships',
      8: 'Transformation, shared resources',
      9: 'Higher learning, travel, philosophy',
      10: 'Career, public image, reputation',
      11: 'Friendships, groups, hopes',
      12: 'Spirituality, hidden matters, endings'
    };

    return meanings[house] || 'Unknown house';
  },

  /**
   * Build a natal chart view-model for a stored member.
   * The sun-sign portion is computed locally (no external dependency). The full
   * chart (Moon, Ascendant, houses, aspects) is fetched from the configured
   * astrology API only when ASTROLOGY_API_KEY is set; otherwise apiAvailable is
   * false and apiNote explains what is missing -- we never fabricate positions.
   * @param {Object} member - Stored member with birth data
   * @returns {Object} { success, data: { local, apiAvailable, fullChart, apiNote } }
   */
  buildForMember: function(member) {
    try {
      if (!member || !member.sunSign) {
        return { success: false, error: 'Membro sem dados de nascimento suficientes.' };
      }

      const sign = member.sunSign;
      const chars = SignInterpreter.getSignCharacteristics(sign) || {};
      const local = {
        name: member.name,
        email: member.email,
        birthDate: member.birthDate,
        birthTime: member.birthTime,
        birthLocation: member.birthLocation,
        sun: {
          sign: sign,
          element: ElementMapper.getElement(sign),
          modality: ModalityMapper.getModality(sign),
          rulingPlanet: chars.ruling_planet || null,
          traits: chars.traits || [],
          strengths: chars.strengths || [],
          challenges: chars.challenges || []
        }
      };

      let apiAvailable = false;
      let fullChart = null;
      let apiNote = 'O mapa completo (Lua, Ascendente, casas e aspectos) requer uma API de astrologia configurada. Defina ASTROLOGY_API_KEY nas Script Properties para habilitar.';

      if (ApiConfig.isAstrologyApiEnabled()) {
        const apiResult = AstrologyAPIService.getNatalChart(member);
        if (apiResult && apiResult.success) {
          const calc = this.calculateChart(apiResult.data);
          if (calc.success) {
            fullChart = calc.data;
            apiAvailable = true;
            apiNote = '';
          }
        } else {
          apiNote = 'A API de astrologia está configurada, mas não retornou o mapa completo: ' + ((apiResult && apiResult.error) || 'erro desconhecido') + '.';
        }
      }

      return { success: true, data: { local: local, apiAvailable: apiAvailable, fullChart: fullChart, apiNote: apiNote } };
    } catch (error) {
      ErrorHandler.logError('NatalChartCalculator.buildForMember', error);
      return { success: false, error: error.message };
    }
  }
};

/**
 * Test natal chart calculator
 */
function testNatalChartCalculator() {
  try {
    const apiData = {
      sun: { sign: 'Aries', degree: 25 },
      moon: { sign: 'Taurus', degree: 12 },
      ascendant: { sign: 'Gemini', degree: 5 },
      planets: {
        'Mercury': { sign: 'Aries', degree: 20 },
        'Venus': { sign: 'Taurus', degree: 15 }
      },
      houses: {
        1: { sign: 'Gemini', degree: 5 },
        10: { sign: 'Pisces', degree: 15 }
      },
      aspects: [
        { planet1: 'Sun', planet2: 'Moon', type: 'Conjunction', orb: 2 }
      ]
    };
  
    const result = NatalChartCalculator.calculateChart(apiData);
    Logger.log('Natal chart: ' + JSON.stringify(result));
  } catch (error) {
    Logger.log("Erro em testNatalChartCalculator: " + error.message);
    throw error;
  }
}
