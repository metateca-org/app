/**
 * DateTimeUtils.gs
 * Date and time utilities for Metateca
 */

const DateTimeUtils = {
  /**
   * Parse a date string in YYYY-MM-DD format
   * @param {string} dateString - The date string
   * @returns {Date} The parsed date
   */
  parseDate: function(dateString) {
    return new Date(dateString);
  },
  
  /**
   * Parse a time string in HH:MM:SS format
   * @param {string} timeString - The time string
   * @returns {Object} Object with hours, minutes, seconds
   */
  parseTime: function(timeString) {
    try {
      const parts = timeString.split(':');
      return {
        hours: parseInt(parts[0], 10),
        minutes: parseInt(parts[1], 10),
        seconds: parseInt(parts[2], 10)
      };
    } catch (error) {
      Logger.log("Erro em parseTime: " + error.message);
      throw error;
    }
  },
  
  /**
   * Format a date as YYYY-MM-DD
   * @param {Date} date - The date to format
   * @returns {string} Formatted date string
   */
  formatDate: function(date) {
    try {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      Logger.log("Erro em formatDate: " + error.message);
      throw error;
    }
  },
  
  /**
   * Format a time as HH:MM:SS
   * @param {Date} date - The date/time to format
   * @returns {string} Formatted time string
   */
  formatTime: function(date) {
    try {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    } catch (error) {
      Logger.log("Erro em formatTime: " + error.message);
      throw error;
    }
  },
  
  /**
   * Get age from birth date
   * @param {string} birthDateString - Birth date in YYYY-MM-DD format
   * @returns {number} Age in years
   */
  getAge: function(birthDateString) {
    const birthDate = this.parseDate(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  },
  
  /**
   * Get zodiac sign from birth date
   * @param {string} birthDateString - Birth date in YYYY-MM-DD format
   * @returns {string} Zodiac sign name
   */
  getZodiacSignFromDate: function(birthDateString) {
    const date = this.parseDate(birthDateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const zodiacSigns = [
      { name: 'Capricorn', start: [12, 22], end: [1, 19] },
      { name: 'Aquarius', start: [1, 20], end: [2, 18] },
      { name: 'Pisces', start: [2, 19], end: [3, 20] },
      { name: 'Aries', start: [3, 21], end: [4, 19] },
      { name: 'Taurus', start: [4, 20], end: [5, 20] },
      { name: 'Gemini', start: [5, 21], end: [6, 20] },
      { name: 'Cancer', start: [6, 21], end: [7, 22] },
      { name: 'Leo', start: [7, 23], end: [8, 22] },
      { name: 'Virgo', start: [8, 23], end: [9, 22] },
      { name: 'Libra', start: [9, 23], end: [10, 22] },
      { name: 'Scorpio', start: [10, 23], end: [11, 21] },
      { name: 'Sagittarius', start: [11, 22], end: [12, 21] }
    ];
    
    for (let sign of zodiacSigns) {
      const [startMonth, startDay] = sign.start;
      const [endMonth, endDay] = sign.end;
      
      if (startMonth === endMonth) {
        if (month === startMonth && day >= startDay && day <= endDay) {
          return sign.name;
        }
      } else {
        if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
          return sign.name;
        }
      }
    }
    
    return 'Unknown';
  },
  
  /**
   * Get day of week
   * @param {string} dateString - Date in YYYY-MM-DD format
   * @returns {string} Day name
   */
  getDayOfWeek: function(dateString) {
    const date = this.parseDate(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  },
  
  /**
   * Calculate difference between two dates in days
   * @param {string} date1String - First date in YYYY-MM-DD format
   * @param {string} date2String - Second date in YYYY-MM-DD format
   * @returns {number} Difference in days
   */
  dateDifference: function(date1String, date2String) {
    const date1 = this.parseDate(date1String);
    const date2 = this.parseDate(date2String);
    const diffTime = Math.abs(date2 - date1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },
  
  /**
   * Add days to a date
   * @param {string} dateString - Date in YYYY-MM-DD format
   * @param {number} days - Number of days to add
   * @returns {string} New date in YYYY-MM-DD format
   */
  addDays: function(dateString, days) {
    const date = this.parseDate(dateString);
    date.setDate(date.getDate() + days);
    return this.formatDate(date);
  },
  
  /**
   * Get current date in YYYY-MM-DD format
   * @returns {string} Current date
   */
  getCurrentDate: function() {
    return this.formatDate(new Date());
  },
  
  /**
   * Get current time in HH:MM:SS format
   * @returns {string} Current time
   */
  getCurrentTime: function() {
    return this.formatTime(new Date());
  },
  
  /**
   * Get current datetime
   * @returns {Object} Object with date and time
   */
  getCurrentDateTime: function() {
    const now = new Date();
    return {
      date: this.formatDate(now),
      time: this.formatTime(now),
      timestamp: now.getTime()
    };
  }
};

/**
 * Test date/time utilities
 */
function testDateTimeUtils() {
  Logger.log('Current date: ' + DateTimeUtils.getCurrentDate());
  Logger.log('Current time: ' + DateTimeUtils.getCurrentTime());
  Logger.log('Zodiac sign for 1990-04-15: ' + DateTimeUtils.getZodiacSignFromDate('1990-04-15'));
  Logger.log('Age from 1990-04-15: ' + DateTimeUtils.getAge('1990-04-15'));
  Logger.log('Day of week for 2024-01-01: ' + DateTimeUtils.getDayOfWeek('2024-01-01'));
}
