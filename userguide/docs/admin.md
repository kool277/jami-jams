## Troubleshooting and resetting

If you ever need to restart from 0 (i.e. reset everything and drop existing data) you can do so by deleting the following files in the distribution folder (<your project root folder>/jams):    <pre>
<b>The internal jams folder: <your project root folder>/jams/jams
derby.log
oauth.key
oauth.pub
config.json
</b></pre>


This will reset the server to its original state and you will be able to run the configuration wizard again. Before performing this operation, please make sure to shutdown the server.

# Admin Guide

By default JAMS runs an embedded tomcat server visible on port 8080, however this is not practical for many reasons. This guide is designed
to help you setup Jams to run in a production environment.


## JAMS & Nginx

It is generally not recommended to expose JAMS directly to the outside world and while it is required to run JAMS in SSL mode, we usually
recommend users to place it behind Nginx or a similar web server which proxies requests between the outside world and Jams.

The following is an example map of how you could configure JAMS behind Nginx (the process would be similar if you wanted to use any other type of proxying solution):

<p align="center">
    <img src="./img/map.png" alt="Create an admin account" style="height:250px;width:600px"/>
</p>

The IP 10.10.0.1 is random, and should be seen as an example.


Typically you would add a new site called ``jams-site.conf`` to your nginx configurations which would contain the following entries if you wanted to place an SSL certificate at the Nginx level:    <pre>
<b>server {
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
}</b></pre>

This is the preferred setup method by most admins, as local traffic is usually ran unencrypted since it is usually either inter-VM connection, a VLAN or another dedicated link.


## Running JAMS as a Linux Service

Running JAMS as a Linux Service is fairly straightforward with systemd - you simply created a service unit file with the following structure:    <pre>
<b>[Unit]
Description=JAMS Server

[Service]
Type=simple
WorkingDirectory=[DIRECTORY WHERE JAMS WAS UNZIPPED]
ExecStart=/usr/bin/java -jar [DIRECTORY WHERE JAMS WAS UNZIPPED]/jams-launcher.jar PORT SSL_CERTIFICATE SSL_CERTIFICATE_KEY

[Install]
WantedBy=multi-user.target
</b></pre>

The parameters PORT, SSL_CERTIFICATE and SSL_CERTIFICATE_KEY are optional (however, PORT can be used alone whereas the SSL_CERTIFICATE comes in pair with SSL_CERTIFICATE_KEY)

## Running JAMS as Windows Service

# Download and install JAMS

Visit https://jami.net/services/ and downalod JAMS.

Extract JAMS to c:\jams

# Download and install JDK 11 

Download JDK 11 from https://www.oracle.com/java/technologies/javase-jdk11-downloads.html (choose the conresponding architecture of your VM)

Install it using the install wizard.

# Download openssl to generate a key and a certificate

Download OpenSSL from https://kb.firedaemon.com/support/solutions/articles/4000121705 (or choose another source https://wiki.openssl.org/index.php/Binaries)

Once downloaded extract it to c:\openssl then create a folder bin inside c:\openssl\bin

Create a new file inside bin named openssl.cnf (make sure that the file extension is .cnd and not .cnd.txt) and copy past the following default configuration http://www.flatmtn.com/article/setting-openssl-create-certificates.html

#
# OpenSSL configuration file.
#
 
# Establish working directory.
 
dir					= .
 
[ ca ]
default_ca				= CA_default
 
[ CA_default ]
serial					= $dir/serial
database				= $dir/certindex.txt
new_certs_dir				= $dir/certs
certificate				= $dir/cacert.pem
private_key				= $dir/private/cakey.pem
default_days				= 365
default_md				= md5
preserve				= no
email_in_dn				= no
nameopt					= default_ca
certopt					= default_ca
policy					= policy_match
 
[ policy_match ]
countryName				= match
stateOrProvinceName			= match
organizationName			= match
organizationalUnitName			= optional
commonName				= supplied
emailAddress				= optional
 
[ req ]
default_bits				= 1024			# Size of keys
default_keyfile				= key.pem		# name of generated keys
default_md				= md5				# message digest algorithm
string_mask				= nombstr		# permitted characters
distinguished_name			= req_distinguished_name
req_extensions				= v3_req
 
[ req_distinguished_name ]
# Variable name				Prompt string
#-------------------------	  ----------------------------------
0.organizationName			= Organization Name (company)
organizationalUnitName			= Organizational Unit Name (department, division)
emailAddress				= Email Address
emailAddress_max			= 40
localityName				= Locality Name (city, district)
stateOrProvinceName			= State or Province Name (full name)
countryName				= Country Name (2 letter code)
countryName_min				= 2
countryName_max				= 2
commonName				= Common Name (hostname, IP, or your name)
commonName_max				= 64
 
# Default values for the above, for consistency and less typing.
# Variable name				Value
#------------------------	  ------------------------------
0.organizationName_default		= My Company
localityName_default			= My Town
stateOrProvinceName_default		= State or Providence
countryName_default			= US
 
[ v3_ca ]
basicConstraints			= CA:TRUE
subjectKeyIdentifier			= hash
authorityKeyIdentifier			= keyid:always,issuer:always
 
[ v3_req ]
basicConstraints			= CA:FALSE
subjectKeyIdentifier			= hash

# Add OpenSSL to Sytem Environment variables
Go to Edit the system environment variables -> Environment Variables, then in System variables edit Path and add c:\openssl\

# Configure OpenSSL
Execute the following command to set the path to OpenSSL configuration.

set OPENSSL_CONF=c:\openssl\bin\openssl.cnf

Open the command prompt and cd c:\jams ans generate the Key and Certificate:

openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout server.key -out server.pem

Follow the wizard.

Once the key and certificate are generated execute the dir command you should see an output like this:

c:\jams>dir
 Volume in drive C has no label.
 Volume Serial Number is BC94-9EF2

 Directory of c:\jams

2020-11-10  12:38 PM    <DIR>          .
2020-11-10  12:38 PM    <DIR>          ..
2020-10-22  10:56 AM         5,186,016 jams-launcher.jar
2020-10-22  10:56 AM        33,413,882 jams-server.jar
2020-11-10  11:53 AM    <DIR>          libs
2020-11-10  12:34 PM             1,732 server.key
2020-11-10  12:38 PM             1,336 server.pem
2020-10-22  04:05 PM         2,047,932 userguide.pdf
               5 File(s)     40,650,898 bytes
               3 Dir(s)  93,365,936,128 bytes free

Now execute the following command tot start JAMS

java -jar jams-launcher.jar PORT_NUMBER (eg. 8443 or 443) server.pem server.key

Open a navigator on the server and visite https://localhost:443 or https://localhost:8443 to validate that it's working.

Click CTRL + C to close the application

# Expose your localhost to the internet

Click on Windows ans search for Windows Defender Firewall with Advanced Security.

Right click on Inbound Rules and click on New Rule...

Select Port click next and specify the port you want to use example 443 or 8443.

Click next and select Allow the connection and click next.

Leave all of Domain Private and Public select and click next.

Name you Rule JAMS Inbound and click Finish

Now right click on Outbound Rules and click on New Rule...

Select Port click next and specify the port you want to use example 443 or 8443.

Click next and select Allow the connection and click next.

Leave all of Domain Private and Public select and click next.

Name you Rule JAMS Outbound and click Finish.

You are all set. You can now visit you application trought the server domain name or ip address on port 443 or 8443.

# Create a JAMS Windows Service (Embed Tomcat Server Windows Service) to start JAMS with the server

In order to create a JAMS Windows Service you can use the tool NSSM provided on http://nssm.cc/download (https://github.com/kirillkovalenko/nssm)

Once downloaded open a command prompt and change directory to nssm-2.24\win64 then execute:

nssm.exe install JAMS

A GUI interface will open.

In the Path field specify the path to the Java executable example "C:\Program Files\Common Files\Oracle\Java\javapath\java.exe".

In the Startup directory put the "C:\jams" installation folder path.

In the last field Arguments add the following arguments:

-classpath "c:\jams" -jar jams-launcher.jar PORT_NUMBER server.pem server.key

where PORT_NUMBER is the port number you want to use to serve the application example 443 or 8443

Now your JAMS application will start with the server.

Source: https://medium.com/@lk.snatch/jar-file-as-windows-service-bonus-jar-to-exe-1b7b179053e4
