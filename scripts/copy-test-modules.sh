#!/bin/sh

set -e

# this script is only relevant to JsUtil - or if your project conforms to the same build process

while [ "$1" != "" ]; do
  PARAM="$(printf "%s\n" "$1" | awk -F= '{print $1}')"
  VALUE="$(printf "%s\n" "$1" | sed 's/^[^=]*=//g')"

  case $PARAM in
  --cmake-preset)
    PRESET=$VALUE
    ;;
  --skip-build)
    SKIP_BUILD="true"
    ;;
  *)
    # can be ignored...
    ;;
  esac
  shift
done

if [ "$SKIP_BUILD" != "true" ]; then
  echo "Copying test-module from ${PRESET} into bin/esm/external/"
  cp cpp/build/"${PRESET}"/test-module.js bin/esm/external/test-module.mjs || exit
  # todo jack: can we do any better?
  # mysteriously, on linux the name is different
  cp cpp/build/"${PRESET}"/test-module.js bin/esm/external/test-module.js || exit
  cp cpp/build/"${PRESET}"/test-module.wasm bin/esm/external/test-module.wasm || exit
fi
