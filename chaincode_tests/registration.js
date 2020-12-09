const { addAdmin } = require("../javascript/node_sdk/addAdmin");
const { addUser } = require("../javascript/node_sdk/addUser.js");
const { queryData } = require("../javascript/access_ledger/queryData");
const { queryAll } = require("../javascript/access_ledger/queryAll");
const {
  changeFieldValueByPatient,
} = require("../javascript/access_ledger/changeFieldValueByPatient");
const {
  queryBasicInfo,
} = require("../javascript/access_ledger/queryBasicInfo");
const { invoke } = require("../javascript/access_ledger/invoke");
const { init } = require("../javascript/access_ledger/init");
const {
  changeAttributes,
} = require("../javascript/node_sdk/changeAttributes.js");

addAdmin("Org1", "admin");
addAdmin("Org2", "admin");

setTimeout(() => addUser("Patient0", "Org1", "admin", "channel0"), 2000);
setTimeout(() => addUser("Doctor0", "Org2", "admin", "channel0"), 2200);
setTimeout(() => addUser("Patient1", "Org1", "admin", "channel1"), 2000);
setTimeout(() => addUser("Doctor1", "Org2", "admin", "channel1"), 2200);

// ================================= Privacy features ================================s

// ------------ One Patient can't read other Patient's data
// ===> Here Patient0 is trying to query Patient1's data

// init("Patient0", "channel0", "Org1", "Patient0").then((response) =>
//   console.log("P0 CH0 Query is :", response)
// );
// queryAll("Patient0", "channel0", "Org1", "Patient0").then((response) =>
//   console.log("P0 CH0 Query is :", response)
// );
// queryBasicInfo("Patient0", "channel0", "Org1", "Patient0").then((response) =>
//   console.log("P0 CH0 Query is :", response)
// );
// queryData("Patient0", "channel0", "Org1", "Patient0").then((response) =>
//   console.log("P0 CH0 Query is :", response)
// );

// ------------ A Doctor can't read other (out of channel) Patient's data out
// ===> Here Doctor0 is trying to query Patient1's data

// queryAll("Patient0", "channel1", "Org1", "Patient1").then((response) =>
//     console.log("P0 CH0 Query is :", response)
// );

///////////////////////////////   Channel0   /////////////////////////////
// const ADMIN_NAME = "admin";
// const ORG_NAME = "Org1";
// const USER_NAME = "user01"; // 01 = peer0.Org1
// const CHANNEL_NAME = "channel0"; // 0 = between peer0 of both Org1 and Org2

// addAdmin("Org1", "admin");
// addAdmin("Org2", "admin");

// setTimeout(() => addUser("Patient0", "Org1", "admin", "channel0"), 2000);
// setTimeout(() => addUser("Doctor0", "Org2", "admin", "channel0"), 2200);

// // changeAttributes("Patient", "Org1", "admin", "channel0");
// queryAll("Patient0", "channel0", "Org1", "Patient0").then((response) =>
//   console.log("P0 CH0 Query is :", response)
// );
// query("Doctor0", "channel0", "Org2", "Patient0").then((response) =>
//     console.log("D0 CH0 Query is :", response)
// );

// changeFieldValueByPatient(
//   "Patient0",
//   "channel0",
//   "Org1",
//   "Patient0",
//   "name",
//   "Patient0"
// );

// queryBasicInfo("Patient0", "channel0", "Org1", "Patient0").then((response) =>
//   console.log("P0 CH0 Query is :", response)
// );
// invoke(
//     "Doctor0",
//     "channel0",
//     "Org2",
//     "Patient0",
//     "lastvisit",
//     "['22-Mar-2020','33-Sep-2020']"
// );

// ================================= Permission Tests ================================s

//  ------------- Only restricted to Doctor
// invoke(
//     "Patient0",
//     "channel0",
//     "Org1",
//     "Patient0",
//     "lastvisit",
//     "['22-Mar-2020','33-Sep-2020']"
// );

///////////////////////////////   Channel1   /////////////////////////////
// const ADMIN_NAME = "admin";
// const ORG_NAME = "Org1";
// const USER_NAME = "user01"; // 01 = peer0.Org1
// const CHANNEL_NAME = "channel0"; // 0 = between peer0 of both Org1 and Org2

// setTimeout(() => addUser("Patient1", "Org1", "admin", "channel1"), 2000);
// setTimeout(() => addUser("Doctor1", "Org2", "admin", "channel1"), 2200);

// changeAttributes("Patient", "Org1", "admin", "channel0");
// query("Patient1", "channel1", "Org1", "Patient1").then((response) =>
//     console.log("P1 CH1 Query is :", response)
// );
// query("Doctor1", "channel1", "Org2", "Patient1").then((response) =>
//     console.log("D1 CH1 Query is :", response)
// );
// invoke(
//     "Doctor1",
//     "channel1",
//     "Org2",
//     "Patient1",
//     "lastvisit",
//     "['02-Feb-2020','03-Aug-2020']"
// );

// ================================= Permission Tests ================================s

//  ------------- Only restricted to Doctor
// invoke(
//     "Patient1",
//     "channel1",
//     "Org1",
//     "Patient1",
//     "lastvisit",
//     "['22-Mar-2020','33-Sep-2020']"
// );

// --------------- One Patient can't read other Patient's data
// query("Patient1", "channel0", "Org1", "Patient0").then((response) =>
//     console.log("P0 CH0 Query is :", response)
// );
