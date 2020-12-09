const ROLE = {
    ADMIN: "admin",
    BASIC: "basic",
};

module.exports = {
    ROLE: ROLE,
    users: [
        {
            id: 1,
            name: "Admin",
            role: ROLE.ADMIN,
            password: "admin",
            type: "admin",
        },
        {
            id: 2,
            name: "Patient0",
            role: ROLE.BASIC,
            password: "patient0",
            type: "patient",
            org: "Org1",
            channel: "channel0",
            access_id: "Patient0",
        },
        {
            id: 3,
            name: "Doctor0",
            role: ROLE.BASIC,
            password: "doctor0",
            type: "doctor",
            org: "Org2",
            channel: "channel0",
            access_id: "Patient0",
        },
        {
            id: 4,
            name: "Patient1",
            role: ROLE.BASIC,
            password: "patient1",
            type: "patient",
            org: "Org1",
            channel: "channel1",
            access_id: "Patient1",
        },
        {
            id: 5,
            name: "Doctor1",
            role: ROLE.BASIC,
            password: "doctor1",
            type: "doctor",
            org: "Org2",
            channel: "channel1",
            access_id: "Patient1",
        },
    ],
};
