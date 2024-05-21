#!/bin/bash

set -e

# this script is only relevant to JsUtil

# asan build
npm run lint || exit
npm run build || exit
npm run test || exit

# release build
npm run build:cpp -- --cmake-preset=release --export-test || exit
IS_RELEASE_BUILD=true npm run test --  -- --cmake-preset=release || exit

# generate library
npm run lib || exit
npm run generate-docs || exit
