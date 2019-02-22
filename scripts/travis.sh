#!/bin/bash

set -e

export PATH=./scripts:$PATH

docker --version
docker-compose --version
echo "node `node -v`"
echo "npm `npm -v`"

# Run unit tests
authelia-scripts unittest

# Run integration tests
authelia-scripts test --headless test/suites/**/*.ts

# Build
authelia-scripts build

# Test npm deployment before actual deployment
./scripts/npm-deployment-test.sh
