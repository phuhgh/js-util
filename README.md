# rc-js-util
A collection of strongly typed JS utilities.

## Installation
Using npm:
```shell
$ npm i --save rc-js-util
```

## Configuration
The global variable `DEBUG_MODE` must be set for js-util to function correctly. Setting `DEBUG_MODE`
to true enables debug assertions. In production builds it is recommended to use a tool such as uglify-js' dead code
removal to strip out all of these checks.

For a full list of debug flags, see `IStandardDebugFlags` in the API reference.

## Usage
Utility functions are provided as both stand alone and grouped by category, e.g. `_Array.compactMap` and `arrayCompactMap` are the same.

A collection of standard debug utilities such as assert is provided in `_Debug`. More specialized cases are exported separately, these are prefixed with `Debug`.
All debug checks should be hidden behind a `DEBUG_MODE` predicate.

Where an assertion is required in production code these should make use of `_Production`.

## Debugging
To Debug the C++ in the browser, you will need to [install DevTools DWARF support](https://chromewebstore.google.com/detail/cc++-devtools-support-dwa/pdcpmagijalfljmkmjngeonclgbbannb?pli=1).

## Documentation
See [API reference](https://phuhgh.github.io/js-util/rc-js-util.html) for the latest API docs, for previous versions consult the documentation bundled in the package.