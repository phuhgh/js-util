console.log("ASAN build")

if (typeof _BUILD === "undefined") {
    _BUILD = {};
}

_BUILD.ASAN = true;