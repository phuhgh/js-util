cd cpp || exit
rm -rf build lib
mkdir build lib
cd build || exit
emcmake cmake -G Ninja .. || exit
cmake --build . || exit
cp test-module* ../../bin/external/ || exit
cp libjsutil.a ../lib/libjsutil.a || exit
cd .. || exit
cd .. || exit