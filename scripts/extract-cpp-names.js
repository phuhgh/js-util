const path = require("path");
const cppModulePath = path.resolve(process.argv[2]);

console.log(Object.keys(require(cppModulePath).exportedFunctions).join(";"));