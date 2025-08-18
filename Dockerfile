FROM maven:3.9.11-eclipse-temurin-21-alpine as build
RUN apk update && apk add --no-cache python3 npm

WORKDIR /app/jams-react-client
COPY jams-react-client/package*.json ./
RUN npm install

WORKDIR /app
COPY pom.xml .
COPY ad-connector/pom.xml ad-connector/pom.xml
COPY authentication-module/pom.xml authentication-module/pom.xml
COPY datastore/pom.xml datastore/pom.xml
COPY jami-dht/pom.xml jami-dht/pom.xml
COPY jami-nameserver/pom.xml jami-nameserver/pom.xml
COPY jams-ca/pom.xml jams-ca/pom.xml
COPY jams-common/pom.xml jams-common/pom.xml
COPY jams-launcher/pom.xml jams-launcher/pom.xml
COPY ldap-connector/pom.xml ldap-connector/pom.xml
COPY jams-server/pom.xml jams-server/pom.xml

# RUN mvn verify --fail-never
# RUN mvn dependency:resolve --fail-never
# RUN mvn dependency:go-offline --fail-never -am
RUN mvn install -pl ad-connector,authentication-module,datastore,jami-dht,jami-nameserver,jams-ca,jams-common,jams-launcher,ldap-connector,jams-server -am -DskipTests

FROM build as dev
COPY . .
WORKDIR /app
RUN mkdir -p /app/jams-server/src/main/resources/webapp \
    && echo '<h1>Dev build, this is a placeholder index.html. Please connect to <a href="http://localhost:3000">localhost:3000</a> instead</h1>' \
    > /app/jams-server/src/main/resources/webapp/index.html
RUN mvn package
WORKDIR /app/jams
EXPOSE 3000 8080 35000
ENV JAVA_TOOL_OPTIONS -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:35000
CMD java -jar jams-server.jar 8080 \
    & npm start --prefix ../jams-react-client

FROM build as prod
WORKDIR /app/jams-react-client
COPY jams-react-client .
RUN npm run build
WORKDIR /app
COPY . .
RUN mkdir -p jams-server/src/main/resources/webapp \
    && mv jams-react-client/build/* jams-server/src/main/resources/webapp
RUN mvn package

ENV JAMS_VERSION=3.8
RUN python3 generate-versions.py $JAMS_VERSION

RUN ./build-doc.sh
WORKDIR /app/jams
CMD ["java", "-jar", "jams-launcher.jar"]
