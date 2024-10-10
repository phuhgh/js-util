# rc-js-util
A collection of TS and C++ utilities to help writing performant and correct applications, achieved through strict typing and (removable) invariant checking.

## Installation
Using npm:
```shell
$ npm i --save rc-js-util
```

## Configuration

The global variable `_BUILD` must be set (to at least an empty object `{}`) for js-util to function correctly. You can
create builds to handle various combinations, e.g. `{DEBUG: true, ASAN: true}` as required. In production builds
it is recommended to use a tool such as uglify-js to strip out debug checks by specifying that `_BUILD.DEBUG = false`.

For a list of default flags, see `IBuildConstants`. You can extend this configuration using global interface merging:

```typescript
declare global
{
    interface IBuildConstants
    {
        MY_CUSTOM_FLAG?: boolean;
    }
}
```

## Usage
Utility functions are provided as both stand alone and grouped by category, e.g. `_Array.compactMap` and `arrayCompactMap` are the same.

A collection of standard debug utilities such as assert is provided in `_Debug`. More specialized cases are exported separately, these are prefixed with `Debug`.
All debug checks should be hidden behind a `DEBUG_MODE` predicate.

Where an assertion is required in production code these should make use of `_Production`.

## Documentation
See [API reference](https://phuhgh.github.io/js-util/rc-js-util.html) for the latest API docs, for previous versions consult the documentation bundled in the package.

## Developing

### Building the C++
To see the required version, see the `Echo versions` step of CI. Recent versions of all tools should build.
- install emscripten (and use their env utility to set required env vars)
- install cmake
- install ninja build

### Debugging
To debug the C++ in the browser, you will need to [install DevTools DWARF support](https://chromewebstore.google.com/detail/cc++-devtools-support-dwa/pdcpmagijalfljmkmjngeonclgbbannb?pli=1).

To debug the CTests you'll need vscode with extensions (clion doesn't support this):
- ms-vscode.cpptools
- cmake-tools
- wasm-dwarf-debugging

You should be able to build and use bundled launch config to debug. Synchronous tests require a breakpoint to be put in the JavaScript glue code in `callMain`.
The test fixtures live under `cpp/build/{preset}/test/TestFixture.js`.

Hints:
- Enable the CMake Tools extension status bar
- Leave the kit unspecified
- Use the cmake presets (they configure the toolchain for you...)
- Use the address sanitized preset
- Build the project via `npm run build` first, it creates other required files
