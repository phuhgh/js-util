#!/bin/bash

set -e

while [ "$1" != "" ]; do
  PARAM="$(printf "%s\n" "$1" | awk -F= '{print $1}')"
  VALUE="$(printf "%s\n" "$1" | sed 's/^[^=]*=//g')"

  case $PARAM in
  --preset)
    PRESET=$VALUE
    ;;
  *)
    echo "ERROR: unknown parameter \"$PARAM\""
    exit 1
    ;;
  esac
  shift
done

cp cpp/build/"${PRESET}"/util-test-module.js bin/esm/external/util-test-module.cjs || exit
cp cpp/build/"${PRESET}"/util-test-module.wasm bin/esm/external/util-test-module.wasm || exit
