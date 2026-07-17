const { Case, User } = require("../models");

const create = async (user, body) => {
    if (user.role !== "client") {
        throw new Error("Only clients can create case");
    }
    body.clientId = user.id;
    body.status = "pending";
    return await Case.create(body);
};

const list = async (user, query) => {
    const payload = {};
    const options = {};

    if (user.role === "client") {
        payload.clientId = user.id;
    }

    if (user.role === "lawyer") {
        payload.lawyerId = user.id;
    }

    if (user.role === "admin") {
        if (query.clientId) {
            payload.clientId = query.clientId
        }

        if (query.lawyerId === "null") {
            payload.lawyerId = null;
        } else if (query.lawyerId) {
            payload.lawyerId = query.lawyerId
        }
    }

    if (query.status) {
                payload.status = query.status;
            }

    options.include = [
        {
            model: User,
            as: "client",
            attributes: ["id", "fullName", "email"]
        },
        {
            model: User,
            as: "lawyer",
            attributes: ["id", "fullName", "email"]
        }
    ];

    return await Case.findAll({
        where: payload,
        ...options
    });

};

const read = async (currentUser, id) => {
    const data = await Case.findByPk(id, {
        include: [
            {
                model: User,
                as: "client"
            },
            {
                model: User,
                as: "lawyer"
            }
        ]
    });

    if (!data) {
        throw new Error("Case not found");
    }

    if (currentUser.role === "client" && data.clientId !== currentUser.id) {
        throw new Error("Access denied");
    }

    if (currentUser.role === "lawyer" && data.lawyerId !== currentUser.id) {
        throw new Error("Access denied");
    }

    return data;
};

const update = async (id, user, body) => {

    const data = await Case.findByPk(id);

    if (!data) {
        throw new Error("Case not found");
    }

    // Admin can assign lawyer
    if (body.lawyerId && user.role === "admin") {
        data.lawyerId = body.lawyerId;
        data.status = "assigned";
    }

    // Lawyer update status
    if (body.status && user.role === "lawyer") {
        if(data.lawyerId !== user.id) {
            throw new Error("Access Denied");
        }

        Object.assign(data, {
            status: body.status ?? data.status,
            hearingDate: body.hearingDate ?? data.hearingDate,
            hearingTime: body.hearingTime ?? data.hearingTime
        })
        data.status = body.status;
    }
    
    await data.save();
    return data;
};

const destroy = async (id, user) => {
       const data = await Case.findByPk(id);

       if (!data) {
        throw new Error("Case not found");
       }

       if (user.role === "admin") {
           await data.destroy();
           return;
       }

       if (user.role !== "client") {
           throw new Error("Access denied");
       }

       if (data.clientId !== user.id) {
           throw new Error("Access denied");
       }

    await data.destroy();
}


module.exports = { create, list, read, update, destroy };