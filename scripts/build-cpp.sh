#!/bin/sh

set -e

print_instructions() {
  echo "================================="
  echo "builds the c++ given the js binding descriptor and cmake project"
  echo "options:"
  echo "--help"
  echo "--bindings - the javascript file that describes the c interface"
  echo "--cmake-dir - the thing to build"
  echo "--module-loader - the module loader for the javascript {mjs/cjs}"
  echo "--cmake-preset - {string} see CMakePresets.json for options"
  echo "--clean - delete the build dir"
  echo "================================="
  exit 1
}

SCRIPTS_DIR="$(dirname -- "$0")"

while [ "$1" != "" ]; do
  PARAM="$(printf "%s\n" "$1" | awk -F= '{print $1}')"
  VALUE="$(printf "%s\n" "$1" | sed 's/^[^=]*=//g')"

  case $PARAM in
  -h | --help)
    print_instructions
    exit
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
  --clean)
    BUILD_CLEAN="true"
    ;;
  *)
    echo "ERROR: unknown parameter \"$PARAM\""
    print_instructions
    exit 1
    ;;
  esac
  shift
done

if [ -z "$JS_BINDINGS_FILE" ] || [ -z "$CMAKE_PROJ_DIR" ]; then
  print_instructions
fi

if [ ! "$CMAKE_PRESETS" ]; then
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

if [ "$BUILD_CLEAN" = "true" ]; then
  echo "Deleting build dir"
  rm -rf build
fi

for CMAKE_PRESET in $CMAKE_PRESETS; do
  # these are defined if we're running on windows, we otherwise don't care...
  # shellcheck disable=SC2039
  if [ "$OSTYPE" = "msys" ] || [ "$OSTYPE" = "win32" ]; then
    emcmake.bat cmake --preset="$CMAKE_PRESET" || exit
  else
    emcmake cmake --preset="$CMAKE_PRESET" || exit
  fi

  cmake --build ./build/"$CMAKE_PRESET" || exit
done
