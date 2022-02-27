#!/bin/bash
#Build the UI from the react js folder.
cd ../jams-react-client || exit
echo "Using Node version: "
nvm -v
npm install
npm run build
#Now the UI is built we can exit and copy resource
rm -rf ../jams-server/src/main/resources/webapp/*
echo "Removed old webapp contents!"
mkdir -p ../jams-server/src/main/resources/webapp
echo "Created webapp folder!"
sed -i 's/material-dashboard-react\///g' build/index.html
echo "Created webapp folder!"
mv build/* ../jams-server/src/main/resources/webapp
echo "Copied new webapp contents!"
rm -rf build
