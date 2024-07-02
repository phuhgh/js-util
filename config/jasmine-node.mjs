import {getHelpers} from "./env-util.mjs";

export default {
    "spec_dir": "",
    "spec_files": [
        "bin/esm/**/*[sS]pec.js"
    ],
    "helpers": getHelpers("node"),
};