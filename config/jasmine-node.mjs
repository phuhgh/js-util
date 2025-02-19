import {getHelpers} from "./env-util.mjs";

export function createConfig(path = "") {
    return {
        "spec_dir": "",
        "spec_files": [
            "bin/esm/**/*[sS]pec.js"
        ],
        "helpers": getHelpers("node", path),
    };
}

export default createConfig();