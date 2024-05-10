#!/bin/bash

set -e

# this script is only relevant to JsUtil
while [ "$1" != "" ]; do
  PARAM="$(printf "%s\n" "$1" | awk -F= '{print $1}')"
  VALUE="$(printf "%s\n" "$1" | sed 's/^[^=]*=//g')"

  case $PARAM in
  --cmake-preset)
    PRESET=$VALUE
    ;;
  *)
    # can be ignored...
    ;;
  esac
  shift
done

cd cpp/build/"${PRESET}" && ctest --no-tests=error -j 4 --output-on-failure --timeout 60