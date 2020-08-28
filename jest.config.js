module.exports = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
  ],
  coverageDirectory: "./coverage/",
  preset: "ts-jest",
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
}