console.log("ASAN build");

const globalObject = typeof global === "object" ? global : typeof window === "object" ? window : null;

if (globalObject._BUILD == null) {
    globalObject._BUILD = {};
}

globalObject._BUILD = {..._BUILD, ASAN: true};