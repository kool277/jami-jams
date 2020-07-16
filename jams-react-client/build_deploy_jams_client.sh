BUILD_DIRECTORY=build/
WEBAPP=../jams-server/src/main/resources/webapp/
JAMS_CLIENT=jams-client/
JAMS=jams

sudo npm run build

rm -rf $WEBAPP*
cp -r $BUILD_DIRECTORY* $WEBAPP

sed -i 's/material-dashboard-react\///g' $WEBAPP"index.html"


#cd ../$JAMS
#rm -rf jams
#rm derby.log
#rm oauth.key
#rm oauth.pub
#rm config.json

cd ..
mvn clean package -DskipTests
mvn package -DskipTests

cd $JAMS
java -jar jams-launcher.jar
