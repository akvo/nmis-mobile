#!/bin/bash

if [ $# -eq 0 ]; then
    echo "new version:"
    read form_version
else
    form_version=$(echo $1)
fi

for file in ./backend/json/*.json; do
    docker run -v "${PWD}":/data -w /data stedolan/jq --arg fv "$form_version" '.version = $fv' "$file" >temp.json && mv temp.json "$file"
    docker run -v "${PWD}":/data -w /data stedolan/jq 'del(.question_group[].question[].api)' "$file" >temp.json && mv temp.json "$file"
    echo "updated $file"
done
