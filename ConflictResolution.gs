/**
 * ConflictResolution.gs
 * Suggests conflict resolution approaches based on astrological profiles
 */

const ConflictResolution = {
  /**
   * Get conflict resolution approach for a team member
   * @param {string} memberId - Member ID or email
   * @returns {Object} Conflict resolution approach
   */
  getConflictApproach: function(memberId) {
    try {
      const memberResult = TeamMemberService.getMember(memberId);
      if (!memberResult.success) {
        return memberResult;
      }
      
      const member = memberResult.data;
      const element = ElementMapper.getElement(member.sunSign);
      const modality = ModalityMapper.getModality(member.sunSign);
      
      return {
        member: member.name,
        sunSign: member.sunSign,
        element: element,
        modality: modality,
        conflictStyle: this.getConflictStyle(element, modality),
        resolutionApproach: this.getResolutionApproach(element, modality),
        communicationDuringConflict: this.getCommunicationDuringConflict(element, modality),
        thingsToAvoid: this.getThingsToAvoid(element, modality),
        successFactors: this.getSuccessFactors(element, modality)
      };
    } catch (error) {
      ErrorHandler.logError('ConflictResolution.getConflictApproach', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Get conflict style
   * @param {string} element - Element name
   * @param {string} modality - Modality name
   * @returns {string} Conflict style
   */
  getConflictStyle: function(element, modality) {
    let style = '';
    
    if (element === 'Fire') {
      style = 'Direct, confrontational, quick to anger but quick to move on';
    } else if (element === 'Earth') {
      style = 'Methodical, logical, takes time to process, holds grudges';
    } else if (element === 'Air') {
      style = 'Intellectual, detached, prefers discussion over emotion';
    } else if (element === 'Water') {
      style = 'Emotional, sensitive, avoids confrontation, internalizes';
    }
    
    return style;
  },
  
  /**
   * Get resolution approach
   * @param {string} element - Element name
   * @param {string} modality - Modality name
   * @returns {string} Resolution approach
   */
  getResolutionApproach: function(element, modality) {
    let approach = '';
    
    if (element === 'Fire') {
      approach = 'Address quickly and directly. Give them space to express their passion. Move to action-oriented solutions.';
    } else if (element === 'Earth') {
      approach = 'Present facts and logic. Allow time for consideration. Provide written documentation of agreements.';
    } else if (element === 'Air') {
      approach = 'Use rational discussion. Present multiple perspectives. Avoid emotional appeals.';
    } else if (element === 'Water') {
      approach = 'Acknowledge feelings first. Create safe space for discussion. Show empathy and understanding.';
    }
    
    return approach;
  },
  
  /**
   * Get communication during conflict
   * @param {string} element - Element name
   * @param {string} modality - Modality name
   * @returns {Array} Communication tips
   */
  getCommunicationDuringConflict: function(element, modality) {
    try {
      const tips = [];
    
      if (element === 'Fire') {
        tips.push('Be direct and honest',
                  'Don\'t back down or show weakness',
                  'Focus on solutions, not blame',
                  'Keep energy level high');
      } else if (element === 'Earth') {
        tips.push('Be clear and specific',
                  'Use facts and evidence',
                  'Give them time to respond',
                  'Document everything');
      } else if (element === 'Air') {
        tips.push('Use logic and reasoning',
                  'Explain your perspective clearly',
                  'Listen to their viewpoint',
                  'Find common ground intellectually');
      } else if (element === 'Water') {
        tips.push('Validate their emotions',
                  'Use gentle, compassionate language',
                  'Show you understand their feelings',
                  'Create emotional safety');
      }
    
      return tips;
    } catch (error) {
      Logger.log("Erro em getCommunicationDuringConflict: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get things to avoid
   * @param {string} element - Element name
   * @param {string} modality - Modality name
   * @returns {Array} Things to avoid
   */
  getThingsToAvoid: function(element, modality) {
    try {
      const avoid = [];
    
      if (element === 'Fire') {
        avoid.push('Passive-aggressive behavior',
                   'Backing them into a corner',
                   'Showing fear or hesitation',
                   'Lengthy explanations');
      } else if (element === 'Earth') {
        avoid.push('Emotional outbursts',
                   'Vague or unclear communication',
                   'Rushing them to decide',
                   'Sudden changes to agreements');
      } else if (element === 'Air') {
        avoid.push('Emotional appeals',
                   'Oversimplification',
                   'Forcing quick decisions',
                   'Ignoring their perspective');
      } else if (element === 'Water') {
        avoid.push('Harsh criticism',
                   'Dismissing their feelings',
                   'Public confrontation',
                   'Coldness or detachment');
      }
    
      return avoid;
    } catch (error) {
      Logger.log("Erro em getThingsToAvoid: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get success factors
   * @param {string} element - Element name
   * @param {string} modality - Modality name
   * @returns {Array} Success factors
   */
  getSuccessFactors: function(element, modality) {
    try {
      const factors = [];
    
      if (element === 'Fire') {
        factors.push('Quick resolution',
                     'Respect for their position',
                     'Clear action steps',
                     'Recognition of their courage');
      } else if (element === 'Earth') {
        factors.push('Thorough discussion',
                     'Logical arguments',
                     'Written agreement',
                     'Respect for their process');
      } else if (element === 'Air') {
        factors.push('Intellectual discussion',
                     'Multiple perspectives',
                     'Logical solution',
                     'Respect for their analysis');
      } else if (element === 'Water') {
        factors.push('Emotional acknowledgment',
                     'Compassionate approach',
                     'Private discussion',
                     'Relationship preservation');
      }
    
      return factors;
    } catch (error) {
      Logger.log("Erro em getSuccessFactors: " + error.message);
      throw error;
    }
  },
  
  /**
   * Suggest mediation approach for team conflict
   * @param {string} member1Id - First member ID
   * @param {string} member2Id - Second member ID
   * @returns {Object} Mediation suggestions
   */
  suggestMediationApproach: function(member1Id, member2Id) {
    try {
      const member1Result = TeamMemberService.getMember(member1Id);
      const member2Result = TeamMemberService.getMember(member2Id);
      
      if (!member1Result.success || !member2Result.success) {
        return { success: false, error: 'Members not found' };
      }
      
      const member1 = member1Result.data;
      const member2 = member2Result.data;
      
      const element1 = ElementMapper.getElement(member1.sunSign);
      const element2 = ElementMapper.getElement(member2.sunSign);
      
      const compatibility = ElementMapper.getElementCompatibility(element1, element2);
      
      return {
        member1: member1.name,
        member2: member2.name,
        compatibility: compatibility,
        approach: this.getMediationApproach(element1, element2),
        neutralGround: this.getNeutralGround(element1, element2),
        mediatorTraits: this.getMediatorTraits(element1, element2)
      };
    } catch (error) {
      ErrorHandler.logError('ConflictResolution.suggestMediationApproach', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Get mediation approach
   * @param {string} element1 - First element
   * @param {string} element2 - Second element
   * @returns {string} Mediation approach
   */
  getMediationApproach: function(element1, element2) {
    if ((element1 === 'Fire' && element2 === 'Water') || (element1 === 'Water' && element2 === 'Fire')) {
      return 'Balance passion with compassion. Find middle ground between action and emotion.';
    } else if ((element1 === 'Fire' && element2 === 'Earth') || (element1 === 'Earth' && element2 === 'Fire')) {
      return 'Balance enthusiasm with practicality. Find practical ways to implement ideas.';
    } else if ((element1 === 'Air' && element2 === 'Water') || (element1 === 'Water' && element2 === 'Air')) {
      return 'Balance logic with emotion. Acknowledge both perspectives as valid.';
    } else {
      return 'Find common ground through mutual respect and understanding.';
    }
  },
  
  /**
   * Get neutral ground
   * @param {string} element1 - First element
   * @param {string} element2 - Second element
   * @returns {string} Neutral ground suggestion
   */
  getNeutralGround: function(element1, element2) {
    return 'A calm, professional environment where both parties feel heard and respected.';
  },
  
  /**
   * Get mediator traits
   * @param {string} element1 - First element
   * @param {string} element2 - Second element
   * @returns {Array} Ideal mediator traits
   */
  getMediatorTraits: function(element1, element2) {
    return [
      'Neutral and impartial',
      'Good listener',
      'Patient and calm',
      'Respectful of both perspectives',
      'Able to find common ground'
    ];
  }
};

/**
 * Test conflict resolution
 */
function testConflictResolution() {
  try {
    // Add test members
    const member1 = {
      name: 'Alice',
      email: 'alice@example.com',
      birthDate: '1990-03-21',
      birthTime: '10:00:00',
      birthLocation: 'New York, USA',
      latitude: 40.7128,
      longitude: -74.0060
    };
  
    TeamMemberService.addMember(member1);
  
    const approach = ConflictResolution.getConflictApproach('alice@example.com');
    Logger.log('Conflict approach: ' + JSON.stringify(approach));
  } catch (error) {
    Logger.log("Erro em testConflictResolution: " + error.message);
    throw error;
  }
}

