module.exports = {
  modulePaths: ['<rootDir>/lib/'],
  collectCoverage: true,
  collectCoverageFrom: ['lib/**/*.js', 'lib/*.js'],
  coverageReporters: ['text-summary', 'html'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  clearMocks: true
}
