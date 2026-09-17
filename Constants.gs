/**
 * Constants.gs
 * Global constants for Metateca
 */

const Constants = {
  // Application Information
  APP_NAME: 'Metateca',
  APP_VERSION: '1.0.0',
  
  // API Configuration
  API_TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,
  
  // Astrology Constants
  ZODIAC_SIGNS: [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ],
  
  PLANETS: [
    'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter',
    'Saturn', 'Uranus', 'Neptune', 'Pluto'
  ],
  
  ELEMENTS: {
    'Fire': ['Aries', 'Leo', 'Sagittarius'],
    'Earth': ['Taurus', 'Virgo', 'Capricorn'],
    'Air': ['Gemini', 'Libra', 'Aquarius'],
    'Water': ['Cancer', 'Scorpio', 'Pisces']
  },
  
  MODALITIES: {
    'Cardinal': ['Aries', 'Cancer', 'Libra', 'Capricorn'],
    'Fixed': ['Taurus', 'Leo', 'Scorpio', 'Aquarius'],
    'Mutable': ['Gemini', 'Virgo', 'Sagittarius', 'Pisces']
  },
  
  // Productivity Traits by Element
  ELEMENT_TRAITS: {
    'Fire': {
      name: 'Dinamismo e Paixão',
      traits: ['energético', 'entusiasmado', 'criativo', 'impulsivo', 'liderança'],
      productivity: 'Alta energia, excelente para projetos de curto prazo com alta visibilidade'
    },
    'Earth': {
      name: 'Pragmatismo e Estabilidade',
      traits: ['prático', 'confiável', 'meticuloso', 'organizado', 'responsável'],
      productivity: 'Excelente para planejamento detalhado e execução sistemática'
    },
    'Air': {
      name: 'Comunicação e Sociabilidade',
      traits: ['comunicativo', 'intelectual', 'adaptável', 'social', 'analítico'],
      productivity: 'Ideal para coordenação, comunicação e resolução de problemas'
    },
    'Water': {
      name: 'Intuição e Sensibilidade Emocional',
      traits: ['intuitivo', 'empático', 'sensível', 'criativo', 'compassivo'],
      productivity: 'Excelente para trabalho colaborativo e compreensão de dinâmicas emocionais'
    }
  },
  
  // Storage Keys
  STORAGE_PREFIX: 'astro_',
  MEMBERS_KEY: 'astro_team_members',
  PROFILES_KEY: 'astro_profiles',
  TEAM_DYNAMICS_KEY: 'astro_team_dynamics',
  
  // Cache Duration (in seconds)
  CACHE_DURATION: 3600, // 1 hour
  
  // Execution Limits
  MAX_EXECUTION_TIME: 360000, // 6 minutes in milliseconds
  
  // HTTP Methods
  HTTP_GET: 'get',
  HTTP_POST: 'post',
  
  // Response Codes
  SUCCESS: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

/**
 * Get a constant value safely
 * @param {string} key - The constant key
 * @returns {*} The constant value or undefined
 */
function getConstant(key) {
  return Constants[key];
}
