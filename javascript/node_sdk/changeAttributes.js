/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const {
    FileSystemWallet,
    Gateway,
    X509WalletMixin,
} = require("fabric-network");
const path = require("path");

const {
    getAffiliation,
    getCCP,
    getMSPID,
    getWalletPath,
} = require("../common_lib/helper.js");
async function changeAttributes(USER_NAME, ORG_NAME, ADMIN_NAME, CHANNEL_NAME) {
    try {
        const isDoctor = ORG_NAME === "Org2" ? "true" : "false";
        const MSPID = await getMSPID(ORG_NAME);
        const ccpPath = await getCCP(ORG_NAME);
        const walletPath = await getWalletPath(ORG_NAME);
        const affiliation = await getAffiliation(ORG_NAME);
        const wallet = new FileSystemWallet(walletPath);
        // console.log(`Wallet path: ${walletPath}`);

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, {
            wallet,
            identity: "admin",
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the CA client object from the gateway for interacting with the CA.
        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();

        const identityService = ca.newIdentityService();
        const retrieveIdentity = await identityService.getOne(
            USER_NAME,
            adminIdentity
        );
        console.log("user attributes: ", retrieveIdentity.result.attrs);

        var request = {
            affiliation,
            enrollmentID: USER_NAME,
            role: "client",
            attrs: [{ name: "channelname", value: CHANNEL_NAME, ecert: true }],
        };
        let attr1 = { name: "isdoctor", value: isDoctor, ecert: true };
        request.attrs.push(attr1);
        let response = await identityService.update(
            USER_NAME,
            request,
            adminIdentity
        );
        console.log(" ====>> response: ", response);

        const retrieveNewIdentity = await identityService.getOne(
            USER_NAME,
            adminIdentity
        );
        console.log(
            "===> new user attributes: ",
            retrieveNewIdentity.result.attrs
        );
    } catch (error) {
        console.error(`Failed to register user : ${error}`);
        process.exit(1);
    }
}

module.exports = { changeAttributes };
