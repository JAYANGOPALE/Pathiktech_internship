module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'utils/**/*.js',
    'services/**/*.js',
    'controllers/**/*.js',
    'routes/**/*.js',
  ],
  coverageDirectory: 'coverage',
};
