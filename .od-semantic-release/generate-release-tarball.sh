#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: $0 <new_version>"
    exit 1
fi

NEW_VERSION=$1

# Clean the working directory before creating the tarball
echo "Cleaning working directory with git clean -df..."
git clean -df

GH_TOKEN=$CLI_GH_TOKEN OD_OCTODEMO_FRAMEWORK_APP_ID=$OD_OCTODEMO_FRAMEWORK_APP_ID OD_OCTODEMO_FRAMEWORK_APP_KEY=$OD_OCTODEMO_FRAMEWORK_APP_KEY gh octodemo demo-template generate-release-package \
    --source "$WORKING_DIR" \
    --target "$WORKING_DIR/.od-semantic-release/release.tar.gz" \
    --release-version "$NEW_VERSION" \
    --cli-source action
