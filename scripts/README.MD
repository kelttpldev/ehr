# Healthcare Blockchain based on HyperLedger Fabric (HLF) 1.4

## 1. Prerequisites:

### Environement:

- OS: Linux (I used Ubuntu 18.04.5 LTS in a virtualbox
- VS Code as IDE
- Before installing Hyperledger Fabric 1.4.7 follow the steps given here carefully:
  https://hyperledger-fabric.readthedocs.io/en/release-1.4/prereqs.html
-

## 2. Installation:

- Make sure to specify version 1.4.7 in this command "curl -sSL http://bit.ly/2ysbOFE | bash -s -- 1.4.7 1.4.7" given in below article:
  https://hyperledger-fabric.readthedocs.io/en/release-1.4/install.html

- Complete this tutorial to test the intalltion:
  https://hyperledger-fabric.readthedocs.io/en/release-1.4/build_network.html
- Extract EHR.zip in fabric-samples folder which is the sintalltion location of HLF.
- Copy directory `{PATH_TO_fabric-samples}/fabric-sample/EHR/chaincode/ehr `into `{PATH_TO_fabric-samples}/fabric-samples/`

## 3. Getting an Overview:

This tutorial will give you an overview of the workflow:
https://hyperledger-fabric.readthedocs.io/en/release-1.4/write_first_app.html

Detailed explaination is given here:
https://medium.com/@kctheservant/an-implementation-of-api-server-for-hyperledger-fabric-network-8764c79f1a87

## 4. How to run everything:

1. `cd PATH_TO_fabric-samples}/fabric-sample/EHR`
2. `./startFabric.sh`
3. Open a new terminal and `cd PATH_TO_fabric-samples}/fabric-sample/EHR/javascript/`
4. In the same terminal from step 3. run `npm start`
