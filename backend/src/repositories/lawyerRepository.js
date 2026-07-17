const User = require("../models/User");
const Lawyer = require("../models/Lawyer");
const Case = require("../models/Case");

const getMyCases = async (lawyerId) => {
    return await Case.findAll({
        where: { lawyerId, },
        include: [{
            model: User,
            as: "client",
            attributes: ["id", "fullName", "email"]
        }]
    });
};

const updateCaseStatus = async (caseId, lawyerId, status) => {
    return await Case.update({
        status
    }, {
        where: {
            id: caseId,
            lawyerId
        }
    });
};

const getClientsById = async (clientId, lawyerId) => {
    return await User.findOne({
        where: { clientId, lawyerId },
        include: [{
            model: User,
            as: "client"
        }]
    });
};

const getAllMyClients = async (lawyerId) => {
    return await User.findAll({
        where: {lawyerId},
        include: [{
            model: User,
            as: "clients",
            attributes: ["id", "fullName", "email"],
        }]
    });
};

module.exports = { getMyCases, updateCaseStatus, getClientsById, getAllMyClients };