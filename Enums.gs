/**
 * Enums.gs
 * Enumeration definitions for Metateca
 */

const Enums = {
  // Sign Enums
  Signs: {
    ARIES: 'Aries',
    TAURUS: 'Taurus',
    GEMINI: 'Gemini',
    CANCER: 'Cancer',
    LEO: 'Leo',
    VIRGO: 'Virgo',
    LIBRA: 'Libra',
    SCORPIO: 'Scorpio',
    SAGITTARIUS: 'Sagittarius',
    CAPRICORN: 'Capricorn',
    AQUARIUS: 'Aquarius',
    PISCES: 'Pisces'
  },
  
  // Planet Enums
  Planets: {
    SUN: 'Sun',
    MOON: 'Moon',
    MERCURY: 'Mercury',
    VENUS: 'Venus',
    MARS: 'Mars',
    JUPITER: 'Jupiter',
    SATURN: 'Saturn',
    URANUS: 'Uranus',
    NEPTUNE: 'Neptune',
    PLUTO: 'Pluto'
  },
  
  // Element Enums
  Elements: {
    FIRE: 'Fire',
    EARTH: 'Earth',
    AIR: 'Air',
    WATER: 'Water'
  },
  
  // Modality Enums
  Modalities: {
    CARDINAL: 'Cardinal',
    FIXED: 'Fixed',
    MUTABLE: 'Mutable'
  },
  
  // House Enums (1-12)
  Houses: {
    FIRST: 1,
    SECOND: 2,
    THIRD: 3,
    FOURTH: 4,
    FIFTH: 5,
    SIXTH: 6,
    SEVENTH: 7,
    EIGHTH: 8,
    NINTH: 9,
    TENTH: 10,
    ELEVENTH: 11,
    TWELFTH: 12
  },
  
  // Aspect Enums
  Aspects: {
    CONJUNCTION: 'Conjunction',
    SEXTILE: 'Sextile',
    SQUARE: 'Square',
    TRINE: 'Trine',
    OPPOSITION: 'Opposition',
    QUINCUNX: 'Quincunx'
  },
  
  // Aspect Orbs (in degrees)
  AspectOrbs: {
    'Conjunction': 8,
    'Sextile': 6,
    'Square': 8,
    'Trine': 8,
    'Opposition': 8,
    'Quincunx': 3
  },
  
  // User Role Enums
  UserRoles: {
    ADMIN: 'admin',
    TEAM_LEAD: 'team_lead',
    MEMBER: 'member',
    VIEWER: 'viewer'
  },
  
  // Project Role Suggestions
  ProjectRoles: {
    PROJECT_MANAGER: 'Project Manager',
    DEVELOPER: 'Developer',
    DESIGNER: 'Designer',
    ANALYST: 'Analyst',
    COMMUNICATOR: 'Communicator',
    STRATEGIST: 'Strategist',
    EXECUTOR: 'Executor',
    MEDIATOR: 'Mediator'
  },
  
  // Productivity Levels
  ProductivityLevels: {
    VERY_LOW: 'Very Low',
    LOW: 'Low',
    MODERATE: 'Moderate',
    HIGH: 'High',
    VERY_HIGH: 'Very High'
  },
  
  // Compatibility Levels
  CompatibilityLevels: {
    VERY_LOW: 'Very Low',
    LOW: 'Low',
    MODERATE: 'Moderate',
    HIGH: 'High',
    VERY_HIGH: 'Very High'
  }
};

/**
 * Get an enum value safely
 * @param {string} enumType - The enum type (e.g., 'Signs', 'Planets')
 * @param {string} key - The enum key
 * @returns {*} The enum value or undefined
 */
function getEnum(enumType, key) {
  if (Enums[enumType]) {
    return Enums[enumType][key];
  }
  return undefined;
}

/**
 * Get all values of an enum
 * @param {string} enumType - The enum type
 * @returns {Array} Array of enum values
 */
function getEnumValues(enumType) {
  try {
    if (Enums[enumType]) {
      return Object.values(Enums[enumType]);
    }
    return [];
  } catch (error) {
    Logger.log("Erro em getEnumValues: " + error.message);
    throw error;
  }
}
