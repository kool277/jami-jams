#!/bin/bash
#Build the UI from the react js folder.
cd ../jams-react-client || exit
npm run build
#Now the UI is built we can exit and copy resource
mkdir -p ../jams-server/src/main/resources/webapp
sed -i 's/material-dashboard-react\///g' build/index.html
rm -rf ../jams-server/src/main/resources/webapp/*
mv build/* ../jams-server/src/main/resources/webapp
rm -rf build
