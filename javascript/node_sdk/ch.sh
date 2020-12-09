#!/bin/bash
#cd ~/hlf_1.4/1.4.7/fabric-samples/first-network/
echo " --------> Channel name: $1"
export CHANNEL_NAME=$1
CHANNEL_NAME=$1
FIRST_PEER=peer0.org1.example.com
FIRST_PEER_PORT=7051
SECOND_PEER=peer0.org2.example.com
SECOND_PEER_PORT=9051

export CONFIGTX_PATH=/home/ubuntu/hlf_1.4/1.4.7/fabric-samples
export FABRIC_CFG_PATH=${CONFIGTX_PATH}/first-network/
CHANNEL_BLOCK_NAME=${CHANNEL_NAME}.block 

${CONFIGTX_PATH}/bin/configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ${FABRIC_CFG_PATH}/channel-artifacts/${CHANNEL_NAME}.tx -channelID ${CHANNEL_NAME}
${CONFIGTX_PATH}/bin/configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ${FABRIC_CFG_PATH}/channel-artifacts/Org1MSPanchors.tx -channelID ${CHANNEL_NAME} -asOrg Org1MSP
${CONFIGTX_PATH}/bin/configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ${FABRIC_CFG_PATH}/channel-artifacts/Org2MSPanchors.tx -channelID ${CHANNEL_NAME} -asOrg Org2MSP
