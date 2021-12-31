#! bin/bash

echo "Running Post Build"

cp -r public/ dist/ 

mkdir -p dist/helpers/preview/dist

cp -r helpers/preview/dist/ dist/helpers/preview/