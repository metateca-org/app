/**
 * TeamDynamicsAnalyzer.gs
 * Analyzes team dynamics based on astrological profiles
 */

const TeamDynamicsAnalyzer = {
  /**
   * Analyze the team
   * @returns {Object} Team analysis
   */
  analyzeTeam: function() {
    try {
      const members = PropertiesServiceHandler.getScriptProperty(Constants.MEMBERS_KEY, []);
      
      if (members.length === 0) {
        return { success: false, error: 'No team members found' };
      }
      
      // Calculate element distribution
      const elementDistribution = ElementMapper.calculateTeamElementDistribution(members);
      const elementBalance = ElementMapper.assessTeamBalance(elementDistribution);
      
      // Calculate modality distribution
      const modalityDistribution = ModalityMapper.calculateTeamModalityDistribution(members);
      const modalityBalance = ModalityMapper.assessTeamModalityBalance(modalityDistribution);
      
      // Calculate average compatibility
      const compatibilityAnalysis = this.analyzeCompatibility(members);
      
      const analysis = {
        teamSize: members.length,
        elementDistribution: elementDistribution,
        elementBalance: elementBalance,
        modalityDistribution: modalityDistribution,
        modalityBalance: modalityBalance,
        compatibility: compatibilityAnalysis,
        overallAssessment: this.getOverallAssessment(elementBalance, modalityBalance, compatibilityAnalysis),
        generatedAt: DateTimeUtils.getCurrentDateTime()
      };
      
      return { success: true, data: analysis };
    } catch (error) {
      ErrorHandler.logError('TeamDynamicsAnalyzer.analyzeTeam', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Analyze compatibility between team members
   * @param {Array} members - Team members
   * @returns {Object} Compatibility analysis
   */
  analyzeCompatibility: function(members) {
    try {
      try {
        let totalCompatibility = 0;
        let pairCount = 0;
        const compatibilityPairs = [];
      
        for (let i = 0; i < members.length; i++) {
          for (let j = i + 1; j < members.length; j++) {
            const member1 = members[i];
            const member2 = members[j];
          
            const element1 = ElementMapper.getElement(member1.sunSign);
            const element2 = ElementMapper.getElement(member2.sunSign);
          
            const compatibility = ElementMapper.getElementCompatibility(element1, element2);
          
            totalCompatibility += compatibility;
            pairCount++;
          
            compatibilityPairs.push({
              member1: member1.name,
              member2: member2.name,
              element1: element1,
              element2: element2,
              compatibility: compatibility
            });
          }
        }
      
        const averageCompatibility = pairCount > 0 ? (totalCompatibility / pairCount).toFixed(1) : 0;
      
        return {
          averageCompatibility: averageCompatibility,
          pairCount: pairCount,
          pairs: compatibilityPairs.sort((a, b) => b.compatibility - a.compatibility)
        };
      } catch (error) {
        ErrorHandler.logError('TeamDynamicsAnalyzer.analyzeCompatibility', error);
        return { error: error.message };
      }
    } catch (error) {
      Logger.log("Erro em analyzeCompatibility: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get overall team assessment
   * @param {Object} elementBalance - Element balance analysis
   * @param {Object} modalityBalance - Modality balance analysis
   * @param {Object} compatibility - Compatibility analysis
   * @returns {string} Overall assessment
   */
  getOverallAssessment: function(elementBalance, modalityBalance, compatibility) {
    try {
      let assessment = '';
    
      // Element assessment
      if (elementBalance.balance < 20) {
        assessment += 'Excellent elemental diversity. ';
      } else if (elementBalance.balance < 40) {
        assessment += 'Good elemental diversity. ';
      } else {
        assessment += 'Limited elemental diversity - consider adding members with ' + elementBalance.minElement + ' element. ';
      }
    
      // Modality assessment
      if (modalityBalance.balance < 15) {
        assessment += 'Excellent modality balance. ';
      } else if (modalityBalance.balance < 30) {
        assessment += 'Good modality balance. ';
      } else {
        assessment += 'Modality imbalance - ' + modalityBalance.recommendation + ' ';
      }
    
      // Compatibility assessment
      const avgCompat = parseFloat(compatibility.averageCompatibility);
      if (avgCompat >= 80) {
        assessment += 'Excellent team compatibility.';
      } else if (avgCompat >= 70) {
        assessment += 'Good team compatibility.';
      } else if (avgCompat >= 60) {
        assessment += 'Moderate team compatibility - focus on communication.';
      } else {
        assessment += 'Low team compatibility - implement team-building activities.';
      }
    
      return assessment;
    } catch (error) {
      Logger.log("Erro em getOverallAssessment: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get team recommendations
   * @returns {Object} Team recommendations
   */
  getTeamRecommendations: function() {
    try {
      try {
        const analysisResult = this.analyzeTeam();
        if (!analysisResult.success) {
          return analysisResult;
        }
      
        const analysis = analysisResult.data;
        const recommendations = [];
      
        // Element-based recommendations
        if (analysis.elementBalance.balance > 40) {
          recommendations.push({
            type: 'Element Balance',
            priority: 'High',
            recommendation: 'Team lacks ' + analysis.elementBalance.minElement + ' element perspective. Consider recruiting members with this element.',
            impact: 'Improved team perspective and decision-making'
          });
        }
      
        // Modality-based recommendations
        if (analysis.modalityBalance.balance > 30) {
          recommendations.push({
            type: 'Modality Balance',
            priority: 'Medium',
            recommendation: analysis.modalityBalance.recommendation,
            impact: 'Better project execution and team dynamics'
          });
        }
      
        // Compatibility-based recommendations
        const avgCompat = parseFloat(analysis.compatibility.averageCompatibility);
        if (avgCompat < 70) {
          recommendations.push({
            type: 'Team Compatibility',
            priority: 'High',
            recommendation: 'Implement team-building activities to improve collaboration.',
            impact: 'Enhanced team cohesion and productivity'
          });
        }
      
        return { success: true, data: recommendations };
      } catch (error) {
        ErrorHandler.logError('TeamDynamicsAnalyzer.getTeamRecommendations', error);
        return { success: false, error: error.message };
      }
    } catch (error) {
      Logger.log("Erro em getTeamRecommendations: " + error.message);
      throw error;
    }
  },

  /**
   * Qualitative label (PT-BR) for a 0-100 compatibility score.
   * @param {number} score
   * @returns {string}
   */
  compatibilityAssessment: function(score) {
    try {
      const n = Number(score) || 0;
      if (n >= 80) return 'Excelente compatibilidade';
      if (n >= 70) return 'Boa compatibilidade';
      if (n >= 60) return 'Compatibilidade moderada — foco em comunicação';
      return 'Compatibilidade baixa — invista em alinhamento';
    } catch (error) {
      Logger.log("Erro em compatibilityAssessment: " + error.message);
      throw error;
    }
  },

  /**
   * Compare two members: element/modality/sign compatibility + overall score.
   * Backed by ElementMapper / ModalityMapper / SignInterpreter.
   * @param {string} idA - First member email or name
   * @param {string} idB - Second member email or name
   * @returns {Object} { success, data }
   */
  comparePair: function(idA, idB) {
    try {
      const a = TeamMemberService.getMember(idA);
      if (!a.success) { return a; }
      const b = TeamMemberService.getMember(idB);
      if (!b.success) { return b; }

      const m1 = a.data, m2 = b.data;
      const e1 = ElementMapper.getElement(m1.sunSign);
      const e2 = ElementMapper.getElement(m2.sunSign);
      const mo1 = ModalityMapper.getModality(m1.sunSign);
      const mo2 = ModalityMapper.getModality(m2.sunSign);

      const elementScore = ElementMapper.getElementCompatibility(e1, e2);
      const modalityScore = ModalityMapper.getModalityCompatibility(mo1, mo2);
      const signScore = SignInterpreter.getSignCompatibility(m1.sunSign, m2.sunSign);
      const overall = Math.round((Number(elementScore) + Number(modalityScore) + Number(signScore)) / 3);

      return {
        success: true,
        data: {
          memberA: { name: m1.name, email: m1.email, sunSign: m1.sunSign, element: e1, modality: mo1 },
          memberB: { name: m2.name, email: m2.email, sunSign: m2.sunSign, element: e2, modality: mo2 },
          elementScore: elementScore,
          modalityScore: modalityScore,
          signScore: signScore,
          overall: overall,
          assessment: this.compatibilityAssessment(overall),
          sameElement: e1 === e2,
          sameModality: mo1 === mo2
        }
      };
    } catch (error) {
      ErrorHandler.logError('TeamDynamicsAnalyzer.comparePair', error);
      return { success: false, error: error.message };
    }
  }
};

/**
 * Test team dynamics analyzer
 */
function testTeamDynamicsAnalyzer() {
  try {
    try {
      // Add some test members
      const members = [
        {
          name: 'Alice',
          email: 'alice@example.com',
          birthDate: '1990-03-21',
          birthTime: '10:00:00',
          birthLocation: 'New York, USA',
          latitude: 40.7128,
          longitude: -74.0060,
          sunSign: 'Aries',
          age: 34
        },
        {
          name: 'Bob',
          email: 'bob@example.com',
          birthDate: '1992-05-15',
          birthTime: '14:30:00',
          birthLocation: 'Los Angeles, USA',
          latitude: 34.0522,
          longitude: -118.2437,
          sunSign: 'Taurus',
          age: 32
        }
      ];
  
      PropertiesServiceHandler.saveScriptProperty(Constants.MEMBERS_KEY, members);
  
      const result = TeamDynamicsAnalyzer.analyzeTeam();
      Logger.log('Team analysis: ' + JSON.stringify(result));
    } catch (error) {
      Logger.log("Erro em testTeamDynamicsAnalyzer: " + error.message);
      throw error;
    }
  } catch (error) {
    Logger.log("Erro em testTeamDynamicsAnalyzer: " + error.message);
    throw error;
  }
}
