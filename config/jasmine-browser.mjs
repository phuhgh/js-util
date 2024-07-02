import express from "express";
import {getHelpers} from "./env-util.mjs";

function expressShim() {
    // hack some headers in, so we can use shared array buffer etc
    const app = express();
    app.use(function (req, res, next) {
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
        next();
    });
    return app;
}

Object.setPrototypeOf(expressShim, express);

export default {
    "srcDir": "bin/esm/",
    "srcFiles": [
        "**/*.cjs",
        "**/*.js"
    ],
    "specDir": ".",
    "specFiles": [
        "bin/esm/**/*[sS]pec.js"
    ],
    "helpers": getHelpers("browser"),
    "importMap": {
        "moduleRootDir": "node_modules",
        "imports": {
            "tslib": "tslib/tslib.es6.mjs",
            "rc-js-util-globals": "rc-js-util-globals/index.js"
        }
    },
    "esmFilenameExtension": ".js",
    "env": {
        "stopSpecOnExpectationFailure": false,
        "stopOnSpecFailure": false,
        "random": true
    },
    "browser": {
        "name": "firefox"
    },
    express: expressShim,
};
