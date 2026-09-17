/**
 * SignInterpreter.gs
 * Interprets zodiac signs and their meanings
 */

const SignInterpreter = {
  /**
   * Get sign characteristics
   * @param {string} sign - Zodiac sign name
   * @returns {Object} Sign characteristics
   */
  getSignCharacteristics: function(sign) {
    const characteristics = {
      'Aries': {
        element: 'Fire',
        modality: 'Cardinal',
        ruling_planet: 'Mars',
        traits: ['courageous', 'determined', 'confident', 'passionate'],
        strengths: ['leadership', 'initiative', 'courage'],
        challenges: ['impulsiveness', 'impatience', 'aggression']
      },
      'Taurus': {
        element: 'Earth',
        modality: 'Fixed',
        ruling_planet: 'Venus',
        traits: ['reliable', 'practical', 'sensual', 'stable'],
        strengths: ['loyalty', 'dependability', 'patience'],
        challenges: ['stubbornness', 'possessiveness', 'resistance to change']
      },
      'Gemini': {
        element: 'Air',
        modality: 'Mutable',
        ruling_planet: 'Mercury',
        traits: ['communicative', 'curious', 'adaptable', 'intellectual'],
        strengths: ['communication', 'versatility', 'intelligence'],
        challenges: ['inconsistency', 'superficiality', 'indecisiveness']
      },
      'Cancer': {
        element: 'Water',
        modality: 'Cardinal',
        ruling_planet: 'Moon',
        traits: ['emotional', 'nurturing', 'protective', 'intuitive'],
        strengths: ['empathy', 'loyalty', 'intuition'],
        challenges: ['moodiness', 'oversensitivity', 'clinginess']
      },
      'Leo': {
        element: 'Fire',
        modality: 'Fixed',
        ruling_planet: 'Sun',
        traits: ['creative', 'confident', 'generous', 'proud'],
        strengths: ['creativity', 'leadership', 'generosity'],
        challenges: ['arrogance', 'pride', 'need for attention']
      },
      'Virgo': {
        element: 'Earth',
        modality: 'Mutable',
        ruling_planet: 'Mercury',
        traits: ['analytical', 'practical', 'detail-oriented', 'helpful'],
        strengths: ['analysis', 'organization', 'reliability'],
        challenges: ['perfectionism', 'criticism', 'anxiety']
      },
      'Libra': {
        element: 'Air',
        modality: 'Cardinal',
        ruling_planet: 'Venus',
        traits: ['diplomatic', 'fair', 'social', 'aesthetic'],
        strengths: ['diplomacy', 'balance', 'justice'],
        challenges: ['indecisiveness', 'people-pleasing', 'superficiality']
      },
      'Scorpio': {
        element: 'Water',
        modality: 'Fixed',
        ruling_planet: 'Pluto',
        traits: ['intense', 'passionate', 'secretive', 'powerful'],
        strengths: ['intensity', 'loyalty', 'transformation'],
        challenges: ['jealousy', 'possessiveness', 'secretiveness']
      },
      'Sagittarius': {
        element: 'Fire',
        modality: 'Mutable',
        ruling_planet: 'Jupiter',
        traits: ['adventurous', 'optimistic', 'philosophical', 'free-spirited'],
        strengths: ['optimism', 'adventure', 'wisdom'],
        challenges: ['recklessness', 'tactlessness', 'overconfidence']
      },
      'Capricorn': {
        element: 'Earth',
        modality: 'Cardinal',
        ruling_planet: 'Saturn',
        traits: ['ambitious', 'disciplined', 'responsible', 'practical'],
        strengths: ['discipline', 'responsibility', 'ambition'],
        challenges: ['rigidity', 'pessimism', 'coldness']
      },
      'Aquarius': {
        element: 'Air',
        modality: 'Fixed',
        ruling_planet: 'Uranus',
        traits: ['innovative', 'independent', 'humanitarian', 'intellectual'],
        strengths: ['innovation', 'independence', 'humanitarianism'],
        challenges: ['detachment', 'rebellion', 'unpredictability']
      },
      'Pisces': {
        element: 'Water',
        modality: 'Mutable',
        ruling_planet: 'Neptune',
        traits: ['intuitive', 'compassionate', 'artistic', 'dreamy'],
        strengths: ['intuition', 'compassion', 'creativity'],
        challenges: ['escapism', 'confusion', 'victimhood']
      }
    };
    
    return characteristics[sign] || null;
  },
  
  /**
   * Get sign compatibility with another sign
   * @param {string} sign1 - First sign
   * @param {string} sign2 - Second sign
   * @returns {number} Compatibility score (0-100)
   */
  getSignCompatibility: function(sign1, sign2) {
    // Simplified compatibility matrix
    const compatibility = {
      'Aries-Aries': 75,
      'Aries-Taurus': 65,
      'Aries-Gemini': 80,
      'Aries-Cancer': 50,
      'Aries-Leo': 85,
      'Aries-Virgo': 60,
      'Aries-Libra': 70,
      'Aries-Scorpio': 60,
      'Aries-Sagittarius': 90,
      'Aries-Capricorn': 55,
      'Aries-Aquarius': 75,
      'Aries-Pisces': 45
    };
    
    const key1 = sign1 + '-' + sign2;
    const key2 = sign2 + '-' + sign1;
    
    return compatibility[key1] || compatibility[key2] || 50;
  },
  
  /**
   * Get sign ruling planet
   * @param {string} sign - Zodiac sign
   * @returns {string} Ruling planet
   */
  getRulingPlanet: function(sign) {
    const characteristics = this.getSignCharacteristics(sign);
    return characteristics ? characteristics.ruling_planet : null;
  },
  
  /**
   * Get sign element
   * @param {string} sign - Zodiac sign
   * @returns {string} Element
   */
  getElement: function(sign) {
    const characteristics = this.getSignCharacteristics(sign);
    return characteristics ? characteristics.element : null;
  },
  
  /**
   * Get sign modality
   * @param {string} sign - Zodiac sign
   * @returns {string} Modality
   */
  getModality: function(sign) {
    const characteristics = this.getSignCharacteristics(sign);
    return characteristics ? characteristics.modality : null;
  }
};

/**
 * Test sign interpreter
 */
function testSignInterpreter() {
  try {
    Logger.log('Aries characteristics: ' + JSON.stringify(SignInterpreter.getSignCharacteristics('Aries')));
    Logger.log('Aries-Leo compatibility: ' + SignInterpreter.getSignCompatibility('Aries', 'Leo'));
    Logger.log('Aries ruling planet: ' + SignInterpreter.getRulingPlanet('Aries'));
  } catch (error) {
    Logger.log("Erro em testSignInterpreter: " + error.message);
    throw error;
  }
}

