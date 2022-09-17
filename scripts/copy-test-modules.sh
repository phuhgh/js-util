# rename for module loader
mv cpp/build/asan-test-module.js cpp/build/asan-test-module.cjs || exit
mv cpp/build/safe-heap-test-module.js cpp/build/safe-heap-test-module.cjs || exit
# copy into typescript output
cp cpp/build/*-test-module* bin/esm/external/ || exit