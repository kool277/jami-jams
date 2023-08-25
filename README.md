# JAMS (Jami Account Management Server)

## Requirements

- JDK 11+
- maven

## Building from source

Clone the contents of this repository and run

```sh
mvn clean package
```

This will create a distribution folder called `jams` in the root folder. You can
then launch the server by running

```sh
cd jams
java -jar jams-launcher.jar
```

If you want to start the server with an SSL certificate and on a port different
from 8080, then run:

`java -jar jams-launcher.jar 8443 server.pem server.key`

Where the `pem` and `key` files are a pem encoded certificate and key.

## How to generate server.pem and server.key pair

In order to generate a pair of pem and key use the following command using openssl.

`openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout server.key -out server.pem`

Note that a self signed certificate will be rejected from opendht,
QNetworkAccessManager and other curl-like program by default. The following
changes should disable those checks.

```diff
// opendht/src/http.cpp void Request::connect
- conn_->set_ssl_verification(get_url().host, asio::ssl::verify_peer | asio::ssl::verify_fail_if_no_peer_cert);
+ conn_->set_ssl_verification(get_url().host, asio::ssl::verify_none);
```

```cpp
// jami-client-qt/src/app/networkmanager.cpp NetworkManager::NetworkManager
QSslConfiguration sslConfig = QSslConfiguration::defaultConfiguration();
sslConfig.setPeerVerifyMode(QSslSocket::VerifyNone);
QSslConfiguration::setDefaultConfiguration(sslConfig);
```

## Run with the debugger enabled

`java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=localhost:35000 -jar jams-server.jar 8080`

## Format java file

The code was formatted using
[google-java-format](https://github.com/google/google-java-format)
using the following command:

`google-java-format -i -a --skip-reflowing-long-strings --skip-javadoc-formatting **/*.java `

## Generate documentation

To generate the documentation you will need `apidoc` installed on your system.
This can be completed by running `npm install -g apidoc`, if for some reason
that does not work, you can clone their project from : https://github.com/apidoc/apidoc
and install it from source.

To build the documentation, enter the `jams-server` directory and simply run:

`apidoc -i src/ -o doc/`

You can then open `doc/index.html`. Click on 1.0.0 in the top right corner if the doc doesn't appear.

## Pre-commit hook

The `extras` folder contains a pre-commit hook that formats every js and java
file. To enable it, run:
```sh
cp extras/scripts/pre-commit .git/hooks
chmod +x .git/hooks/pre-commit
```

## Development Docker container

A development environment with react hot reloading can be created using:
```sh
docker build -f Dockerfile -t jams:dev --target dev .
docker run -it -p 3000:3000 -p 8080:8080 -p 35000:35000 \
    -v $(pwd)/jams-react-client/src:/app/jams-react-client/src \
    -v $(pwd)/jams-react-client/public:/app/jams-react-client/public \
    --rm jams:dev
```

`setup_jams.sh` can be used to quickly do the initial setup.
The script creates user alice, bob, charlie and danny, all with the password "a",
and they all belong to the group "defaultGroup".
```sh
./extras/scripts/setup_jams.sh
```

Note: It is possible that after 15 minutes, the user's token expires, the server
will answer with a "You are not authentified" and forget to put the CORS
headers, thus the browser will refuse to read the response. In this case, you
will need to restart the server.

## Generate jams with Docker
The following commands will generate the userguide and the jars needed:
```sh
docker build -f Dockerfile -t jams:latest --target prod . \
    && CONTAINER=$(docker create jams:latest) \
    && docker cp $CONTAINER:/app/jams/. jams \
    && docker cp $CONTAINER:/app/versions.json . \
    && docker rm -v $CONTAINER \
    && cd jams \
    && java -jar jams-launcher.jar
```

## Run tests
```sh
mvn clean test

# to open the report files in the browser
for f in */target/site/jacoco/index.html ; do xdg-open $f ; done

# (optional) if the file doesn't open in your browser
TYPE=$(xdg-mime query filetype datastore/target/site/jacoco/index.html)
xdg-mime default firefox.desktop "$TYPE"
```

## Visualize the derby database
The IntelliJ Ultimate Edition Database view can help visualize the database schema.
Don't forget to launch jams locally at least once before proceeding.
1. Open this project in IntelliJ
2. View -> Tool Windows -> Database
3. Plus icon -> Data Source from Path
4. Select the jami-jams/jams/jams folder
5. Select the Apache Derby (Embedded) driver
6. Select No auth, click Ok, refresh the database window and the tables should appear!

## About jams-server/src/main/java/net/jami/jams/server/filters
The files in the `filters` folder are prefixed "A", "B", "C" and "D" so that the
order of execution of the filters are right (jakarta registers filters in
alphabetical order).

## Notes about jams-server
- /api/admin is the route for all admins actions, it gives read and write permissions to all users' data
- /api/auth is the route for **authenticated** users, it lets you read all
users' data and edit your own profile. This route has nothing to do with authentication
- /api/login is the route to authenticate users
- /api/install is the routes used to setup jams initially, once the initial setup
is done its endpoints tells the client that the server is already installed
