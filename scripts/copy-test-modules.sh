#!/bin/sh

set -e

# this script is only relevant to JsUtil
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
  cp cpp/build/"${PRESET}"/util-test-module.js bin/esm/external/util-test-module.mjs || exit
  # todo jack: can we do any better?
  # mysteriously, on linux the name is different
  cp cpp/build/"${PRESET}"/util-test-module.js bin/esm/external/util-test-module.js || exit
  cp cpp/build/"${PRESET}"/util-test-module.worker.mjs bin/esm/external/util-test-module.worker.mjs || exit
  cp cpp/build/"${PRESET}"/util-test-module.wasm bin/esm/external/util-test-module.wasm || exit
fi
