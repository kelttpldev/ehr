const config = require("../config/auth.config");
const db = require("../models");
const { queryData } = require("../../access_ledger/queryData");
const { queryAll } = require("../../access_ledger/queryAll");
const { queryBasicInfo } = require("../../access_ledger/queryBasicInfo");
const {
    changeFieldValueByPatient,
} = require("../../access_ledger/changeFieldValueByPatient");
const {
    changeFieldValueByDoctor,
} = require("../../access_ledger/changeFieldValueByDoctor");
const User = db.user;
const Role = db.role;

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
};

exports.patientGetrecord = async (req, res) => {
    let user;
    try {
        console.log("userid :", req.userId);
        user = await User.findById(req.userId);
        if (user == null) {
            return res.status(404).json({ message: "Cannot find User" });
        }
    } catch (err) {
        console.log("error :", err);
        return res.status(500).json({ message: err.message });
    }
    console.log("user details :", user.username, user.channel, user.org);
    // const recordToSend = {
    //     details: "All the values",
    // };
    const basicInfo = await queryBasicInfo(
        user.username,
        user.channel, //user.channel,
        user.org,
        user.username // access_id is same as username
    );
    const data = await queryData(
        user.username,
        user.channel, //user.channel,
        user.org,
        user.username // access_id is same as username
    );

    const recordToSend = { ...basicInfo, ...data };
    if (recordToSend.status && recordToSend.status === "error") {
        return res.status(500).json(recordToSend);
    } else {
        res.json(recordToSend);
    }
};

exports.doctorGetrecord = async (req, res) => {
    const patient_id = req.body.patient_id;
    let user;
    try {
        // console.log('userid :', req.userId)
        user = await User.findById(req.userId);
        if (user == null) {
            return res.status(404).json({ message: "Cannot find User" });
        }
    } catch (err) {
        console.log("error :", err);
        return res.status(500).json({ message: err.message });
    }
    // console.log('user :', user)
    // console.log('user.access_list :', user.access_list)
    const hasAccess = user.access_list.includes(patient_id);
    // console.log('hasAccess :', hasAccess)
    if (hasAccess) {
        const basicInfo = await queryBasicInfo(
            user.username,
            user.channel, //user.channel,
            user.org,
            user.username // access_id is same as username
        );
        const data = await queryData(
            user.username,
            user.channel, //user.channel,
            user.org,
            user.username // access_id is same as username
        );

        const recordToSend = { ...basicInfo, ...data };
        // const recordToSend = await User.findById(patient_id);
        res.json(recordToSend);
    } else {
        res.status(500).json("Access to this patient denied");
    }
};

exports.addDoctor = async (req, res) => {
    try {
        console.log("userid :", req.userId);
        User.updateOne(
            { _id: req.userId },
            {
                $addToSet: { access_list: req.body.doctor_id },
            },
            (err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    console.log(result);
                }
            }
        );
        console.log("done with patient");
    } catch (err) {
        console.log("error :", err);
        return res.status(500).json({ message: err.message });
    }

    try {
        User.updateOne(
            { _id: req.body.doctor_id },
            {
                $addToSet: { access_list: req.userId },
            },
            (err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    console.log(result);
                }
            }
        );
        console.log("done with patient");
    } catch (err) {
        console.log("error :", err);
        return res.status(500).json({ message: err.message });
    }

    res.json({ message: "Success adding doctor" });
};

exports.removeDoctor = async (req, res) => {
    try {
        console.log("userid :", req.userId);
        User.updateOne(
            { _id: req.userId },
            {
                $pull: { access_list: req.body.doctor_id },
            },
            (err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    console.log(result);
                }
            }
        );
        console.log("done with patient");
    } catch (err) {
        console.log("error :", err);
        return res.status(500).json({ message: err.message });
    }

    try {
        User.updateOne(
            { _id: req.body.doctor_id },
            {
                $pull: { access_list: req.userId },
            },
            (err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    console.log(result);
                }
            }
        );
        console.log("done with patient");
    } catch (err) {
        console.log("error :", err);
        return res.status(500).json({ message: err.message });
    }

    res.json({ message: "Success removing doctor" });
};

exports.listDoctor = async (req, res) => {
    try {
        let user;
        let doctor_list = {};
        console.log("userid :", req.userId);
        const docs = await User.find({ access_list: req.userId })
            .select("username")
            .exec();
        if (docs == null) {
            return res.status(404).json({ message: "Cannot find Doctors" });
        }
        console.log("response : ", docs);
        res.json(docs);
    } catch (err) {
        console.log("error :", err);
        return res.status(500).json({ message: err.message });
    }
};

exports.listPatient = async (req, res) => {
    try {
        let user;
        let doctor_list = {};
        console.log("userid :", req.userId);
        const docs = await User.find({ access_list: req.userId })
            .select("username")
            .exec();
        if (docs == null) {
            return res.status(404).json({ message: "Cannot find Doctors" });
        }
        console.log("response : ", docs);
        res.json(docs);
    } catch (err) {
        console.log("error :", err);
        return res.status(500).json({ message: err.message });
    }
};

exports.updateByPatient = async (req, res) => {
    let user;
    try {
        console.log("userid :", req.userId);
        user = await User.findById(req.userId);
        if (user == null) {
            return res.status(404).json({ message: "Cannot find User" });
        }
    } catch (err) {
        console.log("error :", err);
        return res.status(500).json({ message: err.message });
    }
    console.log("user details :", user.username, user.channel, user.org);

    const recordToSend = await changeFieldValueByPatient(
        user.username,
        user.channel,
        user.org,
        user.username,
        req.body.field,
        req.body.value
    );
    if (recordToSend.status && recordToSend.status === "error") {
        return res.status(500).json(recordToSend);
    } else {
        res.json(recordToSend);
    }
};

exports.updateByDoctor = async (req, res) => {
    let user;
    try {
        console.log("userid :", req.userId);
        user = await User.findById(req.userId);
        if (user == null) {
            return res.status(404).json({ message: "Cannot find User" });
        }
    } catch (err) {
        console.log("error :", err);
        return res.status(500).json({ message: err.message });
    }
    console.log("user details :", user.username, user.channel, user.org);

    const recordToSend = await changeFieldValueByDoctor(
        user.username,
        user.channel,
        user.org,
        user.username,
        req.body.field,
        req.body.value
    );
    if (recordToSend.status && recordToSend.status === "error") {
        return res.status(500).json(recordToSend);
    } else {
        res.json(recordToSend);
    }
};
