/**
 * HtmlTemplateService.gs
 * Service for rendering HTML templates
 */

const HtmlTemplateService = {
  /**
   * Render a template with data
   * @param {string} templateName - Name of the template
   * @param {Object} data - Data to pass to template
   * @returns {string} Rendered HTML
   */
  render: function(templateName, data) {
    try {
      const template = this.getTemplate(templateName);
      if (!template) {
        return '<p>Template not found: ' + templateName + '</p>';
      }
      
      return this.interpolate(template, data);
    } catch (error) {
      ErrorHandler.logError('HtmlTemplateService.render', error);
      return '<p>Error rendering template: ' + error.message + '</p>';
    }
  },
  
  /**
   * Get template by name
   * @param {string} templateName - Template name
   * @returns {string} Template HTML
   */
  getTemplate: function(templateName) {
    const templates = {
      'member-card': `
        <div class="member-card">
          <h3>{{name}}</h3>
          <p><strong>Email:</strong> {{email}}</p>
          <p><strong>Sun Sign:</strong> {{sunSign}}</p>
          <p><strong>Element:</strong> {{element}}</p>
          <p><strong>Modality:</strong> {{modality}}</p>
          <p><strong>Age:</strong> {{age}}</p>
        </div>
      `,
      'productivity-profile': `
        <div class="productivity-profile">
          <h2>{{name}}'s Productivity Profile</h2>
          <p><strong>Element:</strong> {{elementName}}</p>
          <p><strong>Traits:</strong> {{elementTraits}}</p>
          <p><strong>Productivity:</strong> {{elementProductivity}}</p>
          <p><strong>Suggested Roles:</strong> {{suggestedRoles}}</p>
        </div>
      `,
      'team-stats': `
        <div class="team-stats">
          <h2>Team Statistics</h2>
          <p><strong>Team Size:</strong> {{teamSize}}</p>
          <p><strong>Element Distribution:</strong></p>
          <ul>
            <li>Fire: {{fireCount}} ({{firePercent}}%)</li>
            <li>Earth: {{earthCount}} ({{earthPercent}}%)</li>
            <li>Air: {{airCount}} ({{airPercent}}%)</li>
            <li>Water: {{waterCount}} ({{waterPercent}}%)</li>
          </ul>
        </div>
      `,
      'communication-tips': `
        <div class="communication-tips">
          <h2>Communication Tips for {{name}}</h2>
          <p><strong>Communication Style:</strong> {{communicationStyle}}</p>
          <p><strong>How to Communicate:</strong></p>
          <ul>{{howToCommunicate}}</ul>
          <p><strong>Feedback Preferences:</strong> {{feedbackPreferences}}</p>
        </div>
      `
    };
    
    return templates[templateName] || null;
  },
  
  /**
   * Interpolate template with data
   * @param {string} template - Template string
   * @param {Object} data - Data object
   * @returns {string} Interpolated string
   */
  interpolate: function(template, data) {
    try {
      let result = template;
    
      for (let key in data) {
        const value = data[key];
        const placeholder = '{{' + key + '}}';
      
        let replacementValue = '';
        if (Array.isArray(value)) {
          replacementValue = value.map(v => '<li>' + v + '</li>').join('');
        } else if (typeof value === 'object') {
          replacementValue = JSON.stringify(value);
        } else {
          replacementValue = String(value);
        }
      
        result = result.split(placeholder).join(replacementValue);
      }
    
      return result;
    } catch (error) {
      Logger.log("Erro em interpolate: " + error.message);
      throw error;
    }
  },
  
  /**
   * Register a custom template
   * @param {string} name - Template name
   * @param {string} template - Template HTML
   */
  registerTemplate: function(name, template) {
    // This would need to be stored in properties or a database
    const customTemplates = PropertiesServiceHandler.getScriptProperty('custom_templates', {});
    customTemplates[name] = template;
    PropertiesServiceHandler.saveScriptProperty('custom_templates', customTemplates);
  }
};

/**
 * Test HTML template service
 */
function testHtmlTemplateService() {
  const memberData = {
    name: 'John Doe',
    email: 'john@example.com',
    sunSign: 'Aries',
    element: 'Fire',
    modality: 'Cardinal',
    age: 34
  };
  
  const html = HtmlTemplateService.render('member-card', memberData);
  Logger.log('Rendered template: ' + html);
}

