/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    setupFiles: [
        "@rc-js-util/test/bin/test-env.js",
        "@rc-js-util/debug/bin/debug-namespace.js",
    ],
};