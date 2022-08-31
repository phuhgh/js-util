env node scripts/extract-cpp-names.cjs bin/cjs/cpp.module.js > cpp/exported-names.txt || exit
cd cpp || exit
rm -rf build
mkdir build
cd build || exit
emcmake cmake -G Ninja ../.. -DCMAKE_BUILD_TYPE=Debug -DBUILD_JSUTIL_TEST=1 || exit
cmake --build . || exit
cp cpp/*-test-module* ../../bin/cjs/external/ || exit
cd .. || exit
cd .. || exit