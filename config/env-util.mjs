function isDebug() {
    return process.argv.slice(2).includes("--debug");
}

function isAsan() {
    return process.argv.slice(2).includes("--ASAN");
}

export function getHelpers(env, path) {
    const helpers = [];
    if (isAsan()) {
        console.log("Adding ASAN variables...");
        helpers.push(stripLeadingSlash(`${path}/config/helpers/jasmine-asan.js`));
    }
    if (isDebug()) {
        console.log("Adding debug variables...");
        helpers.push(stripLeadingSlash(`${path}config/helpers/jasmine-debug.js`));
    }
    switch (env) {
        case "browser":
            return [
                stripLeadingSlash(`${path}/config/helpers/jasmine-env.js`),
            ].concat(helpers);
        case "node":
            return [
                stripLeadingSlash(`${path}config/helpers/jasmine-env.js`),
                stripLeadingSlash(`${path}config/helpers/jasmine-reporter.cjs`),
            ].concat(helpers);
        default:
            throw new Error(`unexpected environment ${env}`);
    }
}

// bizarrely, jasmine doesn't play well with windows paths...
function stripLeadingSlash(path) { return path.replace(/^\/+/, ""); }