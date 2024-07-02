const reporters = require("jasmine-reporters");

jasmine.getEnv().addReporter(new reporters.JUnitXmlReporter({
    savePath: "test-report", consolidateAll: false,
}));
