FROM maven:3.9.2-eclipse-temurin-11-alpine as build
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
RUN mvn dependency:go-offline --fail-never

COPY . .
# RUN mvn clean package
RUN mvn package

FROM adoptopenjdk/openjdk11:jdk-11.0.2.9-alpine
WORKDIR /app
COPY --from=build /app/jams .
EXPOSE 8080
ENTRYPOINT ["java","-jar","jams-launcher.jar"]
