import json
import requests
import urllib.parse

header = {}
header['Content-type'] = "application/json"

response = requests.post('http://localhost:8080/api/auth/login',data={"username":"fsidokhine","password":"mes87hesm97daa"})
if response.status_code == 200:
    token = json.loads(response.text)['access_token']

header = {}
header['Bearer'] = token


#Create two contacts
data = {}
data['uri'] = "jami://71828737748484"
data['displayName'] = "Felix"
response = requests.put("http://localhost:8080/api/auth/contacts",headers=header,data=json.dumps(data))
print(response.status_code)
print(response.text)

data = {}
data['uri'] = "jami://71828737748485"
data['displayName'] = "Adrien"
response = requests.put("http://localhost:8080/api/auth/contacts",headers=header,data=json.dumps(data))
print(response.status_code)
print(response.text)

#Get both contacts

response = requests.get("http://localhost:8080/api/auth/contacts",headers=header)
print(response.status_code)
print(response.text)

#Delete a contact
params = {'uri':'jami://71828737748485'}
p = urllib.parse.urlencode(params,safe='')
response = requests.delete("http://localhost:8080/api/auth/contacts?" + p,headers=header)
print(response.status_code)
print(response.text)
#
##Get contact
#
response = requests.get("http://localhost:8080/api/auth/contacts",headers=header)
print(response.status_code)
print(response.text)