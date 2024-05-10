import {resolve} from "path";

const exposeTests = process.argv[3] === "--expose-tests";
const cppModulePath = resolve(process.argv[2]);
const cppModule = await import(`file:///${cppModulePath}`);

const exportName = exposeTests ? "exportedTestFunctions" : "exportedFunctions";
process.stdout.write(Object.keys(cppModule[exportName]).join(";"));