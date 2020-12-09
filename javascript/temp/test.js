const { execFile, execSync, exec, spawn } = require("child_process");
const { dockerCommand } = require("docker-cli-js");
const first = "one";
const second = "two";
// execFile(
//   `./test.sh`,
//   [`${first} ${second}`],
//   { shell: true },
//   function (error, stdout, stderr) {
//     if (error !== null) {
//       console.log(error);
//       // return res.status(500).json({ message: error });
//     } else {
//       console.log("======> stdout: " + stdout);
//       console.log("======> stderr: " + stderr);
//     }
//   }
// );

const CHANNEL_NAME = "channel_1";
// const FIRST_PEER = `peer0.org1.example.com`;
// const FIRST_PEER_PORT = 7051;
// const SECOND_PEER = `peer0.org2.example.com`;
// const SECOND_PEER_PORT = 9051;
// const CONFIGTX_PATH = `/home/ubuntu/hlf_1.4/1.4.7/fabric-samples`;
// const FABRIC_CFG_PATH = `${CONFIGTX_PATH}/first-network/`;
// const CHANNEL_BLOCK_NAME = `${CHANNEL_NAME}.block`;

// const CC_RUNTIME_LANGUAGE = `node`;
// const CC_SRC_PATH = `/opt/gopath/src/github.com/chaincode/fabcar/javascript`;
// const CONFIG_ROOT = `/opt/gopath/src/github.com/hyperledger/fabric/peer`;
// const ORG1_MSPCONFIGPATH = `${CONFIG_ROOT}/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp`;
// const ORG1_TLS_ROOTCERT_FILE = `${CONFIG_ROOT}/crypto/peerOrganizations/org1.example.com/peers/${FIRST_PEER}/tls/ca.crt`;
// const ORG2_MSPCONFIGPATH = `${CONFIG_ROOT}/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp`;
// const ORG2_TLS_ROOTCERT_FILE = `${CONFIG_ROOT}/crypto/peerOrganizations/org2.example.com/peers/${SECOND_PEER}/tls/ca.crt`;
// const ORDERER_TLS_ROOTCERT_FILE = `${CONFIG_ROOT}/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem`;
// const CA_PATH = `/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem`;
//./create_ch_1.sh [`${CHANNEL_NAME}`],
// exec(`./test.sh arg1 arg2`, function (error, stdout, stderr) {
//   if (error !== null) {
//     console.log(error);
//     // return res.status(500).json({ message: error });
//   } else {
//     console.log("======> stdout: " + stdout);
//     console.log("======> stderr: " + stderr);
//   }
// });

const cmd = spawn(`./test.sh`, [`arg1`, `arg2`], { shell: true });
cmd.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
});
cmd.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
});

cmd.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
});

// const options = {
//     machineName: cli, // uses local docker
//     currentWorkingDirectory: null, // uses current working directory
//     echo: true, // echo command output to stdout/stderr
// };
const cb = async () => {
    try {
        const data = await dockerCommand('exec -it cli bash -c "echo hello"');
        return data;
    } catch (error) {
        console.log("error is:", error);
    }
};
console.log(cb());
// execSync(
//   `${CONFIGTX_PATH}/bin/configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ${FABRIC_CFG_PATH}/channel-artifacts/Org1MSPanchors.tx -channelID ${CHANNEL_NAME} -asOrg Org1MSP`,
//   function (error, stdout, stderr) {
//     if (error !== null) {
//       console.log(error);
//       // return res.status(500).json({ message: error });
//     } else {
//       console.log("======> stdout: " + stdout);
//       console.log("======> stderr: " + stderr);
//     }
//   }
// );

// execSync(
//   `${CONFIGTX_PATH}/bin/configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ${FABRIC_CFG_PATH}/channel-artifacts/Org2MSPanchors.tx -channelID ${CHANNEL_NAME} -asOrg Org2MSP`,
//   function (error, stdout, stderr) {
//     if (error !== null) {
//       console.log(error);
//       // return res.status(500).json({ message: error });
//     } else {
//       console.log("======> stdout: " + stdout);
//       console.log("======> stderr: " + stderr);
//     }
//   }
// );

// execSync(
//   `docker exec -e CORE_PEER_MSPCONFIGPATH=${ORG1_MSPCONFIGPATH} -e CORE_PEER_ADDRESS=${FIRST_PEER}:${FIRST_PEER_PORT} -e CORE_PEER_LOCALMSPID="Org1MSP" -e CORE_PEER_TLS_ROOTCERT_FILE=${ORG1_TLS_ROOTCERT_FILE} cli peer channel create -o orderer.example.com:7050 -c ${CHANNEL_NAME} -f ./channel-artifacts/${CHANNEL_NAME}.tx --tls --cafile ${CA_PATH}`,
//   function (error, stdout, stderr) {
//     if (error !== null) {
//       console.log(error);
//       // return res.status(500).json({ message: error });
//     } else {
//       console.log("======> stdout: " + stdout);
//       console.log("======> stderr: " + stderr);
//     }
//   }
// );

// execSync(
//   `docker exec -it \
//     -e CORE_PEER_MSPCONFIGPATH=${ORG1_MSPCONFIGPATH} \
//     -e CORE_PEER_ADDRESS=${FIRST_PEER}:${FIRST_PEER_PORT} \
//     -e CORE_PEER_LOCALMSPID="Org1MSP" \
//     -e CORE_PEER_TLS_ROOTCERT_FILE=${ORG1_TLS_ROOTCERT_FILE} \
//     cli peer channel join -b ${CHANNEL_BLOCK_NAME}`,
//   function (error, stdout, stderr) {
//     if (error !== null) {
//       console.log(error);
//       // return res.status(500).json({ message: error });
//     } else {
//       console.log("======> stdout: " + stdout);
//       console.log("======> stderr: " + stderr);
//     }
//   }
// );

// execSync(
//   `docker exec -it \
//     -e CORE_PEER_MSPCONFIGPATH=${ORG2_MSPCONFIGPATH} \
//     -e CORE_PEER_ADDRESS=${SECOND_PEER}:${SECOND_PEER_PORT} \
//     -e CORE_PEER_LOCALMSPID="Org2MSP" \
//     -e CORE_PEER_TLS_ROOTCERT_FILE=${ORG2_TLS_ROOTCERT_FILE} \
//     cli peer channel join -b ${CHANNEL_BLOCK_NAME}`,
//   function (error, stdout, stderr) {
//     if (error !== null) {
//       console.log(error);
//       // return res.status(500).json({ message: error });
//     } else {
//       console.log("======> stdout: " + stdout);
//       console.log("======> stderr: " + stderr);
//     }
//   }
// );

// execSync(
//   `docker exec -it \
//     -e CORE_PEER_MSPCONFIGPATH=${ORG1_MSPCONFIGPATH} \
//     -e CORE_PEER_ADDRESS=${FIRST_PEER}:${FIRST_PEER_PORT} \
//     -e CORE_PEER_LOCALMSPID="Org1MSP" \
//     -e CORE_PEER_TLS_ROOTCERT_FILE=${ORG1_TLS_ROOTCERT_FILE} \
//     cli \
//     peer channel update \
//         -o orderer.example.com:7050 \
//         -c ${CHANNEL_NAME} \
//         -f ./channel-artifacts/Org1MSPanchors.tx \
//         --tls \
//         --cafile ${CA_PATH}`,
//   function (error, stdout, stderr) {
//     if (error !== null) {
//       console.log(error);
//       // return res.status(500).json({ message: error });
//     } else {
//       console.log("======> stdout: " + stdout);
//       console.log("======> stderr: " + stderr);
//     }
//   }
// );

// execSync(
//   `docker exec -it \
//     -e CORE_PEER_MSPCONFIGPATH=${ORG2_MSPCONFIGPATH} \
//     -e CORE_PEER_ADDRESS=${SECOND_PEER}:${SECOND_PEER_PORT} \
//     -e CORE_PEER_LOCALMSPID="Org2MSP" \
//     -e CORE_PEER_TLS_ROOTCERT_FILE=${ORG2_TLS_ROOTCERT_FILE} \
//     cli \
//     peer channel update \
//         -o orderer.example.com:7050 \
//         -c ${CHANNEL_NAME} \
//         -f ./channel-artifacts/Org2MSPanchors.tx \
//         --tls \
//         --cafile ${CA_PATH}`,
//   function (error, stdout, stderr) {
//     if (error !== null) {
//       console.log(error);
//       // return res.status(500).json({ message: error });
//     } else {
//       console.log("======> stdout: " + stdout);
//       console.log("======> stderr: " + stderr);
//     }
//   }
// );

// execSync(
//   `docker exec -it \
// -e CORE_PEER_MSPCONFIGPATH=${ORG1_MSPCONFIGPATH} \
// -e CORE_PEER_ADDRESS=${FIRST_PEER}:${FIRST_PEER_PORT} \
// -e CORE_PEER_LOCALMSPID="Org1MSP" \
// -e CORE_PEER_TLS_ROOTCERT_FILE=${ORG1_TLS_ROOTCERT_FILE} \
// cli peer channel list`,
//   function (error, stdout, stderr) {
//     if (error !== null) {
//       console.log(error);
//       // return res.status(500).json({ message: error });
//     } else {
//       console.log("======> stdout: " + stdout);
//       console.log("======> stderr: " + stderr);
//     }
//   }
// );

// execSync(
//   `docker exec -it \
// -e CORE_PEER_MSPCONFIGPATH=${ORG2_MSPCONFIGPATH} \
// -e CORE_PEER_ADDRESS=${SECOND_PEER}:${SECOND_PEER_PORT} \
// -e CORE_PEER_LOCALMSPID="Org2MSP" \
// -e CORE_PEER_TLS_ROOTCERT_FILE=${ORG2_TLS_ROOTCERT_FILE} \
// cli peer channel list`,
//   function (error, stdout, stderr) {
//     if (error !== null) {
//       console.log(error);
//       // return res.status(500).json({ message: error });
//     } else {
//       console.log("======> stdout: " + stdout);
//       console.log("======> stderr: " + stderr);
//     }
//   }
// );
