#!/bin/sh

set -e

# this script is only relevant to JsUtil - or if your project conforms to the same build process

OUTPUT_JUNIT=""

while [ "$1" != "" ]; do
  PARAM="$(printf "%s\n" "$1" | awk -F= '{print $1}')"
  VALUE="$(printf "%s\n" "$1" | sed 's/^[^=]*=//g')"
  case $PARAM in
  --cmake-preset)
    PRESET=$VALUE
    ;;
  --output-junit)
    OUTPUT_JUNIT="--output-junit=$VALUE"
    ;;
  *)
    # can be ignored...
    ;;
  esac
  shift
done

ctest --no-tests=error -j 4 --no-tests=error --verbose --output-on-failure --timeout 60 --test-dir cpp/build/"${PRESET}" ${OUTPUT_JUNIT}
