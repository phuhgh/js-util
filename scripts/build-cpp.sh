#!/bin/sh

set -e

print_instructions() {
  echo "================================="
  echo "Builds the C++ project given the JS binding descriptor and CMake project"
  echo "Options:"
  echo "--help"
  echo "--bindings - the JavaScript file that describes the C interface"
  echo "--cmake-dir - the project directory to build"
  echo "--module-loader - the module loader for JavaScript {mjs/cjs}"
  echo "--cmake-preset - {string} See CMakePresets.json for options"
  echo "--clean - delete the build directory"
  echo "--out-dir - output directory instead of build/{presetName}"
  echo "--export-test - include symbols for test functions in exported_names.txt"
  echo "--skip-build - skip configuration and build"
  echo "================================="
  exit 1
}

SCRIPTS_DIR="$(dirname -- "$0")"

while [ -n "$1" ]; do
  PARAM="$(printf "%s\n" "$1" | awk -F= '{print $1}')"
  VALUE="$(printf "%s\n" "$1" | sed 's/^[^=]*=//g')"
  case $PARAM in
    -h | --help)
      print_instructions
      ;;
    --bindings)
      JS_BINDINGS_FILE=$VALUE
      ;;
    --cmake-dir)
      CMAKE_PROJ_DIR=$VALUE
      ;;
    --module-loader)
      MODULE_LOADER=$VALUE
      ;;
    --cmake-preset)
      CMAKE_PRESETS=$VALUE
      ;;
    --out-dir)
      OUT_DIR=$VALUE
      ;;
    --clean)
      BUILD_CLEAN=true
      ;;
    --skip-build)
      SKIP_BUILD=true
      ;;
    *)
      echo "ERROR: unknown parameter \"$PARAM\""
      print_instructions
      ;;
  esac
  shift
done

if [ -z "$JS_BINDINGS_FILE" ] || [ -z "$CMAKE_PROJ_DIR" ]; then
  echo "ERROR: both a JS binding file and CMake project directory are required"
  print_instructions
fi

if [ -z "$CMAKE_PRESETS" ] && [ "$SKIP_BUILD" != "true" ]; then
  echo "ERROR: you must supply either presets or skip build"
  print_instructions
fi

if [ ! -f "$JS_BINDINGS_FILE" ]; then
  echo "ERROR: could not find JS bindings file: $JS_BINDINGS_FILE"
  exit 1
fi

if [ ! -d "$CMAKE_PROJ_DIR" ]; then
  echo "ERROR: directory does not exist: $CMAKE_PROJ_DIR"
  exit 1
fi

if [ "$MODULE_LOADER" = "cjs" ]; then
  node "$SCRIPTS_DIR/extract-cpp-names.cjs" "$JS_BINDINGS_FILE" $EXTRACTION_ARG > "$CMAKE_PROJ_DIR/exported-names.txt" || exit
elif [ "$MODULE_LOADER" = "mjs" ]; then
  node "$SCRIPTS_DIR/extract-cpp-names.mjs" "$JS_BINDINGS_FILE" $EXTRACTION_ARG > "$CMAKE_PROJ_DIR/exported-names.txt" || exit
else
  echo "ERROR: Invalid module loader type: $MODULE_LOADER"
  print_instructions
fi

cd "$CMAKE_PROJ_DIR" || exit

if [ "$BUILD_CLEAN" = "true" ]; then
  echo "Deleting build directory"
  rm -rf build
fi

if [ "$SKIP_BUILD" != "true" ]; then
  for CMAKE_PRESET in $CMAKE_PRESETS; do
    # shellcheck disable=SC3028
    if [ "$OSTYPE" = "msys" ] || [ "$OSTYPE" = "win32" ]; then
      emcmake.bat cmake --preset="$CMAKE_PRESET" || exit
    else
      emcmake cmake --preset="$CMAKE_PRESET" || exit
    fi

    BUILD_DIR=${OUT_DIR:-./build/$CMAKE_PRESET}
    cmake --build "$BUILD_DIR" || exit
  done
fi