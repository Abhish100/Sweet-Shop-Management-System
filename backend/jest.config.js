module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 20000,
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  globalTeardown: '<rootDir>/src/tests/jest.global-teardown.ts',
}
