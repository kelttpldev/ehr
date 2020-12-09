const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/test/all", controller.allAccess);

    app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

    app.get(
        "/patient/getrecord",
        [authJwt.verifyToken],
        controller.patientGetrecord
    );

    app.get(
        "/doctor/getrecord",
        [authJwt.verifyToken],
        controller.doctorGetrecord
    );

    app.post("/patient/adddoctor", [authJwt.verifyToken], controller.addDoctor);

    app.post(
        "/patient/removedoctor",
        [authJwt.verifyToken],
        controller.removeDoctor
    );

    app.get(
        "/patient/listdoctor",
        [authJwt.verifyToken],
        controller.listDoctor
    );

    app.post(
        "/patient/update",
        [authJwt.verifyToken],
        controller.updateByPatient
    );

    app.post(
        "/doctor/update",
        [authJwt.verifyToken],
        controller.updateByDoctor
    );
    app.get(
        "/patient/listdoctor",
        [authJwt.verifyToken],
        controller.listDoctor
    );

    app.get(
        "/doctor/listpatient",
        [authJwt.verifyToken],
        controller.listPatient
    );
    // app.get(
    //   '/api/test/mod',
    //   [authJwt.verifyToken, authJwt.isModerator],
    //   controller.moderatorBoard
    // )

    // app.get(
    //   '/api/test/admin',
    //   [authJwt.verifyToken, authJwt.isAdmin],
    //   controller.adminBoard
    // )
};
