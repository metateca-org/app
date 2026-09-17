/**
 * HouseInterpreter.gs
 * Interprets astrological houses and their meanings
 */

const HouseInterpreter = {
  /**
   * Get house meaning and interpretation
   * @param {number} house - House number (1-12)
   * @returns {Object} House interpretation
   */
  getHouseInterpretation: function(house) {
    const interpretations = {
      1: {
        name: 'First House',
        meaning: 'Self, appearance, personality, first impressions',
        keywords: ['identity', 'appearance', 'personality', 'beginnings'],
        ruling_planet: 'Mars',
        life_area: 'How you present yourself to the world'
      },
      2: {
        name: 'Second House',
        meaning: 'Finances, possessions, values, self-worth',
        keywords: ['money', 'possessions', 'values', 'security'],
        ruling_planet: 'Venus',
        life_area: 'Material resources and personal values'
      },
      3: {
        name: 'Third House',
        meaning: 'Communication, siblings, short journeys, learning',
        keywords: ['communication', 'learning', 'siblings', 'travel'],
        ruling_planet: 'Mercury',
        life_area: 'How you think and communicate'
      },
      4: {
        name: 'Fourth House',
        meaning: 'Home, family, roots, foundation, private life',
        keywords: ['home', 'family', 'roots', 'foundation'],
        ruling_planet: 'Moon',
        life_area: 'Your private life and family foundation'
      },
      5: {
        name: 'Fifth House',
        meaning: 'Creativity, romance, children, self-expression, pleasure',
        keywords: ['creativity', 'romance', 'children', 'pleasure'],
        ruling_planet: 'Sun',
        life_area: 'Creative expression and romantic relationships'
      },
      6: {
        name: 'Sixth House',
        meaning: 'Work, health, daily routines, service, habits',
        keywords: ['work', 'health', 'routines', 'service'],
        ruling_planet: 'Mercury',
        life_area: 'Your work and health practices'
      },
      7: {
        name: 'Seventh House',
        meaning: 'Relationships, partnerships, marriage, open enemies',
        keywords: ['relationships', 'partnerships', 'marriage', 'contracts'],
        ruling_planet: 'Venus',
        life_area: 'Your relationships and partnerships'
      },
      8: {
        name: 'Eighth House',
        meaning: 'Transformation, shared resources, sexuality, death/rebirth',
        keywords: ['transformation', 'shared resources', 'sexuality', 'inheritance'],
        ruling_planet: 'Pluto',
        life_area: 'Transformation and shared resources'
      },
      9: {
        name: 'Ninth House',
        meaning: 'Higher learning, travel, philosophy, spirituality, publishing',
        keywords: ['learning', 'travel', 'philosophy', 'spirituality'],
        ruling_planet: 'Jupiter',
        life_area: 'Your beliefs and higher learning'
      },
      10: {
        name: 'Tenth House',
        meaning: 'Career, public image, reputation, authority, achievement',
        keywords: ['career', 'reputation', 'public image', 'achievement'],
        ruling_planet: 'Saturn',
        life_area: 'Your career and public reputation'
      },
      11: {
        name: 'Eleventh House',
        meaning: 'Friendships, groups, hopes, dreams, community',
        keywords: ['friendships', 'groups', 'hopes', 'community'],
        ruling_planet: 'Uranus',
        life_area: 'Your friendships and social groups'
      },
      12: {
        name: 'Twelfth House',
        meaning: 'Spirituality, hidden matters, subconscious, endings, karma',
        keywords: ['spirituality', 'hidden', 'subconscious', 'karma'],
        ruling_planet: 'Neptune',
        life_area: 'Your spirituality and hidden aspects'
      }
    };
    
    return interpretations[house] || null;
  },
  
  /**
   * Get house axis meaning
   * @param {number} house - House number
   * @returns {string} Axis meaning
   */
  getHouseAxisMeaning: function(house) {
    const axes = {
      '1-7': 'Self vs. Others - Personal identity vs. relationships',
      '4-10': 'Private vs. Public - Home life vs. career',
      '2-8': 'Personal vs. Shared - Individual resources vs. joint resources',
      '3-9': 'Near vs. Far - Local communication vs. distant travel'
    };
    
    if (house <= 3) {
      return axes['1-7'];
    } else if (house <= 6) {
      return axes['4-10'];
    } else if (house <= 9) {
      return axes['2-8'];
    } else {
      return axes['3-9'];
    }
  },
  
  /**
   * Get house quadrant meaning
   * @param {number} house - House number
   * @returns {string} Quadrant meaning
   */
  getHouseQuadrantMeaning: function(house) {
    const quadrants = {
      'first': 'Personal development and self-awareness (Houses 1-3)',
      'second': 'Establishing roots and security (Houses 4-6)',
      'third': 'Relating to others and sharing (Houses 7-9)',
      'fourth': 'Transcendence and spirituality (Houses 10-12)'
    };
    
    if (house <= 3) {
      return quadrants.first;
    } else if (house <= 6) {
      return quadrants.second;
    } else if (house <= 9) {
      return quadrants.third;
    } else {
      return quadrants.fourth;
    }
  },
  
  /**
   * Get angular, succedent, or cadent house type
   * @param {number} house - House number
   * @returns {string} House type
   */
  getHouseType: function(house) {
    const angular = [1, 4, 7, 10];
    const succedent = [2, 5, 8, 11];
    const cadent = [3, 6, 9, 12];
    
    if (angular.includes(house)) {
      return 'Angular - Strong, action-oriented, direct influence';
    } else if (succedent.includes(house)) {
      return 'Succedent - Stable, consolidating, resource-building';
    } else if (cadent.includes(house)) {
      return 'Cadent - Flexible, communicative, transitional';
    }
    
    return 'Unknown';
  }
};

/**
 * Test house interpreter
 */
function testHouseInterpreter() {
  try {
    Logger.log('First House: ' + JSON.stringify(HouseInterpreter.getHouseInterpretation(1)));
    Logger.log('House 1-7 axis: ' + HouseInterpreter.getHouseAxisMeaning(1));
    Logger.log('House 1 type: ' + HouseInterpreter.getHouseType(1));
  } catch (error) {
    Logger.log("Erro em testHouseInterpreter: " + error.message);
    throw error;
  }
}

