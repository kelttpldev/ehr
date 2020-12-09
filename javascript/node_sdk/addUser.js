/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";
const {
    FileSystemWallet,
    Gateway,
    X509WalletMixin,
} = require("fabric-network");
const fs = require("fs");
const path = require("path");
const {
    getAffiliation,
    getCCP,
    getMSPID,
    getWalletPath,
} = require("../common_lib/helper.js");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function addUser(USER_NAME, ORG_NAME, ADMIN_NAME, CHANNEL_NAME) {
    try {
        // Create a new file system based wallet for managing identities.
        const isDoctor = ORG_NAME === "Org2" ? "true" : "false";
        const MSPID = await getMSPID(ORG_NAME);
        const ccpPath = await getCCP(ORG_NAME);
        const walletPath = await getWalletPath(ORG_NAME);
        const affiliation = await getAffiliation(ORG_NAME);
        const wallet = new FileSystemWallet(walletPath);
        // console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(USER_NAME);
        if (userExists) {
            console.log(
                "An identity for the user " +
                    USER_NAME +
                    "already exists in the wallet"
            );
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists(ADMIN_NAME);
        if (!adminExists) {
            console.log(
                'An identity for the admin user "admin" does not exist in the wallet'
            );
            console.log("Run the enrollAdmin.js application before retrying");
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, {
            wallet,
            identity: ADMIN_NAME,
            discovery: { enabled: true, asLocalhost: true },
        });
        // console.log("connected to gateway");
        // Get the CA client object from the gateway for interacting with the CA.
        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register(
            {
                affiliation,
                enrollmentID: USER_NAME,
                role: "client",
                attrs: [
                    { name: "channelname", value: CHANNEL_NAME, ecert: true },
                    { name: "isdoctor", value: isDoctor, ecert: true },
                ],
            },
            adminIdentity
        );
        const enrollment = await ca.enroll({
            enrollmentID: USER_NAME,
            enrollmentSecret: secret,
        });
        const userIdentity = X509WalletMixin.createIdentity(
            MSPID,
            enrollment.certificate,
            enrollment.key.toBytes()
        );
        await wallet.import(USER_NAME, userIdentity);
        console.log(
            "Successfully registered and enrolled admin user " +
                USER_NAME +
                " and imported it into the wallet"
        );
    } catch (error) {
        console.error("Failed to register user " + USER_NAME + ": " + error);
        process.exit(1);
    }
}

module.exports = { addUser };
