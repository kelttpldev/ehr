"use strict";

const {
  FileSystemWallet,
  Gateway,
  X509WalletMixin,
} = require("fabric-network");
const path = require("path");

try {
  console.log("api hit");
  // Create a new file system based wallet for managing identities.
  const walletPath = path.join(process.cwd(), "wallet");
  const wallet = new FileSystemWallet(walletPath);
  console.log(`Wallet path: ${walletPath}`);

  // Check to see if we've already enrolled the user.
  const userExists = await wallet.exists("user2");

  if (!userExists) {
    console.log(
      'An identity for the user "user2" does not exist in the wallet'
    );
    console.log("Run the registerUser.js application before retrying");
    return;
  }

  // Create a new gateway for connecting to our peer node.
  const gateway = new Gateway();

  await gateway.connect(ccpPath, {
    wallet,
    identity: "user2",
    discovery: { enabled: false, asLocalhost: true },
  });
  var client = gateway.getClient();

  // first read in the file, this gives us a binary config envelope
  let envelope_bytes = fs.readFileSync(
    path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      "first-network/channel-artifacts/channel1.tx"
    )
  );
  let adminKey = fs.readFileSync(
    path.join(
      __dirname,
      "..",
      "..",
      "..",
      "/first-network/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/pem.key"
    )
  );
  // ../../../first-network/channel-artifacts/
  let adminCert = fs.readFileSync(
    path.join(
      __dirname,
      "..",
      "..",
      "..",
      "/first-network/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/admincerts/Admin@org1.example.com-cert.pem"
    )
  );
  client.setAdminSigningIdentity(
    adminKey.toString(),
    adminCert.toString(),
    "Org1MSP"
  );
  console.log(`admin key=====   ${adminKey}`);
  console.log(`admin cert=====   ${adminCert}`);
  // have the nodeSDK extract out the config update
  var signatures = new Array();

  var config_update = client.extractChannelConfig(envelope_bytes);
  var configSignature = client.signChannelConfig(config_update);

  signatures.push(configSignature);
  // create an orderer object to represent the orderer of the network
  var orderer = client.getOrderer("orderer.example.com");
  let request = {
    config: config_update, //the binary config
    signatures: signatures, // the collected signatures
    name: "arun1", // the channel name
    orderer: orderer, //the orderer from above
    txId: client.newTransactionID(true), //the generated transaction id
  };
  console.log(`configupdate${config_update}`);

  // this call will return a Promise
  console.log("Transaction sent 2");
  const result = await client.createChannel(request);
  return {
    status: 200,
    data: {
      data: JSON.parse(result.toString()),
    },
  };
} catch (error) {
  console.error(`Failed to evaluate transaction: ${error}`);
  //  process.exit(1);
  return {
    status: 400,
    data: {
      data: `${error}`,
    },
  };
}
