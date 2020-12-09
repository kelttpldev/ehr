const fs = require("fs");
const path = require("path");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const getAffiliation = async (ORG_NAME) => {
    return ORG_NAME == "Org1" ? "org1.department1" : "org2.department1";
};
const getMSPID = async (ORG_NAME) => {
    if (ORG_NAME == "Org1") {
        return "Org1MSP";
    } else if (ORG_NAME == "Org2") {
        return "Org2MSP";
    } else {
        return null;
    }
};

const getWalletPath = async (ORG_NAME) => {
    let walletPath;
    if (ORG_NAME == "Org1") {
        walletPath = path.join(process.cwd(), "org1-wallet");
    } else if (ORG_NAME == "Org2") {
        walletPath = path.join(process.cwd(), "org2-wallet");
    } else return null;
    return walletPath;
};

const getCCP = async (ORG_NAME) => {
    let ccpPath;
    if (ORG_NAME == "Org1") {
        ccpPath = path.resolve(
            __dirname,
            "..",
            "..",
            "..",
            "first-network",
            "connection-org1.json"
        );
    } else if (ORG_NAME == "Org2") {
        ccpPath = path.resolve(
            __dirname,
            "..",
            "..",
            "..",
            "first-network",
            "connection-org2.json"
        );
    } else return null;

    const ccpJSON = fs.readFileSync(ccpPath, "utf8");
    const ccp = JSON.parse(ccpJSON);
    return ccp;
};

const getCaInfo = async (ORG_NAME, ccp) => {
    if (ORG_NAME == "Org1") {
        return ccp.certificateAuthorities["ca.org1.example.com"];
    } else if (ORG_NAME == "Org2") {
        return ccp.certificateAuthorities["ca.org2.example.com"];
    } else return null;
};
module.exports = {
    getAffiliation,
    getCCP,
    getMSPID,
    getWalletPath,
    getCaInfo,
};
