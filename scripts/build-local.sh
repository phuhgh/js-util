#!/bin/sh

set -e

# this script is only relevant to JsUtil - or if your project conforms to the same build process
./scripts/build-cpp.sh "$@"  || exit
./scripts/copy-test-modules.sh "$@" || exit
