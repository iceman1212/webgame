module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // Changed from 'node' to 'jsdom'
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\.(ts|tsx)$': 'ts-jest',
  },
};
