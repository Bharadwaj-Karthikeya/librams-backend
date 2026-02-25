export default {
  testEnvironment: "node",
  verbose: true,
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/server.js",
  ],
  testMatch: ["**/tests/**/*.test.js"],
  coverageDirectory: "coverage",
};