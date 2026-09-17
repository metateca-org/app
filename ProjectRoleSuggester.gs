/**
 * ProjectRoleSuggester.gs
 * Suggests project roles based on astrological profiles
 */

const ProjectRoleSuggester = {
  /**
   * Suggest roles for all team members
   * @returns {Object} Role suggestions for team
   */
  suggestRoles: function() {
    try {
      const members = PropertiesServiceHandler.getScriptProperty(Constants.MEMBERS_KEY, []);
      
      if (members.length === 0) {
        return { success: false, error: 'No team members found' };
      }
      
      const suggestions = [];
      
      for (let member of members) {
        const roles = this.suggestRolesForMember(member);
        suggestions.push({
          member: member.name,
          email: member.email,
          sunSign: member.sunSign,
          element: ElementMapper.getElement(member.sunSign),
          modality: ModalityMapper.getModality(member.sunSign),
          suggestedRoles: roles
        });
      }
      
      // Also suggest team composition
      const teamComposition = this.suggestTeamComposition(members);
      
      return {
        success: true,
        data: {
          individualSuggestions: suggestions,
          teamComposition: teamComposition,
          generatedAt: DateTimeUtils.getCurrentDateTime()
        }
      };
    } catch (error) {
      ErrorHandler.logError('ProjectRoleSuggester.suggestRoles', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Suggest roles for a specific member
   * @param {Object} member - Team member
   * @returns {Array} Suggested roles
   */
  suggestRolesForMember: function(member) {
    const element = ElementMapper.getElement(member.sunSign);
    const modality = ModalityMapper.getModality(member.sunSign);
    
    return ProductivityProfileGenerator.suggestRoles(element, modality);
  },
  
  /**
   * Suggest optimal team composition
   * @param {Array} members - Team members
   * @returns {Object} Team composition suggestion
   */
  suggestTeamComposition: function(members) {
    try {
      const composition = {
        currentTeam: {
          size: members.length,
          elementDistribution: ElementMapper.calculateTeamElementDistribution(members),
          modalityDistribution: ModalityMapper.calculateTeamModalityDistribution(members)
        },
        recommendations: []
      };
    
      // Analyze current composition
      const elementDist = composition.currentTeam.elementDistribution;
      const modalityDist = composition.currentTeam.modalityDistribution;
    
      // Recommend balancing elements
      if (elementDist.Fire === 0) {
        composition.recommendations.push({
          type: 'Element Balance',
          suggestion: 'Add Fire element members for dynamism and innovation',
          benefit: 'Increased energy and creative thinking'
        });
      }
    
      if (elementDist.Earth === 0) {
        composition.recommendations.push({
          type: 'Element Balance',
          suggestion: 'Add Earth element members for stability and organization',
          benefit: 'Better planning and execution'
        });
      }
    
      if (elementDist.Air === 0) {
        composition.recommendations.push({
          type: 'Element Balance',
          suggestion: 'Add Air element members for communication and analysis',
          benefit: 'Improved information flow and problem-solving'
        });
      }
    
      if (elementDist.Water === 0) {
        composition.recommendations.push({
          type: 'Element Balance',
          suggestion: 'Add Water element members for intuition and collaboration',
          benefit: 'Enhanced team cohesion and emotional intelligence'
        });
      }
    
      // Recommend balancing modalities
      if (modalityDist.Cardinal === 0) {
        composition.recommendations.push({
          type: 'Modality Balance',
          suggestion: 'Add Cardinal members for leadership and initiative',
          benefit: 'Better project initiation and direction'
        });
      }
    
      if (modalityDist.Fixed === 0) {
        composition.recommendations.push({
          type: 'Modality Balance',
          suggestion: 'Add Fixed members for stability and focus',
          benefit: 'Improved project completion and consistency'
        });
      }
    
      if (modalityDist.Mutable === 0) {
        composition.recommendations.push({
          type: 'Modality Balance',
          suggestion: 'Add Mutable members for flexibility and communication',
          benefit: 'Better adaptation and team coordination'
        });
      }
    
      return composition;
    } catch (error) {
      Logger.log("Erro em suggestTeamComposition: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get specific role recommendations
   * @param {string} projectType - Type of project
   * @returns {Object} Role recommendations for project
   */
  getProjectRoleRecommendations: function(projectType) {
    try {
      const recommendations = {
        'Development': {
          roles: ['Developer', 'Architect', 'Tester'],
          preferredElements: ['Air', 'Fire'],
          preferredModalities: ['Fixed', 'Cardinal'],
          description: 'Technical projects benefit from analytical (Air) and focused (Fixed) team members'
        },
        'Design': {
          roles: ['Designer', 'UX Specialist', 'Creative Lead'],
          preferredElements: ['Fire', 'Water'],
          preferredModalities: ['Mutable', 'Cardinal'],
          description: 'Creative projects benefit from innovative (Fire) and intuitive (Water) team members'
        },
        'Management': {
          roles: ['Project Manager', 'Team Lead', 'Coordinator'],
          preferredElements: ['Air', 'Earth'],
          preferredModalities: ['Cardinal', 'Fixed'],
          description: 'Management projects benefit from communicative (Air) and organized (Earth) team members'
        },
        'Sales': {
          roles: ['Sales Lead', 'Account Manager', 'Business Development'],
          preferredElements: ['Fire', 'Air'],
          preferredModalities: ['Cardinal', 'Mutable'],
          description: 'Sales projects benefit from dynamic (Fire) and communicative (Air) team members'
        },
        'Research': {
          roles: ['Researcher', 'Analyst', 'Data Specialist'],
          preferredElements: ['Air', 'Earth'],
          preferredModalities: ['Fixed', 'Mutable'],
          description: 'Research projects benefit from analytical (Air) and detail-oriented (Earth) team members'
        }
      };
      
      return recommendations[projectType] || null;
    } catch (error) {
      ErrorHandler.logError('ProjectRoleSuggester.getProjectRoleRecommendations', error);
      return null;
    }
  }
};

/**
 * Test project role suggester
 */
function testProjectRoleSuggester() {
  try {
    try {
      const result = ProjectRoleSuggester.suggestRoles();
      Logger.log('Role suggestions: ' + JSON.stringify(result));
  
      const devRoles = ProjectRoleSuggester.getProjectRoleRecommendations('Development');
      Logger.log('Development roles: ' + JSON.stringify(devRoles));
    } catch (error) {
      Logger.log("Erro em testProjectRoleSuggester: " + error.message);
      throw error;
    }
  } catch (error) {
    Logger.log("Erro em testProjectRoleSuggester: " + error.message);
    throw error;
  }
}
