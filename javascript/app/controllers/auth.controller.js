const { execFileSync, exec, spwan } = require("child_process");
const { addUser } = require("../../node_sdk/addUser");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    let org = req.body.type === "patient" ? "Org1" : "Org2";
    execFileSync(
        `../scripts/${org}_new_channel.sh`,
        [`${req.body.username.toLowerCase()}`],
        { shell: true }
        // function (error, stdout, stderr) {
        //     if (error !== null) {
        //         console.log(error);
        //         // return res.status(500).json({ message: error });
        //     } else {
        //         console.log("======> stdout: " + stdout);
        //         console.log("======> stderr: " + stderr);
        //     }
        // }
    );
    execFileSync(
        `../scripts/${org}_deploy_ehs_smartcontract.sh`,
        [`${req.body.username.toLowerCase()}`],
        { shell: true }
        // function (error, stdout, stderr) {
        //     if (error !== null) {
        //         console.log(error);
        //         // return res.status(500).json({ message: error });
        //     } else {
        //         console.log("======> stdout: " + stdout);
        //         console.log("======> stderr: " + stderr);
        //     }
        // }
    );
    // exec(
    //     `../scripts/${org}_deploy_ehs_smartcontract.sh ${req.body.username.toLowerCase()}`,
    //     function (error, stdout, stderr) {
    //         if (error !== null) {
    //             console.log(error);
    //             // return res.status(500).json({ message: error });
    //         } else {
    //             console.log("======> stdout: " + stdout);
    //             console.log("======> stderr: " + stderr);

    //             // addUser(req.body.username, org, "admin", req.body.username);
    //         }
    //     }
    // );
    User.create(
        {
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            type: req.body.type,
            org: org,
            channel: req.body.username.toLowerCase(),
        },
        function (err, small) {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err });
                return;
            }

            console.log("Success saving a new user");
            res.json({ message: "User Created" });
        }
    );
    // console.log("req.body :", req.body);
    // let org = req.body.type === "patient" ? "Org1" : "Org2";
    // const user = new User({
    //   username: req.body.username,
    //   email: req.body.email,
    //   password: bcrypt.hashSync(req.body.password, 8),
    //   type: req.body.type,
    //   org: org,
    //   channel: req.body.username,
    // })
    // console.log('user :', user)

    // user.save((err, user) => {
    //   if (err) {
    //     res.status(500).send({ message: err })
    //     return
    //   }

    // if (req.body.roles) {
    //   Role.find(
    //     {
    //       name: { $in: req.body.roles },
    //     },
    //     (err, roles) => {
    //       if (err) {
    //         res.status(500).send({ message: err })
    //         return
    //       }

    //       user.roles = roles.map((role) => role._id)
    //       user.save((err) => {
    //         if (err) {
    //           res.status(500).send({ message: err })
    //           return
    //         }

    //         res.send({ message: 'User was registered successfully!' })
    //       })
    //     }
    //   )
    // } else {
    //   Role.findOne({ name: 'user' }, (err, role) => {
    //     if (err) {
    //       res.status(500).send({ message: err })
    //       return
    //     }

    //     user.roles = [role._id]
    //     user.save((err) => {
    //       if (err) {
    //         res.status(500).send({ message: err })
    //         return
    //       }

    //       res.send({ message: 'User was registered successfully!' })
    //     })
    //   })
    // }
    // })
};
//
exports.signin = (req, res) => {
    User.findOne({
        username: req.body.username,
    })
        .populate("roles", "-__v")
        .exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }
            addUser(req.body.username, user.org, "admin", req.body.username);
            let passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!",
                });
            }
            console.log("user._id :", user._id);
            let token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: 86400, // 24 hours
            });

            let authorities = [];

            for (let i = 0; i < user.roles.length; i++) {
                authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
            }
            res.status(200).send({
                id: user._id,
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: token,
                channel: user.channel,
            });
        });
};
