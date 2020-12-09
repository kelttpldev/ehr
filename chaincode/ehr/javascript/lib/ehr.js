/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Contract } = require("fabric-contract-api");
const ClientIdentity = require("fabric-shim").ClientIdentity;
class EHR extends Contract {
    async initLedger(ctx) {
        console.info("============= START : Initialize Ledger ===========");
        const basicinfo = {
            id: "N/A",
            name: "N/A",
            ssn: "00-00-000",
            age: "0",
            gender: "N/A",
            location: "N/A",
            insurance: "N/A",
        };
        const data = {
            lastvisit: [], //{ doctor: String, date: String}
            medications: [],
            immunizations: [], // { Vaccine Code: Number, Vaccine Name: String, Date}
        };

        basicinfo.docType = "basicinfo";
        await ctx.stub.putState(
            "basicinfo",
            Buffer.from(JSON.stringify(basicinfo))
        );
        console.info("Added <--> ", basicinfo);

        data.docType = "data";
        await ctx.stub.putState("data", Buffer.from(JSON.stringify(data)));
        console.info("Added <--> ", data);

        console.info("============= END : Initialize Ledger ===========");
    }

    async queryData(ctx) {
        const dataAsBytes = await ctx.stub.getState("data"); // get the patient from chaincode state
        if (!dataAsBytes || dataAsBytes.length === 0) {
            throw new Error(`patient does not exist`);
        }
        console.log(dataAsBytes.toString());
        return dataAsBytes.toString();
    }

    async queryBasicInfo(ctx) {
        const dataAsBytes = await ctx.stub.getState("basicinfo"); // get the patient from chaincode state
        if (!dataAsBytes || dataAsBytes.length === 0) {
            throw new Error(`patient does not exist`);
        }
        console.log(dataAsBytes.toString());
        return dataAsBytes.toString();
    }

    async queryAll(ctx) {
        const basicinfoBytes = await ctx.stub.getState("basicinfo"); // get the patient from chaincode state
        const dataBytes = await ctx.stub.getState("data");
        if (
            !basicinfoBytes ||
            basicinfoBytes.length === 0 ||
            !dataBytes ||
            dataBytes.length === 0
        ) {
            throw new Error(`patient does not exist`);
        }
        const returnBytes = { ...basicinfoBytes, ...dataBytes };
        return returnBytes.toString();
    }

    // async queryData(ctx, id) {
    //     let cid = new ClientIdentity(ctx.stub);
    //     if (
    //         cid.assertAttributeValue("channelname", "channel0") &&
    //         id === "Patient0"
    //     ) {
    //         const dataAsBytes = await ctx.stub.getState(id); // get the patient from chaincode state
    //         if (!dataAsBytes || dataAsBytes.length === 0) {
    //             throw new Error(`${id} does not exist`);
    //         }
    //         console.log(dataAsBytes.toString());
    //         return dataAsBytes.toString();
    //     } else if (
    //         cid.assertAttributeValue("channelname", "channel1") &&
    //         id === "Patient1"
    //     ) {
    //         const dataAsBytes = await ctx.stub.getState(id); // get the patient from chaincode state
    //         if (!dataAsBytes || dataAsBytes.length === 0) {
    //             throw new Error(`${id} does not exist`);
    //         }
    //         console.log(dataAsBytes.toString());
    //         return dataAsBytes.toString();
    //     } else {
    //         throw new Error(" ==========> User doesn't belong to this channel");
    //     }
    // }

    async changeFieldValueByPatient(ctx, field, value) {
        const dataAsBytes = await ctx.stub.getState("basicinfo");
        const patient = JSON.parse(dataAsBytes.toString());
        patient[field] = value;
        await ctx.stub.putState(
            "basicinfo",
            Buffer.from(JSON.stringify(patient))
        );
    }

    async changeFieldValueByDoctor(ctx, field, value) {
        const dataAsBytes = await ctx.stub.getState("data");
        const patient = JSON.parse(dataAsBytes.toString());
        patient[field].push(value);
        await ctx.stub.putState("data", Buffer.from(JSON.stringify(patient)));
    }

    // async changeFieldValue(ctx, id, field, value) {
    //     console.info("============= START : changeFieldValue ===========");
    //     let cid = new ClientIdentity(ctx.stub);
    //     if (
    //         cid.assertAttributeValue("channelname", "channel0") &&
    //         id === "Patient0"
    //     ) {
    //         const dataAsBytes = await ctx.stub.getState(id); // get the patient from chaincode state
    //         if (!dataAsBytes || dataAsBytes.length === 0) {
    //             throw new Error(`${id} does not exist`);
    //         }
    //         const patient = JSON.parse(dataAsBytes.toString());
    //         if (field === "lastvisit") {
    //             if (cid.assertAttributeValue("isdoctor", "true")) {
    //                 patient[field].push(value);
    //             } else {
    //                 throw new Error("  ==> Only Doctor can cahnge this field");
    //             }
    //         } else {
    //             patient[field] = value;
    //         }
    //         await ctx.stub.putState(id, Buffer.from(JSON.stringify(patient)));
    //     } else if (
    //         cid.assertAttributeValue("channelname", "channel1") &&
    //         id === "Patient1"
    //     ) {
    //         const dataAsBytes = await ctx.stub.getState(id); // get the patient from chaincode state
    //         if (!dataAsBytes || dataAsBytes.length === 0) {
    //             throw new Error(`${id} does not exist`);
    //         }
    //         const patient = JSON.parse(dataAsBytes.toString());
    //         if (field === "lastvisit") {
    //             if (cid.assertAttributeValue("isdoctor", "true")) {
    //                 patient[field].push(value);
    //             } else {
    //                 throw new Error("  ==> Only Doctor can cahnge this field");
    //             }
    //         } else {
    //             patient[field] = value;
    //         }
    //         await ctx.stub.putState(id, Buffer.from(JSON.stringify(patient)));
    //     } else {
    //         throw new Error(" ==========> User doesn't belong to this channel");
    //     }
    //     console.info("============= END : changeFieldValue ===========");
    // }
}

module.exports = EHR;
