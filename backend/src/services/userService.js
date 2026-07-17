const { User, Case, Lawyer } = require("../models");

const list = async (query) => {
    const payload = {};
    const options = {};
    if (query.role) {
        payload.role = query.role;
    }
    if (query.status) {
        payload.status = query.status;
    }
    options.attributes = ["id", "fullName", "email", "role", "status", "createdAt"];
    options.order = [
        ["createdAt", "DESC"]
    ];
    return await User.findAll({
        where: payload,
        ...options
    });
};

const read = async (currentUser, id, query) => {
    if (currentUser.role !== "admin" && currentUser.id != id) {
        throw new Error("Access Denied!!");
    }

    const payload = { id };

    const options = {
        attributes: ["id", "fullName", "email", "role", "status", "createdAt"]
    };

    const includMap = {
        client: [{
            model: Case,
            as: "clientCases",
            include: [{
                model: User,
                as: "lawyer",
                attributes: [
                    "id",
                    "fullName",
                    "email"
                ]
            }]
        }],
        lawyer: [{
            model: Lawyer,
            as: "lawyerDetails"
        },
        {
            model: Case,
            as: "assignedCases",
            include: [{
                model: User,
                as: "client",
                attributes: [
                    "id",
                    "fullName",
                    "email"
                ]
            }]
        }]
    }

    if (query.role && includMap[query.role]) {
        options.include = includMap[query.role];
    }

    const user = await User.findOne({
        where: payload,
        ...options
    });

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

const update = async (currentUser, id, body) => {

if (
        currentUser.role !== "admin" &&
        currentUser.id !== Number(id)
    ) {
        throw new Error("Forbidden");
    }
    const user = await User.findByPk(id);

    if (!user) {
        throw new Error("User not found");
    }

    if (currentUser.role === "admin") {
        Object.assign(user, body);
    } else if (currentUser.id == id) {
        delete body.role,
            delete body.status,

            Object.assign(user, body);
    } else {
        throw new Error("Access Denied");
    }

    await user.save();
    return user;
};

const remove = async (currentUser, id) => {

    if (currentUser.role !== "admin") {
        throw new Error("Access Denied");
    }

    const user = await User.findByPk(id);

    if (!user) {
        throw new Error("User Not Found!!");
    }

    await user.destroy();
    return true;
}

module.exports = { list, read, update, remove };