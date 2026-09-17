/**
 * Localization.gs
 * Multi-language support for Metateca
 */

const Localization = {
  DEFAULT_LANGUAGE: 'pt-BR',
  
  TRANSLATIONS: {
    'pt-BR': {
      'app_name': 'Metateca',
      'dashboard': 'Painel de Controle',
      'team': 'Equipe',
      'members': 'Membros',
      'add_member': 'Adicionar Membro',
      'settings': 'Configurações',
      'profile': 'Perfil',
      'birth_date': 'Data de Nascimento',
      'birth_time': 'Hora de Nascimento',
      'birth_location': 'Local de Nascimento',
      'sun_sign': 'Signo Solar',
      'element': 'Elemento',
      'modality': 'Modalidade',
      'productivity': 'Produtividade',
      'compatibility': 'Compatibilidade',
      'communication': 'Comunicação',
      'conflict_resolution': 'Resolução de Conflitos',
      'save': 'Salvar',
      'cancel': 'Cancelar',
      'delete': 'Deletar',
      'edit': 'Editar',
      'search': 'Pesquisar',
      'loading': 'Carregando...',
      'error': 'Erro',
      'success': 'Sucesso',
      'warning': 'Aviso'
    },
    'en-US': {
      'app_name': 'Metateca',
      'dashboard': 'Dashboard',
      'team': 'Team',
      'members': 'Members',
      'add_member': 'Add Member',
      'settings': 'Settings',
      'profile': 'Profile',
      'birth_date': 'Birth Date',
      'birth_time': 'Birth Time',
      'birth_location': 'Birth Location',
      'sun_sign': 'Sun Sign',
      'element': 'Element',
      'modality': 'Modality',
      'productivity': 'Productivity',
      'compatibility': 'Compatibility',
      'communication': 'Communication',
      'conflict_resolution': 'Conflict Resolution',
      'save': 'Save',
      'cancel': 'Cancel',
      'delete': 'Delete',
      'edit': 'Edit',
      'search': 'Search',
      'loading': 'Loading...',
      'error': 'Error',
      'success': 'Success',
      'warning': 'Warning'
    },
    'es-ES': {
      'app_name': 'Sistema de Astrología y Productividad en Equipo',
      'dashboard': 'Panel de Control',
      'team': 'Equipo',
      'members': 'Miembros',
      'add_member': 'Agregar Miembro',
      'settings': 'Configuración',
      'profile': 'Perfil',
      'birth_date': 'Fecha de Nacimiento',
      'birth_time': 'Hora de Nacimiento',
      'birth_location': 'Lugar de Nacimiento',
      'sun_sign': 'Signo Solar',
      'element': 'Elemento',
      'modality': 'Modalidad',
      'productivity': 'Productividad',
      'compatibility': 'Compatibilidad',
      'communication': 'Comunicación',
      'conflict_resolution': 'Resolución de Conflictos',
      'save': 'Guardar',
      'cancel': 'Cancelar',
      'delete': 'Eliminar',
      'edit': 'Editar',
      'search': 'Buscar',
      'loading': 'Cargando...',
      'error': 'Error',
      'success': 'Éxito',
      'warning': 'Advertencia'
    }
  },
  
  /**
   * Get translated string
   * @param {string} key - Translation key
   * @param {string} language - Language code (default: pt-BR)
   * @returns {string} Translated string
   */
  t: function(key, language) {
    language = language || this.DEFAULT_LANGUAGE;
    
    if (this.TRANSLATIONS[language] && this.TRANSLATIONS[language][key]) {
      return this.TRANSLATIONS[language][key];
    }
    
    // Fallback to English
    if (this.TRANSLATIONS['en-US'] && this.TRANSLATIONS['en-US'][key]) {
      return this.TRANSLATIONS['en-US'][key];
    }
    
    // Return key if translation not found
    return key;
  },
  
  /**
   * Get all translations for a language
   * @param {string} language - Language code
   * @returns {Object} All translations
   */
  getLanguage: function(language) {
    return this.TRANSLATIONS[language] || this.TRANSLATIONS[this.DEFAULT_LANGUAGE];
  },
  
  /**
   * Get available languages
   * @returns {Array} Array of language codes
   */
  getAvailableLanguages: function() {
    try {
      return Object.keys(this.TRANSLATIONS);
    } catch (error) {
      Logger.log("Erro em getAvailableLanguages: " + error.message);
      throw error;
    }
  },
  
  /**
   * Add new language
   * @param {string} languageCode - Language code
   * @param {Object} translations - Translation object
   */
  addLanguage: function(languageCode, translations) {
    this.TRANSLATIONS[languageCode] = translations;
  },
  
  /**
   * Format date according to language
   * @param {Date} date - Date to format
   * @param {string} language - Language code
   * @returns {string} Formatted date
   */
  formatDate: function(date, language) {
    try {
      language = language || this.DEFAULT_LANGUAGE;
    
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString(language, options);
    } catch (error) {
      Logger.log("Erro em formatDate: " + error.message);
      throw error;
    }
  },
  
  /**
   * Format number according to language
   * @param {number} number - Number to format
   * @param {string} language - Language code
   * @returns {string} Formatted number
   */
  formatNumber: function(number, language) {
    try {
      language = language || this.DEFAULT_LANGUAGE;
    
      return number.toLocaleString(language);
    } catch (error) {
      Logger.log("Erro em formatNumber: " + error.message);
      throw error;
    }
  },
  
  /**
   * Format currency according to language
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code (e.g., 'USD', 'BRL')
   * @param {string} language - Language code
   * @returns {string} Formatted currency
   */
  formatCurrency: function(amount, currency, language) {
    try {
      language = language || this.DEFAULT_LANGUAGE;
    
      const options = { style: 'currency', currency: currency };
      return amount.toLocaleString(language, options);
    } catch (error) {
      Logger.log("Erro em formatCurrency: " + error.message);
      throw error;
    }
  }
};

/**
 * Test localization
 */
function testLocalization() {
  try {
    try {
      Logger.log('Portuguese: ' + Localization.t('app_name', 'pt-BR'));
      Logger.log('English: ' + Localization.t('app_name', 'en-US'));
      Logger.log('Spanish: ' + Localization.t('app_name', 'es-ES'));
      Logger.log('Available languages: ' + JSON.stringify(Localization.getAvailableLanguages()));
    } catch (error) {
      Logger.log("Erro em testLocalization: " + error.message);
      throw error;
    }
  } catch (error) {
    Logger.log("Erro em testLocalization: " + error.message);
    throw error;
  }
}

