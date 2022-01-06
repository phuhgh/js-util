/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    restoreMocks: true,
    setupFiles: [
        "@rc-js-util/test/bin/test-env.js",
    ],
};