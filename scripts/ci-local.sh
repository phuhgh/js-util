#!/bin/sh

set -e

# this script is only relevant to JsUtil - or if your project conforms to the same build process

# asan build
npm run lint || exit
npm run build || exit
npm run test || exit

# release build
npm run build:cpp -- --cmake-preset=release || exit
npm run test:js || exit
npm run test:cpp -- --cmake-preset=release || exit

# generate library
npm run lib || exit
npm run generate-docs || exit
