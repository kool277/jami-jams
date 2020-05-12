import requests
import json

data = {}
data['username'] = "admin"
data['password'] = "abc123"

header = {}
header['Content-type'] = "application/json"

response = requests.put('http://localhost:8080/api/install/start',data=json.dumps(data),headers=header)
if response.status_code == 200:
    print("Succesfully created the administrative user!")
    token = json.loads(response.text)['token']
else:
    print("Could not create admin user, the test has failed!")


header['x-token'] = token

data = {}
data['fields'] = {}
data['fields']['commonName'] = "TEST CA"
data['fields']['country'] = "FR"
data['fields']['lifetime'] = 10000000

response = requests.post('http://localhost:8080/api/install/ca',data=json.dumps(data),headers=header)
if response.status_code == 200:
    print("Added CA parameters!")
else:
    print("Could not add CA parameters, the test has failed")


data = {}
data['type'] = "LDAP"
data['ldapSettings'] = {}
data['ldapSettings']['useStartTLS'] = True
data['ldapSettings']['realm'] = "savoirfairelinux"
data['ldapSettings']['baseDN'] = "ou=users,dc=savoirfairelinux,dc=net"
data['ldapSettings']['host'] = "ldap://annuaire.savoirfairelinux.com"
data['ldapSettings']['username'] = "cn=sipallow,ou=dsa,dc=savoirfairelinux,dc=net"
data['ldapSettings']['password'] = "Dewaaghei3Yo"
data['ldapSettings']['usernameField'] = "uid"
data['ldapSettings']['fieldMappings'] = {}
data['ldapSettings']['fieldMappings']['givenName'] = "FirstName"
data['ldapSettings']['fieldMappings']['sn'] = "LastName"
data['ldapSettings']['fieldMappings']['jpegPhoto'] = "ProfilePicture"
data['ldapSettings']['fieldMappings']['mail'] = "Email"
data['ldapSettings']['fieldMappings']['telephoneNumber'] = "PhoneNumber"
data['ldapSettings']['fieldMappings']['mobile'] = "MobileNumber"
data['ldapSettings']['fieldMappings']['facsimileTelephoneNumber'] = "FaxNumber"
data['ldapSettings']['fieldMappings']['extensionName'] = "PhoneNumberExtension"
data['ldapSettings']['fieldMappings']['o'] = "Organization"

response = requests.post('http://localhost:8080/api/install/auth',data=json.dumps(data),headers=header)
if response.status_code == 200:
    print("Added LDAP parameters!")
else:
    print("Could not add LDAP parameters, the test has failed")


data['serverDomain'] = "http://localhost"
data['signingAlgorithm'] = "SHA512WITHRSA"
data['crlLifetime'] = 100000
data['userLifetime'] = 100000
data['deviceLifetime'] = 100000

response = requests.post('http://localhost:8080/api/install/settings',data=json.dumps(data),headers=header)
if response.status_code == 200:
    print("Finished Installation Successfully!")
else:
    print("Could not finish installation")