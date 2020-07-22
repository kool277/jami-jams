import json
import sys
import hashlib
import os

os.chdir("..")

className = sys.argv[1]
version = sys.argv[2]
try:
    filename = sys.argv[3].split("/")[1]
except:
    filename = sys.argv[3]

try:
    f = open("versions.json", "r")
    map = json.loads(f.read())
except:
    map = {}
map[className] = {}
map[className]['version'] = version
map[className]['filename'] = filename
md5_hash = hashlib.md5()
a_file = open("jams/" + sys.argv[3], "rb")
content = a_file.read()
md5_hash.update(content)
digest = md5_hash.hexdigest()
map[className]['md5'] = digest
f = open("versions.json", "w")
f.write(json.dumps(map,indent=4))
f.close()

