#!/bin/bash
# Exit on first error
set -e

# don't rewrite paths for Windows Git Bash users



# clean the keystore
rm -rf ./hfc-key-store

# launch network; create channel and join peer to channel
cd ../first-network
echo y | ./byfn.sh down
echo y | ./byfn.sh up -a -n -s couchdb



