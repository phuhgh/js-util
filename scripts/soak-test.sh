#!/bin/sh

set -e

while true; do
    if npm run test:cpp -- --cmake-preset=release; then
        echo "success..."
    else
      echo "failure..."
      break
    fi
done
