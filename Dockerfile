FROM adoptopenjdk/openjdk11:jdk-11.0.2.9-alpine

WORKDIR /opt/jams
COPY jams/*.jar ./
COPY jams/libs libs/
ADD jams/libs libs/

EXPOSE 8080
ENTRYPOINT ["java","-jar","jams-launcher.jar"]
