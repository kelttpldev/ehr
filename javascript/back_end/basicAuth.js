const { users, ROLE } = require("./data");
const jwt = require("jsonwebtoken");

function authUser(req, res, next) {
    // console.log('inside authUser with user: ',req.user,' and pass: ',req.body.password)
    if (req.user == null) {
        res.status(403);
        return res.status(403).send("You need to sign in");
    }
    const user = users.find((user) => user.name === req.user);
    // console.log("==> found user in authUser(): ", user)
    if (req.body.password === user.password && req.body.type === user.type) {
        req.user = user;
        // console.log('--> Success with user type',req.user.role)
        next();
    } else {
        console.log("Wrong Password or user Type");
        return res.status(401).send("Wrong Password or User Type");
    }
}

function authRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            res.status(401);
            return res.send("Not allowed");
        }

        next();
    };
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    // console.log("token : ", token);
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(401).json({
                status: "error",
                message: "Error verifying token",
            });
        } else {
            req.user = user;
            next();
        }
    });
}

module.exports = {
    authUser,
    authRole,
    authenticateToken,
};
