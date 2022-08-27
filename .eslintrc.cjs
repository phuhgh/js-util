module.exports = {
    "extends": [
        "./node_modules/rc-lint-rules/.eslintrc"
    ],
    "ignorePatterns": ["**/*spec.ts"],
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module",
        "project": "tsconfig.json"
    },
};
