/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: "ts-jest/presets/js-with-ts",
    testEnvironment: "node",
    restoreMocks: true,
    setupFiles: [
        "./bin/env/test-env.js",
    ],
    globals: {
        "ts-jest": {
            useESM: true,
        },
    },
};