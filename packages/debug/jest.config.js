/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    restoreMocks: true,
    setupFiles: [
        "./bin/env/test-env.js",
    ],
};