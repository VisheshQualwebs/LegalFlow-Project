const { Case, Lawyer } = require("../models");
const User = require("../models/User");

const getPendingLawyers = async () => {
    return await User.findAll({
        where: {
            role: "lawyer",
            status: "pending",
        }
    });
};

const getLawyerById = async (id) => {
    return await User.findOne({
        where: {
            id,
            role: "lawyer",
        }
    })
};

const approveLawyer = async (id) => {
    return await User.update(
        { status: "approved" },
        { where: { id } }
    );
};

const getApprovedLawyerById = async (id) => {
    return await User.findOne({
        where: {
            id,
            role: "lawyer",
            status: "approved",
        }
    })
};

const getAllClients = async () => {
    return await User.findAll({
        where: {
            role: "client"
        },
        attributes: [
            "id", "fullName", "email", "createdAt"
        ],
        order: [["createdAt", "DESC"]]
    })
};

const getClientDetails = async (id) => {
    return await User.findOne({
        where: { id, role: "client", },
        attributes: ["id", "fullName", "email", "createdAt"],
        include: [{
            model: Case,
            as: "clientCases",
            include: [{
                model: User,
                as: "lawyer",
                attributes: ["id", "fullName", "email"]
            },]
        },]
    });
};

const getAllLawyers = async () => {
    return await User.findAll({
        where: { role: "lawyer" },
        attributes: ["id", "fullName", "email", "createdAt"],
        order: [["createdAt", "DESC"]]
    })
}

const getLawyerDetails = async (id) => {
    return await User.findOne({
        where: { id, role: "lawyer", },
        attributes: ["id", "fullName", "email", "createdAt"],
        include: [{
            model: Lawyer,
            as: "lawyerDetails",
        },
        {
            model: Case,
            as: "lawyerCases",
            include: [{
                model: User,
                as: "client",
                attributes: ["id", "fullName", "email"]
            }]
        },]
    });
}

const getCasesWhereLawyerNotAssign = async () => {
    return await Case.findAll({
        where: {
            lawyerId: null,
            role: "client"
        },
        include: [{
            model: User,
            as: "client",
            attributes: ["id", "fullName", "email"]
        }]
    })
}

module.exports = { getPendingLawyers, getLawyerById, approveLawyer, getApprovedLawyerById, getAllClients, getClientDetails, getLawyerDetails, getAllLawyers, getCasesWhereLawyerNotAssign }


// const findUser = async (payload = {}, options = {}) => {
//     return await User.findOne({
//         where: payload,
//         ...options,
//     })
// }

// module.exports = { findUser }
