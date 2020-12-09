require("dotenv").config();
const express = require("express");
const exec = require("child_process").exec;
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const { addAdmin } = require("./node_sdk/addAdmin");
const { addUser } = require("./node_sdk/addUser");
const { query } = require("./access_ledger/queryData");
const { invoke } = require("./access_ledger/invoke");
const dbConfig = require("./app/config/db.config");
//const bcrypt = require('bcrypt')

const app = express();
const { ROLE, users } = require("./back_end/data");
const {
    authUser,
    authRole,
    authenticateToken,
} = require("./back_end/basicAuth");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(setUser)

const db = require("./app/models");
const Role = db.role;

db.mongoose
    .connect(
        `mongodb+srv://${dbConfig.USER}:${dbConfig.PASSWORD}@todo.ogr6w.mongodb.net/${dbConfig.DB}?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => {
        console.log("Successfully connect to MongoDB.");
    })
    .catch((err) => {
        console.error("Connection error", err);
        process.exit();
    });

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

app.post("/login", setUser, authUser, (req, res) => {
    // Authenticate User
    //const user = { name: req.body.username }
    // console.log("req.user is: ", req.user);
    const token = jwt.sign(req.user, process.env.ACCESS_TOKEN_SECRET);
    // const token = jwt.sign(req.user, process.env.ACCESS_TOKEN_SECRET, {
    //     expiresIn: "220m",
    // });
    console.log("--->", req.user.name, "logged in successfully ");
    res.json({ token: token });
});

app.post("/update", authenticateToken, async (req, res) => {
    // console.log(req.body);
    if (req.body.field === "lastvisit" && req.user.type === "doctor") {
        const recordToSend = await invoke(
            req.user.name,
            req.user.channel,
            req.user.org,
            req.user.access_id,
            "lastvisit",
            req.body.value
        );
        if (recordToSend.status && recordToSend.status === "error") {
            return res.status(500).json(recordToSend);
        } else {
            res.json(recordToSend);
        }
    } else {
        const recordToSend = await invoke(
            req.user.name,
            req.user.channel,
            req.user.org,
            req.user.access_id,
            req.body.field,
            req.body.value
        );
        if (recordToSend.status && recordToSend.status === "error") {
            return res.status(500).json(recordToSend);
        } else {
            res.json(recordToSend);
        }
    }
    // console.log("==========> user : ", req.user);
});

// app.get("/admin", authUser, authRole(ROLE.ADMIN), (req, res) => {
//     res.send("Admin Page");
// });

app.get("/record", authenticateToken, async (req, res) => {
    // let recordToSend = null;
    if (req.user.type === "patient") {
        //  query db for all authorized doctors
        //  query legder for all fields
        //  send response with all values

        const recordToSend = await query(
            req.user.name,
            req.user.channel,
            req.user.org,
            req.user.access_id
        );
        console.log("==========> Record to send:", recordToSend);
        if (recordToSend.status && recordToSend.status === "error") {
            return res.status(500).json(recordToSend);
        } else {
            res.json(recordToSend);
        }
    } else {
        //  get all patient list from DB
        const recordToSend = await query(
            req.user.name,
            req.user.channel,
            req.user.org,
            req.user.access_id
        );
        console.log("==========> Record to send:", recordToSend);
        if (recordToSend.status && recordToSend.status === "error") {
            return res.status(500).json(recordToSend);
        } else {
            res.json(recordToSend);
        }
    }
});

// app.get("/patientrecord", authenticateToken, async (req, res) => {
//     console.log("req.query.patientname:", req.query.patientname);
//     const user = users.find((user) => user.name === req.query.patientname);
//     //  get all patient list from DB
//     console.log("--> found user:", user.name);
//     const recordToSend = await query(
//         user.name,
//         user.channel,
//         user.org,
//         user.access_id
//     );
//     console.log("==========> Record to send:", recordToSend);
//     if (recordToSend.status && recordToSend.status === "error") {
//         return res.status(500).json(recordToSend);
//     } else {
//         res.json(recordToSend);
//     }
// });

// app.get("/patients", authenticateToken, async (req, res) => {
//     let patientList = [];
//     users.forEach((user) => {
//         if (user.channel === req.user.channel && user.type === "patient") {
//             const addedUser = { name: user.name };
//             patientList.push(addedUser);
//         }
//     });
//     console.log("==========> User details:", patientList);
//     res.json(patientList);
// });

function setUser(req, res, next) {
    const username = req.body.username;
    if (username) {
        const user = users.find((user) => user.name === username);
        if (user) {
            req.user = user.name;
            next();
            // console.log(
            //     "==> found user: ",
            //     req.user,
            //     " with pass",
            //     req.body.password
            // );
        } else {
            console.log("user does not exist");
            return res.status(403).send("User does not exist");
        }
    }
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is listening to http\://localhost\:3000`);
    addAdmin("Org1", "admin");
    addAdmin("Org2", "admin");

    // setTimeout(() => addUser("Patient0", "Org1", "admin", "channel0"), 2000);
    // setTimeout(() => addUser("Doctor0", "Org2", "admin", "channel0"), 2200);
    // setTimeout(() => addUser("Patient1", "Org1", "admin", "channel1"), 2000);
    // setTimeout(() => addUser("Doctor1", "Org2", "admin", "channel1"), 2200);

    // exec(`../scripts/channel.sh`, function (error, stdout, stderr) {
    //     if (error !== null) {
    //         console.log(error);
    //     } else {
    //         console.log("======> stdout: " + stdout);
    //         console.log("======> stderr: " + stderr);
    //     }
    // });
});
