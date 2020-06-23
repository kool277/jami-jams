#### JAMS (Jami Account Management Server)

##### Requirements

* JDK 11+
* maven

##### Building from source

Clone the contents of this repository and run

```
mvn clean packge
```

This will create a distribution folder called ``jams`` in the root folder. You can
then launch the server by running

```java -jar jams-launcher```

If you want to start the server with an SSL certificate and on a port different
from 8080, then run:

```java -jar jams-launcher 8443 server.pem server.key```

Where the ``pem`` and ``key`` files are a pem encoded certificate and key.

To generate the documentation you will need ``apidoc`` installed on your system.
This can be completed by running ``npm install -g apidoc``, if for some reason
that does not work, you can clone their project from : https://github.com/apidoc/apidoc 
and install it from source.

To build the documentation, change enter the ``jams-server`` directory and simply run:

```apidoc -i src/ -o doc/```

##### Building the Docker container

You can build the docker container using:

```
docker build -f Dockerfile -t jams:latest .
```

To run the docker container (assuming you want to have it on port 80 locally):

```
docker run -p 80:8080 --rm jams:latest
```

