#### JAMS (Jami Account Management Server)

##### Requirements

- JDK 11+
- maven

##### Building from source

Clone the contents of this repository and run

```
cd jams-react-client
npm install
npm start
cd ..
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

##### How to generate server.pem and server.key pair

In order to generate a pair of pem and key use the following command using openssl

`openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout server.key -out server.pem`

To generate the documentation you will need `apidoc` installed on your system.
This can be completed by running `npm install -g apidoc`, if for some reason
that does not work, you can clone their project from : https://github.com/apidoc/apidoc
and install it from source.

To build the documentation, change enter the `jams-server` directory and simply run:

`apidoc -i src/ -o doc/`

You can then open `doc/index.html`. Click on 1.0.0 in the top right corner if the doc doesn't appear.

##### Building the Docker container

You can build the docker container using:

```
docker build -f Dockerfile -t jams:latest .
```

To run the docker container (assuming you want to have it on port 8080 locally):

```
docker run -p 8080:8080 --rm jams:latest
```
