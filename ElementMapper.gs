/**
 * ElementMapper.gs
 * Maps zodiac signs to astrological elements and their characteristics
 */

const ElementMapper = {
  /**
   * Get element for a zodiac sign
   * @param {string} sign - Zodiac sign name
   * @returns {string} Element name
   */
  getElement: function(sign) {
    for (let element in Constants.ELEMENTS) {
      if (Constants.ELEMENTS[element].includes(sign)) {
        return element;
      }
    }
    return null;
  },
  
  /**
   * Get all signs for an element
   * @param {string} element - Element name
   * @returns {Array} Array of signs
   */
  getSignsByElement: function(element) {
    return Constants.ELEMENTS[element] || [];
  },
  
  /**
   * Get element traits
   * @param {string} element - Element name
   * @returns {Object} Element traits object
   */
  getElementTraits: function(element) {
    return Constants.ELEMENT_TRAITS[element] || null;
  },
  
  /**
   * Get element name and description
   * @param {string} element - Element name
   * @returns {Object} Element information
   */
  getElementInfo: function(element) {
    const traits = this.getElementTraits(element);
    if (!traits) {
      return null;
    }
    
    return {
      name: element,
      fullName: traits.name,
      traits: traits.traits,
      productivity: traits.productivity,
      signs: this.getSignsByElement(element)
    };
  },
  
  /**
   * Get all elements with their information
   * @returns {Array} Array of element information
   */
  getAllElements: function() {
    try {
      const elements = [];
      for (let element in Constants.ELEMENTS) {
        elements.push(this.getElementInfo(element));
      }
      return elements;
    } catch (error) {
      Logger.log("Erro em getAllElements: " + error.message);
      throw error;
    }
  },
  
  /**
   * Calculate team element distribution
   * @param {Array} teamMembers - Array of team members with sunSign
   * @returns {Object} Element distribution
   */
  calculateTeamElementDistribution: function(teamMembers) {
    const distribution = {
      Fire: 0,
      Earth: 0,
      Air: 0,
      Water: 0,
      total: teamMembers.length
    };
    
    for (let member of teamMembers) {
      const element = this.getElement(member.sunSign);
      if (element && distribution.hasOwnProperty(element)) {
        distribution[element]++;
      }
    }
    
    // Calculate percentages
    distribution.firePercent = (distribution.Fire / distribution.total * 100).toFixed(1);
    distribution.earthPercent = (distribution.Earth / distribution.total * 100).toFixed(1);
    distribution.airPercent = (distribution.Air / distribution.total * 100).toFixed(1);
    distribution.waterPercent = (distribution.Water / distribution.total * 100).toFixed(1);
    
    return distribution;
  },
  
  /**
   * Get element compatibility score
   * @param {string} element1 - First element
   * @param {string} element2 - Second element
   * @returns {number} Compatibility score (0-100)
   */
  getElementCompatibility: function(element1, element2) {
    // Same element: very compatible
    if (element1 === element2) {
      return 90;
    }
    
    // Compatible elements (same modality or trines)
    const compatibility = {
      'Fire-Air': 85,
      'Fire-Water': 40,
      'Fire-Earth': 50,
      'Earth-Water': 75,
      'Earth-Air': 50,
      'Air-Water': 65
    };
    
    const key1 = element1 + '-' + element2;
    const key2 = element2 + '-' + element1;
    
    return compatibility[key1] || compatibility[key2] || 50;
  },
  
  /**
   * Get team element balance assessment
   * @param {Object} distribution - Element distribution from calculateTeamElementDistribution
   * @returns {Object} Assessment of team balance
   */
  assessTeamBalance: function(distribution) {
    const elements = ['Fire', 'Earth', 'Air', 'Water'];
    const percentages = [
      distribution.firePercent,
      distribution.earthPercent,
      distribution.airPercent,
      distribution.waterPercent
    ];
    
    const maxPercent = Math.max(...percentages);
    const minPercent = Math.min(...percentages);
    const balance = maxPercent - minPercent;
    
    let assessment = '';
    if (balance < 20) {
      assessment = 'Very balanced team with good elemental diversity';
    } else if (balance < 40) {
      assessment = 'Reasonably balanced team';
    } else if (balance < 60) {
      assessment = 'Some elemental imbalance; may need to consider team dynamics';
    } else {
      assessment = 'Significant elemental imbalance; team may lack certain perspectives';
    }
    
    return {
      balance: balance,
      assessment: assessment,
      maxElement: elements[percentages.indexOf(maxPercent)],
      minElement: elements[percentages.indexOf(minPercent)]
    };
  }
};

/**
 * Test element mapper
 */
function testElementMapper() {
  try {
    try {
      Logger.log('Element for Aries: ' + ElementMapper.getElement('Aries'));
      Logger.log('Fire signs: ' + JSON.stringify(ElementMapper.getSignsByElement('Fire')));
      Logger.log('Element info: ' + JSON.stringify(ElementMapper.getElementInfo('Fire')));
      Logger.log('Fire-Air compatibility: ' + ElementMapper.getElementCompatibility('Fire', 'Air'));
    } catch (error) {
      Logger.log("Erro em testElementMapper: " + error.message);
      throw error;
    }
  } catch (error) {
    Logger.log("Erro em testElementMapper: " + error.message);
    throw error;
  }
}
