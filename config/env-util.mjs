function isDebug() {
    return process.argv.slice(2).includes("--debug");
}

function isAsan() {
    return process.argv.slice(2).includes("--ASAN");
}

export function getHelpers(env) {
    const helpers = [];
    if (isAsan()) {
        helpers.push("config/helpers/jasmine-asan.js");
    }
    if (isDebug()) {
        helpers.push("config/helpers/jasmine-debug.js");
    }
    switch (env) {
        case "browser":
            return [
                "config/helpers/jasmine-env.js",
            ].concat(helpers);
        case "node":
            return [
                "config/helpers/jasmine-env.js",
                "config/helpers/jasmine-reporter.cjs",
            ].concat(helpers);
        default:
            throw new Error(`unexpected environment ${env}`);
    }
}