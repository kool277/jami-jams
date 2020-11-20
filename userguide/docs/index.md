# Getting Started

JAMS is a server application used to enroll Jami clients into an Enterprise context. Currently, JAMS supports 3 sources for user authentication: LDAP, Active Directory and an embedded database.

## Obtaining JAMS

The latest Beta build of JAMS can be downloaded at: ``https://git.jami.net/savoirfairelinux/jami-jams``

## System Requirements

* Windows, Linux or Mac OS operating system
* Java 11 or higher
* 4 GB RAM
* 1 CPU 

## JAMS Concepts

JAMS was built with security in mind, therefore it is intimately related to the X509 certificate management workflows. 

The central concepts which are used in JAMS are the Certification Authority (CA) and the Certificate Signing Requests (CSR).

In the JAMS paradigm, a device (Jami client) requests a certificate to the server then presents it to other devices to be recognized as a valid member of the organization. Therefore, JAMS must be provided with a certificate authority in order to work properly.

In order to be completely secure, JAMS does not generate certificates for devices, but instead issues certificates based on a certificate signing request sent to it by the device, therefore removing the need to send a private key over the wire.

The diagram below shows the entire process of how a device enrolls with JAMS:

<p align="center">
    <img src="../img/device_enroll.png" alt="Device Enrollement"  style="height:250px;width:400px" />
</p>

​    
## Getting Started

1. Download the latest version of JAMS from: <https://jami.net/services/>

2. Unpack the .tar file to a directory of your choice.

3. It is mandatory to run JAMS using a secure SSL connection. To request your SSL certificate files using OpenSSL and generate a pair of PEM and KEY, enter the following command:

``openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout server.key -out server.pem``

**Current limitation:** JAMS does not support reading encrypted private keys which require a password unlock.

4. Navigate to the directory where you have extracted the JAMS package and execute the following command:

```java -jar jams-launcher.jar PORT SSL_CERTIFICATE SSL_CERTIFICATE_KEY```

| Argument         | Details       |
| ------------- |-------------  |
| **PORT**      | The TCP port on which you want JAMS to listen for incoming connections |
| **SSL_CERTIFICATE**     | The location of the PEM-formatted SSL Certificate file   |
| **SSL_CERTIFICATE_KEY** | The location of the PEM-formatted key file which is used with the SSL Certificate file from above    |

<br/>
An example of the command would be: 

``java -jar jams-launcher 443 server.pem server.key``

Please note that any port above 1024 can be safely used to run JAMS.

## Step 1: create your admininistrator account

This account will have administrative control and the rights to manage your users and group of Jami users.

<p align="center">
    <img src="../img/step1.png" alt="Create an admin account" />
</p>


## Step 2: setup the Certification Authority

The second step is to define your Certification Authority. 

**Important:** a CA is not a server-side ssl certificate, it is a certificate which has the power to issue other certificates. Do not use the import option unless your company's security officer has issued you a CA certificate. Most commercially available certificates (i.e. those issued by godaddy, letsencrypt, etc... ) are not CA certificates. If you are an end-user we highly recommend you use to create a self-signed CA option as providing an incorrect certificate type will lead to a non-functional server.

<p align="center">
    <img src="../img/step2-1.png" alt="Create an admin account" />
    <img src="../img/step2-2.png" alt="Create an admin account" />
</p>


This certificate will be used to sign the enrollement requests which come from Jami devices. If you are not familiar with the X509 standard, we highly recommend you read the following
articles to get familiar with the processes and practices which surround it:

<https://www.securew2.com/blog/public-key-infrastructure-explained/>
<https://cheapsslsecurity.com/blog/understanding-the-role-of-certificate-authorities-in-pki/> 

## Step 3: setup the user database

JAMS supports 3 different sources for the authentication of users:

* LDAP-compatible directory (such as OpenLDAP)
* Microsoft Active Directory
* Local embedded database

<br/>

### Option 1: LDAP authentication

If your company provides you with LDAP directory for user management, you will need to know its access information and a automated account which has read-only rights to do use look-ups.

<p align="center">
    <img src="../img/ldap.png" />
</p>

Your admin should provide you most of this information but we do provide a detailed overview over each field in case you need some extra help:


| Field         | Details       |
| ------------- |-------------  |
| **Use StartTLS**      | Your LDAP server can be configured to use either TLS/STARTTLS or PLAIN sockets, if STARTTLS is used you should mark this as true |
| **Server Address**     | The address of your server with respect to the JAMS server, your LDAP does not need to be publicly accessible but should be accessible to JAMS. You should have either ``ldap://`` or ``ldaps://`` preceding the address.      |
| **Port** | The port on which the LDAP server is listening for requests (usually 389 for PLAIN/STARTTLS and 636 for SSL/TLS)      |
| **Administrator Username** | This is **NOT** the LDAP's administration account credentials, but the credentials of the account which has Read permissions to the LDAP database in order to lookup users. The format is generally ``cn=bot,ou=robots,dc=domain,dc=org``     |
| **Password** | The password used by the account above.     |
| **BaseDN** | The base realm where the users accounts are located, in most cases it is ``ou=users,dc=company,dc=org``     |

<br/>

### Option 2: Microsoft Active Directory

If your company provides you with Active Directory for user management, you will need to know its access information and an automated account which has read-only rights to do use look-ups.


<p align="center">
    <img src="../img/ad.png" />
</p>

Your admin should provide you most of this information but we do provide a detailed overview over each field in case you need some extra help:

| Field         | Details       |
| ------------- |-------------  |
| **Port**      | The port on which Active Directory is listening (generally it is either 389 or 636) |
| **Host**     | The address of your server with respect to the JAMS server, your Active Directory does not need to be publicly accessible but should be accessible to JAMS. |
| **Administrator Username** | This is **NOT** the Active Directory's administration account credentials, but the credentials of the account which has Read permissions to the Active Directory database in order to lookup users. The format is generally ``cn=bot,ou=robots,dc=domain,dc=net``     |
| **Password** | The password used by the account above.     |
| **Use SSL** | Whenever this server uses SSL for data transmission    |
| **Domain Name** | This is the legacy-formatted Windows Domain Name (i.e. ``WINDOMAIN``)     |

<br/>

### Option 3: local embedded database

The local database does not require any additional configuration, everything in the process is automated. This option allows you to create Jami users on the fly directly from the JAMS interface.

<p align="center">
    <img src="../img/local.png" />
</p>

**Advanced settings:** by default, the option "Use public nameserver" is disabled. Usernames of your Jami users will not be stored on the public Jami nameserver and your users will only be able to communicate with users from your organization.

If you want your users to be searchable by external users and allow them to communicate with any Jami users, and not only the one from your organization, enable this option,

## Step 4: setup the server parameters

<p align="center">
    <img src="../img/step4.png" />
</p>

| Parameter         | Details       |
| ------------- |-------------  |
| **CORS Domain Name**      | The domain on which the JAMS client and administration UI will be running. |
| **Certificate Revocation List Lifetime**     | The frequency at which the CRL is updated in memory |
| **Device Lifetime** | How long a device's certificate is valid before being considered stale and requiring re-enrollement      |
| **User Account Lifetime** | How long a user account is valid before being considered stale and requiring re-enrollement  |


**Important** The *CORS Domain Name* corresponds to the web address used to access the Web UI. By default, it is set to the same URL as the one where you deploy JAMS. Only set a different URL if the Web UI has a different URL to the one where JAMS is deployed.

<br/>

Click on "Set Server Parameters" to finalize the configuration.
You will be redirected to the JAMS interface.

<p align="center">
    <img src="../img/jams-dashboard.png" />
</p>

If you have configured JAMS with your LDAP or Active Directory, the list of users should of your organization shoud be visible in JAMS. If you have selected the local embedded database, you can now start creating new users by clicking on "Create User"
