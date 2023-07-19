# JAMS (Jami Account Management Server)

## Requirements

- JDK 11+
- maven

## Building from source

Clone the contents of this repository and run

```
mvn clean package
```

This will create a distribution folder called `jams` in the root folder. You can
then launch the server by running

```
cd jams
java -jar jams-launcher.jar
```

If you want to start the server with an SSL certificate and on a port different
from 8080, then run:

`java -jar jams-launcher.jar 8443 server.pem server.key`

Where the `pem` and `key` files are a pem encoded certificate and key.

## How to generate server.pem and server.key pair

In order to generate a pair of pem and key use the following command using openssl

`openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout server.key -out server.pem`

## Run with the debugger enabled

`java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=localhost:35000 -jar jams-server.jar 8080`

## Generate documentation

To generate the documentation you will need `apidoc` installed on your system.
This can be completed by running `npm install -g apidoc`, if for some reason
that does not work, you can clone their project from : https://github.com/apidoc/apidoc
and install it from source.

To build the documentation, enter the `jams-server` directory and simply run:

`apidoc -i src/ -o doc/`

You can then open `doc/index.html`. Click on 1.0.0 in the top right corner if the doc doesn't appear.

## Pre-commit hook

The `extras` folder contains a pre-commit hook that formats every js file in
`jams-react-client`. To enable it, run:
```sh
cp extras/scripts/pre-commit .git/hooks
chmod +x .git/hooks/pre-commit
```

## Development Docker container

A development environment with react hot reloading can be created using:
```
docker build -f Dockerfile -t jams:dev --target dev .
docker run -it -p 3000:3000 -p 8080:8080 -p 35000:35000 \
    -v $(pwd)/jams-react-client/src:/app/jams-react-client/src \
    -v $(pwd)/jams-react-client/public:/app/jams-react-client/public \
    --rm jams:dev
```

Note: It is possible that after 15 minutes, the user's token expires, the server
will answer with a "You are not authentified" and forget to put the CORS
headers, thus the browser will refuse to read the response. In this case, you
will need to restart the server.

## Generate jams with Docker
The following commands will generate the userguide and the jars needed:
```
docker build -f Dockerfile -t jams:latest --target prod . \
    && CONTAINER=$(docker create jams:latest) \
    && docker cp $CONTAINER:/app/jams/. jams \
    && docker cp $CONTAINER:/app/versions.json . \
    && docker rm -v $CONTAINER \
    && cd jams \
    && java -jar jams-launcher.jar
```

## About jams-server/src/main/java/net/jami/jams/server/filters
The files in the `filters` folder are prefixed "A", "B", "C" and "D" so that the
order of execution of the filters are right (jakarta registers filters in
alphabetical order).
