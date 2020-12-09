#!/bin/bash
#cd ~/hlf_1.4/1.4.7/fabric-samples/first-network/
CHANNEL_NAME=$1
export CHANNEL_NAME=$1
FIRST_PEER=peer0.org1.example.com
FIRST_PEER_PORT=7051
SECOND_PEER=peer0.org2.example.com
SECOND_PEER_PORT=9051



export CONFIGTX_PATH=/home/ubuntu/hlf_1.4/1.4.7/fabric-samples
export FABRIC_CFG_PATH=${CONFIGTX_PATH}/first-network/
CHANNEL_BLOCK_NAME=${CHANNEL_NAME}.block 



CC_RUNTIME_LANGUAGE=node # chaincode runtime language is node.js
CC_SRC_PATH=/opt/gopath/src/github.com/chaincode/fabcar/javascript
CONFIG_ROOT=/opt/gopath/src/github.com/hyperledger/fabric/peer
ORG1_MSPCONFIGPATH=${CONFIG_ROOT}/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
ORG1_TLS_ROOTCERT_FILE=${CONFIG_ROOT}/crypto/peerOrganizations/org1.example.com/peers/${FIRST_PEER}/tls/ca.crt
ORG2_MSPCONFIGPATH=${CONFIG_ROOT}/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
ORG2_TLS_ROOTCERT_FILE=${CONFIG_ROOT}/crypto/peerOrganizations/org2.example.com/peers/${SECOND_PEER}/tls/ca.crt
ORDERER_TLS_ROOTCERT_FILE=${CONFIG_ROOT}/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
CA_PATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem


echo "############ Starting peer channel getinfo or list ################"
##### Enter CLI



docker exec -it \
    -e CORE_PEER_MSPCONFIGPATH=${ORG1_MSPCONFIGPATH} \
    -e CORE_PEER_ADDRESS=${FIRST_PEER}:${FIRST_PEER_PORT} \
    -e CORE_PEER_LOCALMSPID="Org1MSP" \
    -e CORE_PEER_TLS_ROOTCERT_FILE=${ORG1_TLS_ROOTCERT_FILE} \
    cli peer channel list #getinfo -c ${CHANNEL_NAME} #list


docker exec -it \
    -e CORE_PEER_MSPCONFIGPATH=${ORG2_MSPCONFIGPATH} \
    -e CORE_PEER_ADDRESS=${SECOND_PEER}:${SECOND_PEER_PORT} \
    -e CORE_PEER_LOCALMSPID="Org2MSP" \
    -e CORE_PEER_TLS_ROOTCERT_FILE=${ORG2_TLS_ROOTCERT_FILE} \
    cli peer channel list #getinfo -c ${CHANNEL_NAME} #list
echo "############  Done with peer channel getinfo or list"