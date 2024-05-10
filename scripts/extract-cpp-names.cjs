const path = require("path");
const exposeTests = process.argv[3] === "--expose-tests";
const cppModulePath = path.resolve(process.argv[2]);

const exportName = exposeTests ? "exportedTestFunctions" : "exportedFunctions";
process.stdout.write(Object.keys(require(cppModulePath)[exportName]).join(";"));