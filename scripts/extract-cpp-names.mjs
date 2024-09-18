import {resolve} from "path";

const cppModulePath = resolve(process.argv[2]);
const cppModule = await import(`file:///${cppModulePath}`);

process.stdout.write(Object.keys(cppModule["exportedFunctions"]).join(";"));