const path = require("path");
const cppModulePath = path.resolve(process.argv[2]);

process.stdout.write(Object.keys(require(cppModulePath)["exportedFunctions"]).join(";"));