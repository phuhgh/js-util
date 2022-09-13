env node scripts/extract-cpp-names.mjs bin/esm/cpp.module.js >cpp/exported-names.txt || exit
cd cpp || exit
rm -rf build
mkdir build
cd build || exit

if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  emcmake.bat cmake -G Ninja ../.. -DCMAKE_BUILD_TYPE=Debug -DBUILD_JSUTIL_TEST=1 || exit
else
  emcmake cmake -G Ninja ../.. -DCMAKE_BUILD_TYPE=Debug -DBUILD_JSUTIL_TEST=1 || exit
fi

cmake --build . || exit
mv cpp/asan-test-module.js cpp/asan-test-module.cjs || exit
mv cpp/safe-heap-test-module.js cpp/safe-heap-test-module.cjs || exit
cp cpp/*-test-module* ../../bin/esm/external/ || exit
cd .. || exit
cd .. || exit
