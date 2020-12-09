/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { FileSystemWallet, Gateway } = require("fabric-network");
const path = require("path");
const { getCCP, getWalletPath } = require("../common_lib/helper.js");

async function changeFieldValueByDoctor(
    USER_NAME,
    CHANNEL_NAME,
    ORG_NAME,
    ID,
    FIELD_NAME,
    VALUE
) {
    try {
        // const USER_NAME='peerzero';
        // const CHANNEL_NAME= 'peerzerochannel';

        // const MSPID = await getMSPID(ORG_NAME);

        const ccpPath = await getCCP(ORG_NAME);
        const walletPath = await getWalletPath(ORG_NAME);
        // const affiliation = await getAffiliation(ORG_NAME);
        const wallet = new FileSystemWallet(walletPath);
        // console.log(`Wallet path: ${walletPath}`);

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

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(CHANNEL_NAME);

        // Get the contract from the network.
        const contract = network.getContract("ehr");

        // Submit the specified transaction.

        // await contract.submitTransaction(
        //     "changeFieldValue",
        //     "PATIENT0",
        //     "lastvisit",
        //     '["22-Mar-2020,"33-Sep-2020"]'
        // );

        await contract.submitTransaction(
            "changeFieldValueByDoctor",
            FIELD_NAME,
            VALUE
        );
        console.log(
            "Transaction has been submitted please query again to see the changes."
        );

        // Disconnect from the gateway.
        await gateway.disconnect();
        return {
            message: `For ${FIELD_NAME} : Transaction has been submitted please query again to see the changes.`,
        };
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        //process.exit(1);
        return { status: "error", message: error };
    }
}

module.exports = { changeFieldValueByDoctor };
