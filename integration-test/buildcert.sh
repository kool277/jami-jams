openssl req -x509 -newkey rsa:4096 -days 3650 -nodes -keyout user.key -out user.crt -subj "/CN=fsidokhine"
openssl pkcs12 -export -out user.pfx -inkey user.key -in user.crt
curl -d -k -v -X POST "https://localhost:8080/api/auth/login" -E user.pfx --pass abc123
