/**
 * Copyright 2017 IBM All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an 'AS IS' BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
const fs = require("fs");
const path = require("path");
const {
    FileSystemWallet,
    Gateway,
    X509WalletMixin,
} = require("fabric-network");

const { getAffiliation, getCCP, getMSPID } = require("../common_lib/helper.js");
// let helper = require('./helper.js');
// let logger = helper.getLogger('Create-Channel');
//Attempt to send a request to the orderer with the sendTransaction method
const getWalletPath = async (ORG_NAME) => {
    let walletPath;
    if (ORG_NAME == "Org1") {
        walletPath = path.join(__dirname, "..", "org1-wallet");
    } else if (ORG_NAME == "Org2") {
        walletPath = path.join(__dirname, "..", "org2-wallet");
    } else return null;
    return walletPath;
};

const createChannel = async function (CHANNEL_NAME, ORG_NAME) {
    console.log("\n====== Creating Channel '" + CHANNEL_NAME + "' ======\n");
    try {
        const ccpPath = await getCCP(ORG_NAME);
        const walletPath = await getWalletPath(ORG_NAME);
        console.log(`Wallet path: ${walletPath}`);
        const wallet = new FileSystemWallet(walletPath);
        const channelConfigPath = path.resolve(
            __dirname,
            "..",
            "..",
            "..",
            `first-network/channel-artifacts/${CHANNEL_NAME}.tx`
        ); // "channelConfigPath":"../artifacts/channel/mychannel.tx"
        // console.log(`Wallet path: ${walletPath}`);

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, {
            wallet,
            identity: "admin",
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the CA client object from the gateway for interacting with the CA.
        const client = gateway.getClient();
        const adminIdentity = gateway.getCurrentIdentity();
        const chpath = path.resolve(
            "..",
            "..",
            "..",
            `first-network/channel-artifacts/${CHANNEL_NAME}.tx`
        );
        console.log("chpath :", chpath);
        let envelope = fs.readFileSync(chpath);
        // let adminKey = fs.readFileSync(
        //     path.join(
        //         __dirname,
        //         "..",
        //         "..",
        //         "..",
        //         "/first-network/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/pem.key"
        //     )
        // );
        // // ../../../first-network/channel-artifacts/
        // let adminCert = fs.readFileSync(
        //     path.join(
        //         __dirname,
        //         "..",
        //         "..",
        //         "..",
        //         "/first-network/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/admincerts/Admin@org1.example.com-cert.pem"
        //     )
        // );
        // client.setAdminSigningIdentity(
        //     adminKey.toString(),
        //     adminCert.toString(),
        //     "Org1MSP"
        // );
        // first setup the client for this org
        // let client = await helper.getClientForOrg(ORG_NAME);
        // console.log(
        //     'Successfully got the fabric client for the organization "%s"',
        //     ORG_NAME
        // );

        // read in the envelope for the channel config raw bytes
        // let envelope = fs.readFileSync(path.join(__dirname, channelConfigPath)); // path to "first-network/channel-artifacts/channel1.tx"
        // extract the channel config bytes from the envelope to be signed
        let channelConfig = client.extractChannelConfig(envelope);
        // console.log("====> channel config:", JSON.parse(channelConfig));
        //Acting as a client in the given organization provided with "ORG_NAME" param
        // sign the channel config bytes as "endorsement", this is required by
        // the orderer's channel creation policy
        // this will use the admin identity assigned to the client when the connection profile was loaded
        let signature = client.signChannelConfig(channelConfig);

        let request = {
            config: channelConfig,
            signatures: signature,
            name: CHANNEL_NAME,
            txId: client.newTransactionID(true), // get an admin based transactionID
        };

        // send to orderer
        const result = await client.createChannel(request);
        console.log(" result ::%j", result);
        if (result) {
            if (result.status === "SUCCESS") {
                console.log("Successfully created the channel.");
                const response = {
                    success: true,
                    message:
                        "Channel '" + CHANNEL_NAME + "' created Successfully",
                };
                return response;
            } else {
                console.log(
                    "Failed to create the channel. status:" +
                        result.status +
                        " reason:" +
                        result.info
                );
                const response = {
                    success: false,
                    message:
                        "Channel '" +
                        CHANNEL_NAME +
                        "' failed to create status:" +
                        result.status +
                        " reason:" +
                        result.info,
                };
                return response;
            }
        } else {
            console.log(
                "\n!!!!!!!!! Failed to create the channel '" +
                    CHANNEL_NAME +
                    "' !!!!!!!!!\n\n"
            );
            const response = {
                success: false,
                message: "Failed to create the channel '" + CHANNEL_NAME + "'",
            };
            return response;
        }
    } catch (err) {
        console.log(
            "Failed to initialize the channel: " + err.stack ? err.stack : err
        );
        throw new Error("Failed to initialize the channel: " + err.toString());
    }
};

// exports.createChannel = createChannel;

createChannel("testchannel0", "Org1");
