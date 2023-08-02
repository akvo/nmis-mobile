#!/bin/bash
# This script is used to generate new version for nmis-mobile

APK_NAME="nmis-mobile"
CURRENT_TAG=$(git describe --abbrev=0)
# GET CURRENT VERSION IN /app/package.json
CURRENT_VERSION=$(cat ./app/package.json | grep version | awk -F\" '{print $4}')
CURRENT_BRANCH=$(git branch --show-current)

if [[ "${SLACK_NMIS_MOBILE_HOOK}" == "" ]]; then
    printf "Please set SLACK_NMIS_MOBILE_HOOK\n"
    exit 0
fi

if [[ "$CURRENT_BRANCH" != "main" ]]; then
    printf "Current Branch: %s\n" "${CURRENT_BRANCH}"
    printf "Please checkout to main branch\n"
    exit 0
else
    git pull
fi

MAJOR=$(echo "${CURRENT_TAG}" | awk -F. '{print $1}')
MINOR=$(echo "${CURRENT_TAG}" | awk -F. '{print $2}')
PATCH=$(echo "${CURRENT_TAG}" | awk -F. '{print $3}')

printf "Current Version: %s\n" "${CURRENT_VERSION}"
printf "Last Release: %s\n" "${CURRENT_TAG}"
read -r -p "Do you want to release new version? [y/N] " response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]; then
    read -r -p "Please select release type [major/minor/patch] " response
    # GENERATE NEW VERSION
    if [[ "$response" == "major" ]]; then
        NEW_VERSION=$(echo "${CURRENT_TAG}" | awk -F. '{$1 = $1 + 1; $2=0; $3=0;} 1' OFS=.)
    elif [[ "$response" == "minor" ]]; then
        NEW_VERSION="${MAJOR}.$((MINOR + 1)).${PATCH}"
    elif [[ "$response" == "patch" ]]; then
        NEW_VERSION="${MAJOR}.${MINOR}.$((PATCH + 1))"
    else
        printf "Aborted\n"
        exit 0
    fi
    DESC=$(git log --pretty=format:"%s" -n 20 "${CURRENT_TAG}"..main)
    READ_MORE="\nRead more: https://github.com/akvo/nmis-mobile/compare/${CURRENT_TAG}...main"
    printf "Processing New Release: %s %s\n" "${APK_NAME}" "${NEW_VERSION}"
    # UPDATE VERSION IN /app/package.json
    sed -i "s/\"version\": \"${CURRENT_VERSION}\"/\"version\": \"${NEW_VERSION}\"/g" ./app/package.json
    # Commit and Push new tag
    git add ./app/package.json
    git commit -m "Update version to ${NEW_VERSION}"
    git push
    git tag -a "${NEW_VERSION}" -m "Release ${NEW_VERSION}"
    git push --tags
    gh release create "${NEW_VERSION}" -t "${NEW_VERSION}" -n "${DESC}"
    # send message to slack
    curl -X POST \
        -H 'Content-type: application/json' \
        --data '{"text":"New Release: '"${APK_NAME}"' '"${NEW_VERSION}"'\n\n'"${DESC}"'\n'"${READ_MORE}"'"}' \
        "${SLACK_NMIS_MOBILE_HOOK}"
    printf "Done\n"
    exit 0
else
    printf "Aborted\n"
    exit 0
fi
