/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { FileSystemWallet, Gateway } = require("fabric-network");
// const path = require("path");
const { getCCP, getWalletPath } = require("../common_lib/helper.js");

async function queryData(USER_NAME, CHANNEL_NAME, ORG_NAME, ID) {
    try {
        // const MSPID = await getMSPID(ORG_NAME);
        console.log("Input Args: ORG_NAME", ORG_NAME);
        const ccpPath = await getCCP(ORG_NAME);
        const walletPath = await getWalletPath(ORG_NAME);
        // const affiliation = await getAffiliation(ORG_NAME);
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(USER_NAME);
        // console.log(`==> userExists: ${userExists}`);
        if (!userExists) {
            console.log(
                `An identity for the user ${USER_NAME} does not exist in the wallet`
            );
            console.log("Run the registerUser.js application before retrying");
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, {
            wallet,
            identity: USER_NAME,
            discovery: { enabled: true, asLocalhost: true },
        });
        // console.log(`==> connected to the gateway`);
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(CHANNEL_NAME);
        // console.log(`==> connected to channel ${CHANNEL_NAME}`);
        // Get the contract from the network.
        const contract = network.getContract("ehr");
        // console.log(`==> got the contract ehr`);
        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        const result = await contract.evaluateTransaction("queryData");
        // console.log(
        //     `Recod for ${USER_NAME} , ${ORG_NAME} , ${CHANNEL_NAME}, result is: ${result.toString()}`
        // );
        const returnValue = await JSON.parse(result);
        // console.log(await returnValue);
        return returnValue;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        // process.exit(1);
        return { status: "error", message: error };
    }
}

module.exports = { queryData };
