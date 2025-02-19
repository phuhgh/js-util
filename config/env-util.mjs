import {join} from "path";

function isDebug() {
    return process.argv.slice(2).includes("--debug");
}

function isAsan() {
    return process.argv.slice(2).includes("--ASAN");
}

export function getHelpers(env, path) {
    const helpers = [];
    if (isAsan()) {
        helpers.push(join(path, "config/helpers/jasmine-asan.js"));
    }
    if (isDebug()) {
        helpers.push(join(path, "config/helpers/jasmine-debug.js"));
    }
    switch (env) {
        case "browser":
            return [
                join(path, "config/helpers/jasmine-env.js"),
            ].concat(helpers);
        case "node":
            return [
                join(path, "config/helpers/jasmine-env.js"),
                join(path, "config/helpers/jasmine-reporter.cjs"),
            ].concat(helpers);
        default:
            throw new Error(`unexpected environment ${env}`);
    }
}