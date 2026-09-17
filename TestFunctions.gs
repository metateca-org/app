/**
 * TestFunctions.gs
 * Test utilities for Metateca
 */

const TestFunctions = {
  /**
   * Run all tests
   * @returns {Object} Test results
   */
  runAllTests: function() {
    try {
      const results = {
        timestamp: DateTimeUtils.getCurrentDateTime(),
        tests: []
      };
    
      results.tests.push(this.testConstants());
      results.tests.push(this.testEnums());
      results.tests.push(this.testValidation());
      results.tests.push(this.testDateTimeUtils());
      results.tests.push(this.testStringUtils());
      results.tests.push(this.testArrayUtils());
      results.tests.push(this.testObjectUtils());
      results.tests.push(this.testElementMapper());
      results.tests.push(this.testModalityMapper());
      results.tests.push(this.testBirthDataProcessor());
    
      return results;
    } catch (error) {
      Logger.log("Erro em runAllTests: " + error.message);
      throw error;
    }
  },
  
  /**
   * Test constants
   * @returns {Object} Test result
   */
  testConstants: function() {
    try {
      const result = {
        name: 'Constants',
        passed: true,
        assertions: []
      };
      
      result.assertions.push({
        test: 'APP_NAME exists',
        passed: Constants.APP_NAME !== undefined
      });
      
      result.assertions.push({
        test: 'ZODIAC_SIGNS has 12 signs',
        passed: Constants.ZODIAC_SIGNS.length === 12
      });
      
      result.passed = result.assertions.every(a => a.passed);
      return result;
    } catch (error) {
      return { name: 'Constants', passed: false, error: error.message };
    }
  },
  
  /**
   * Test enums
   * @returns {Object} Test result
   */
  testEnums: function() {
    try {
      const result = {
        name: 'Enums',
        passed: true,
        assertions: []
      };
      
      result.assertions.push({
        test: 'Signs enum exists',
        passed: Enums.Signs !== undefined
      });
      
      result.assertions.push({
        test: 'Planets enum exists',
        passed: Enums.Planets !== undefined
      });
      
      result.passed = result.assertions.every(a => a.passed);
      return result;
    } catch (error) {
      return { name: 'Enums', passed: false, error: error.message };
    }
  },
  
  /**
   * Test validation
   * @returns {Object} Test result
   */
  testValidation: function() {
    try {
      try {
        const result = {
          name: 'Validation',
          passed: true,
          assertions: []
        };
      
        result.assertions.push({
          test: 'Valid email passes',
          passed: Validation.isValidEmail('test@example.com') === true
        });
      
        result.assertions.push({
          test: 'Invalid email fails',
          passed: Validation.isValidEmail('invalid') === false
        });
      
        result.assertions.push({
          test: 'Valid date passes',
          passed: Validation.isValidDate('2000-01-01') === true
        });
      
        result.assertions.push({
          test: 'Valid zodiac sign passes',
          passed: Validation.isValidZodiacSign('Aries') === true
        });
      
        result.passed = result.assertions.every(a => a.passed);
        return result;
      } catch (error) {
        return { name: 'Validation', passed: false, error: error.message };
      }
    } catch (error) {
      Logger.log("Erro em testValidation: " + error.message);
      throw error;
    }
  },
  
  /**
   * Test date/time utilities
   * @returns {Object} Test result
   */
  testDateTimeUtils: function() {
    try {
      const result = {
        name: 'DateTimeUtils',
        passed: true,
        assertions: []
      };
      
      result.assertions.push({
        test: 'Get zodiac sign for Aries date',
        passed: DateTimeUtils.getZodiacSignFromDate('1990-04-15') === 'Aries'
      });
      
      result.assertions.push({
        test: 'Get age from birth date',
        passed: DateTimeUtils.getAge('1990-04-15') > 30
      });
      
      result.assertions.push({
        test: 'Format date correctly',
        passed: DateTimeUtils.formatDate(new Date('2024-01-01')).includes('2024')
      });
      
      result.passed = result.assertions.every(a => a.passed);
      return result;
    } catch (error) {
      return { name: 'DateTimeUtils', passed: false, error: error.message };
    }
  },
  
  /**
   * Test string utilities
   * @returns {Object} Test result
   */
  testStringUtils: function() {
    try {
      const result = {
        name: 'StringUtils',
        passed: true,
        assertions: []
      };
      
      result.assertions.push({
        test: 'Capitalize string',
        passed: StringUtils.capitalize('hello') === 'Hello'
      });
      
      result.assertions.push({
        test: 'String contains substring',
        passed: StringUtils.contains('Hello World', 'World') === true
      });
      
      result.assertions.push({
        test: 'Truncate string',
        passed: StringUtils.truncate('This is a long string', 10).length <= 13
      });
      
      result.passed = result.assertions.every(a => a.passed);
      return result;
    } catch (error) {
      return { name: 'StringUtils', passed: false, error: error.message };
    }
  },
  
  /**
   * Test array utilities
   * @returns {Object} Test result
   */
  testArrayUtils: function() {
    try {
      try {
        const result = {
          name: 'ArrayUtils',
          passed: true,
          assertions: []
        };
      
        const arr = [1, 2, 3, 2, 4];
      
        result.assertions.push({
          test: 'Array contains value',
          passed: ArrayUtils.contains(arr, 3) === true
        });
      
        result.assertions.push({
          test: 'Get unique values',
          passed: ArrayUtils.unique(arr).length === 4
        });
      
        result.assertions.push({
          test: 'Get first element',
          passed: ArrayUtils.first(arr) === 1
        });
      
        result.passed = result.assertions.every(a => a.passed);
        return result;
      } catch (error) {
        return { name: 'ArrayUtils', passed: false, error: error.message };
      }
    } catch (error) {
      Logger.log("Erro em testArrayUtils: " + error.message);
      throw error;
    }
  },
  
  /**
   * Test object utilities
   * @returns {Object} Test result
   */
  testObjectUtils: function() {
    try {
      try {
        const result = {
          name: 'ObjectUtils',
          passed: true,
          assertions: []
        };
      
        const obj = { a: 1, b: 2 };
      
        result.assertions.push({
          test: 'Get object keys',
          passed: ObjectUtils.keys(obj).length === 2
        });
      
        result.assertions.push({
          test: 'Get object values',
          passed: ObjectUtils.values(obj).length === 2
        });
      
        result.assertions.push({
          test: 'Has property',
          passed: ObjectUtils.hasProperty(obj, 'a') === true
        });
      
        result.passed = result.assertions.every(a => a.passed);
        return result;
      } catch (error) {
        return { name: 'ObjectUtils', passed: false, error: error.message };
      }
    } catch (error) {
      Logger.log("Erro em testObjectUtils: " + error.message);
      throw error;
    }
  },
  
  /**
   * Test element mapper
   * @returns {Object} Test result
   */
  testElementMapper: function() {
    try {
      const result = {
        name: 'ElementMapper',
        passed: true,
        assertions: []
      };
      
      result.assertions.push({
        test: 'Get element for Aries',
        passed: ElementMapper.getElement('Aries') === 'Fire'
      });
      
      result.assertions.push({
        test: 'Get Fire signs',
        passed: ElementMapper.getSignsByElement('Fire').length === 3
      });
      
      result.assertions.push({
        test: 'Get element compatibility',
        passed: ElementMapper.getElementCompatibility('Fire', 'Air') > 50
      });
      
      result.passed = result.assertions.every(a => a.passed);
      return result;
    } catch (error) {
      return { name: 'ElementMapper', passed: false, error: error.message };
    }
  },
  
  /**
   * Test modality mapper
   * @returns {Object} Test result
   */
  testModalityMapper: function() {
    try {
      const result = {
        name: 'ModalityMapper',
        passed: true,
        assertions: []
      };
      
      result.assertions.push({
        test: 'Get modality for Aries',
        passed: ModalityMapper.getModality('Aries') === 'Cardinal'
      });
      
      result.assertions.push({
        test: 'Get Cardinal signs',
        passed: ModalityMapper.getSignsByModality('Cardinal').length === 4
      });
      
      result.passed = result.assertions.every(a => a.passed);
      return result;
    } catch (error) {
      return { name: 'ModalityMapper', passed: false, error: error.message };
    }
  },
  
  /**
   * Test birth data processor
   * @returns {Object} Test result
   */
  testBirthDataProcessor: function() {
    try {
      try {
        const result = {
          name: 'BirthDataProcessor',
          passed: true,
          assertions: []
        };
      
        const rawData = {
          name: 'john doe',
          birthDate: '1990-04-15',
          birthTime: '12:30:00',
          birthLocation: 'New York, USA',
          latitude: 40.7128,
          longitude: -74.0060,
          email: 'john@example.com'
        };
      
        const processed = BirthDataProcessor.process(rawData);
      
        result.assertions.push({
          test: 'Process birth data successfully',
          passed: processed.success === true
        });
      
        result.assertions.push({
          test: 'Name is capitalized',
          passed: processed.data.name === 'John doe'
        });
      
        result.assertions.push({
          test: 'Sun sign is calculated',
          passed: processed.data.sunSign === 'Aries'
        });
      
        result.passed = result.assertions.every(a => a.passed);
        return result;
      } catch (error) {
        return { name: 'BirthDataProcessor', passed: false, error: error.message };
      }
    } catch (error) {
      Logger.log("Erro em testBirthDataProcessor: " + error.message);
      throw error;
    }
  },
  
  /**
   * Generate test report
   * @returns {string} Test report
   */
  generateTestReport: function() {
    const results = this.runAllTests();
    let report = '=== TEST REPORT ===\n';
    report += 'Generated: ' + results.timestamp.date + ' ' + results.timestamp.time + '\n\n';
    
    let totalTests = 0;
    let passedTests = 0;
    
    for (let test of results.tests) {
      const status = test.passed ? '✓ PASS' : '✗ FAIL';
      report += status + ' - ' + test.name + '\n';
      
      if (test.assertions) {
        totalTests += test.assertions.length;
        for (let assertion of test.assertions) {
          if (assertion.passed) {
            passedTests++;
            report += '  ✓ ' + assertion.test + '\n';
          } else {
            report += '  ✗ ' + assertion.test + '\n';
          }
        }
      }
    }
    
    report += '\n=== SUMMARY ===\n';
    report += 'Total Tests: ' + totalTests + '\n';
    report += 'Passed: ' + passedTests + '\n';
    report += 'Failed: ' + (totalTests - passedTests) + '\n';
    report += 'Success Rate: ' + ((passedTests / totalTests) * 100).toFixed(1) + '%\n';
    
    return report;
  }
};

/**
 * Run all tests
 */
function runTests() {
  const report = TestFunctions.generateTestReport();
  Logger.log(report);
}
