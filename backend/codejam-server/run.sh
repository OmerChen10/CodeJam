#!/bin/bash

if [ -d "/etc/codejam/credentials/certs" ] && [ "$(ls -A /etc/codejam/credentials/certs)" ]; then
    echo "Adding certificates to the system (adding *.crt files only)"
    cp -r /etc/codejam/credentials/certs/* /usr/local/share/ca-certificates/
    update-ca-certificates
else
    echo "No certificates found in /etc/codejam/credentials/certs"
fi

if [ ! -e "/etc/codejam/persistent/storage" ]; then
    echo "Creating persistent storage directory"
    mkdir -p /etc/codejam/persistent/storage
fi

echo "Starting codejam-server"
python /app/src/__main__.py