import {resolve} from "path";

const cppModulePath = resolve(process.argv[2]);

process.stdout.write(Object.keys(require(cppModulePath).exportedFunctions).join(";"));