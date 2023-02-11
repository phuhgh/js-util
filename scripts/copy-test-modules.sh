#!/bin/bash

set -e

# rename for module loader
mv build/cpp/asan-test-module.js build/cpp/asan-test-module.cjs || exit
mv build/cpp/safe-heap-test-module.js build/cpp/safe-heap-test-module.cjs || exit
# copy into typescript output
cp build/cpp/*-test-module* bin/esm/external/ || exit