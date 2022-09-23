#!/bin/sh

set -e

print_instructions() {
  echo "================================="
  echo "usage: build-cpp.sh {path/to/cpp-bindings.js} {path/to/cpp/cmake/dir} {mjs|cjs} {debug|release} {-cmake_build_flags} {clean|}"
  echo "builds the c++ given the js binding descriptor and cmake project"
  echo "================================="
  exit 1
}

SCRIPTS_DIR="$( dirname -- "$0"; )"
JS_BINDINGS_FILE="$1"
CMAKE_PROJ_DIR="$2"
MODULE_LOADER="$3"
BUILD_MODE="$4"
BUILD_FLAGS="$5"
BUILD_CLEAN="$6"


if [ -z "$JS_BINDINGS_FILE" ] || [ -z "$CMAKE_PROJ_DIR" ]; then
  print_instructions
fi

if [ "$BUILD_MODE" != "debug" ] && [ "$BUILD_MODE" != "release" ]; then
  print_instructions
fi

if [ ! -f "$JS_BINDINGS_FILE" ]; then
  echo "ERROR: couldn't find js bindings file ${JS_BINDINGS_FILE}"
  print_instructions
fi

if [ ! -d "$CMAKE_PROJ_DIR" ]; then
  echo "ERROR: directory ${1} does not exist"
  print_instructions
fi

if [ "$MODULE_LOADER" = "cjs" ]; then
  node "$SCRIPTS_DIR/extract-cpp-names.cjs" "$JS_BINDINGS_FILE" >"$CMAKE_PROJ_DIR/exported-names.txt" || exit
elif [ "$MODULE_LOADER" = "mjs" ]; then
  node "$SCRIPTS_DIR/extract-cpp-names.mjs" "$JS_BINDINGS_FILE" >"$CMAKE_PROJ_DIR/exported-names.txt" || exit
else
  print_instructions
fi

cd "$CMAKE_PROJ_DIR" || exit

if [ "$BUILD_CLEAN" = "clean" ]; then
  echo "Deleting build dir"
  rm -rf build
fi

mkdir -p build || exit
cd build || exit

# these are defined if we're running on windows, we otherwise don't care...
# shellcheck disable=SC2039
if [ "$OSTYPE" = "msys" ] || [ "$OSTYPE" = "win32" ]; then
  emcmake.bat cmake -G Ninja .. -DCMAKE_BUILD_TYPE="$BUILD_MODE" "$BUILD_FLAGS" || exit
else
  emcmake cmake -G Ninja .. -DCMAKE_BUILD_TYPE="$BUILD_MODE" "$BUILD_FLAGS" || exit
fi

cmake --build . || exit
