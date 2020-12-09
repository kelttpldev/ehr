/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";
const FabricCAServices = require("fabric-ca-client");
const { FileSystemWallet, X509WalletMixin } = require("fabric-network");
const fs = require("fs");
// const path = require("path");
const {
    getCCP,
    getMSPID,
    getWalletPath,
    getCaInfo,
} = require("../common_lib/helper.js");

///////////////////////////////////////////////////////////////////////////////////////////////

async function addAdmin(ORG_NAME, ADMIN_NAME) {
    try {
        // console.log("-----> begin  ");
        const ccp = await getCCP(ORG_NAME);
        // console.log("-----> ccp  done  ");
        const MSPID = await getMSPID(ORG_NAME);
        // console.log("-----> MSPID done  ");
        // Create a new CA client for interacting with the CA.
        const caInfo = await getCaInfo(ORG_NAME, ccp); // ccp.certificateAuthorities['ca.org1.example.com'];
        // console.log("-----> caInfo done ");
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(
            caInfo.url,
            { trustedRoots: caTLSCACerts, verify: false },
            caInfo.caName
        );
        // console.log(" ===> ca done ");
        // Create a new file system based wallet for managing identities.
        const walletPath = await getWalletPath(ORG_NAME); //path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        // console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists(ADMIN_NAME);
        if (adminExists) {
            console.log(
                "An identity for the admin user ",
                ADMIN_NAME,
                " already exists in the wallet"
            );
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({
            enrollmentID: ADMIN_NAME,
            enrollmentSecret: "adminpw",
        });
        const identity = X509WalletMixin.createIdentity(
            MSPID,
            enrollment.certificate,
            enrollment.key.toBytes()
        );
        await wallet.import(ADMIN_NAME, identity);
        console.log(
            "Successfully enrolled admin user " +
                ADMIN_NAME +
                " and imported it into the wallet"
        );
    } catch (error) {
        console.error(`Failed to enroll admin user ${ADMIN_NAME}: ${error}`);
        process.exit(1);
    }
}

module.exports = { addAdmin };
