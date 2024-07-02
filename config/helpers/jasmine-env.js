const globalObject = typeof global === "object" ? global : typeof window === "object" ? window : null;

if (globalObject._BUILD == null) {
    globalObject._BUILD = {};
}

globalObject._BUILD = {..._BUILD, DEBUG: true, DISABLE_BREAKPOINT: true};

console.log("test timeout: ", jasmine.DEFAULT_TIMEOUT_INTERVAL);