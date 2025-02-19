#!/bin/sh

set -e

DIR="$(dirname -- "$0")"

# this script is only relevant to JsUtil - or if your project conforms to the same build process
"$DIR/build-cpp.sh" "$@" || exit
"$DIR/copy-test-modules.sh" "$@" || exit