# Admin Guide

By default Jams runs an embedded tomcat server visible on port 8080, however this is not practical for many reasons. This guide is designed
to help you setup Jams to run in a production environment.


## Jams & Nginx

It is generally not recommended to expose Jams directly to the outside world and while it is possible to run Jams in SSL mode, we usually
recommend users to place it behind Nginx or a similar web server which proxies requests between the outside world and Jams.

The following is an example map of how you could configure JAMS behind Nginx (the process would be similar if you wanted to use any other type of proxying solution):

<p align="center">
    <img src="../img/map.png" alt="Create an admin account" style="height:250px;width:600px"/>
</p>

The IP 10.10.0.1 is random, and should be seen as an example.


Typically you would add a new site called ``jams-site.conf`` to your nginx configurations which would contain the following entries if you wanted to place an SSL certificate at the Nginx level:


```
server {
        listen 443 ssl;
        listen [::]:443 ssl;
        ssl on;
    	ssl_certificate /etc/certificates/mycertificate.pem
    	ssl_certificate_key /etc/certificates/mycertificatekey.pem
        client_max_body_size 100M;
        server_name jams.mycompany.com;
        location / {
                proxy_pass              http://10.10.0.1:8080/;
                proxy_set_header        X-Real-IP  $remote_addr;
                proxy_set_header        Host $http_host;
        }
}
```

This is the preferred setup method by most admins, as local traffic is usually ran unencrypted since it is usually either inter-VM connection, a VLAN or another dedicated link.

## Running Jams with SSL

If necessary it is possible to run Jams with SSL. In this case, you need to overload the command-line arguments when starting the server.

```java -jar jams-launcher.jar PORT SSL_CERTIFICATE SSL_CERTIFICATE_KEY```

| Argument         | Details       |
| ------------- |-------------  |
| **PORT**      | The TCP port on which you want Jams to listen for incoming connections |
| **SSL_CERTIFICATE**     | The location of the PEM-formatted SSL Certificate file   |
| **SSL_CERTIFICATE_KEY** | The location of the PEM-formatted key file which is used with the SSL Certificate file from above    |


An example of the command would be: ```java -jar jams-launcher.jar 8443 /opt/mycert.pem /opt/mycertkey.pem```


<span style="color:red">**Current Limitation Warning: Jams does not support reading encrypted private keys which require a password unlock.**</span> 

There are only two possible cases when you would want to run Jams with SSL - we do not recommend this method:

1.	Your local traffic is exposed to many actors (employees, contractors) and there is no possibility to isolate it
2.	You want to expose Jams directly to the external world because proxying is not an option


## Running Jams as a Linux Service

Running Jams as a Linux Service is fairly straightforward with systemd - you simply created a service unit file with the following structure:

```
[Unit]
Description=JAMS Server

[Service]
Type=simple
WorkingDirectory=[DIRECTORY WHERE JAMS WAS UNZIPPED]
ExecStart=/usr/bin/java -jar [DIRECTORY WHERE JAMS WAS UNZIPPED]/jams-launcher.jar PORT SSL_CERTIFICATE SSL_CERTIFICATE_KEY

[Install]
WantedBy=multi-user.target
```

The parameters PORT, SSL_CERTIFICATE and SSL_CERTIFICATE_KEY are optional (however, PORT can be used alone whereas the SSL_CERTIFICATE comes in pair with SSL_CERTIFICATE_KEY)

## Running Jams as a Windows Service

In progress.