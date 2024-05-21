#!/bin/sh

set -e

# this script is only relevant to JsUtil
./scripts/build-cpp.sh "$@"  || exit
./scripts/copy-test-modules.sh "$@" || exit
