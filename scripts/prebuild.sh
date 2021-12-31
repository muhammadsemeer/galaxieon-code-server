#! bin/bash

echo "Running Pre Build"
# if root dist exists deleting it
if [ -d "dist" ]; then
    rm -r dist/
fi

cd helpers/preview 

# if preview dist is exists deleting it
if [ -d "dist" ]; then
    rm -r dist/
fi

npm run build
