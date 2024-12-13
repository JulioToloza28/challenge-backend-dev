export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    rootDir: './src',
    testMatch: ['**/*.test.ts'],
    collectCoverage: true,
    coverageDirectory: '../coverage',
  };