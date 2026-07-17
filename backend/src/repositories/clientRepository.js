const { User, Case, Lawyer } = require("../models")

const createCase = async (caseData) => {
    return await Case.create(caseData);
}

const getMyCases = async (clientId) => {
    return await User.findAll({
        where: { clientId },
        include: [{
            model: User,
            as: "lawyer",
            attributes: ["id", "fullName", "email"]
        }]
    });
};

const getCaseDetails = async (caseId, clientId) => {
    return await User.findOne({
        where: { id: caseId, clientId},
        include: [{
            model: User,
            as: "lawyer",
            attributes: ["id", "fullName", "email"]
        }]
    })
}

const getAllApprovedLawyers = async () => {
    return await User.findAll({
        where: {
            role: "lawyer",
            status: "approved"
        },
        attributes: ["id", "fullName", "email"],
        include: [
            {
                model: Lawyer,
                as: "lawyerDetails",
                attributes: ["barCouncilNumber", "specialization", "experience"]
            }
        ]
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

module.exports = { getMyCases, getCaseDetails, getAllApprovedLawyers, createCase, getLawyerById }