const User = require("../models/User");
const Case = require("../models/Case");

const getAllCases = async () => {
    return await Case.findAll();
}

const getCasesById = async (id) => {
    return await Case.findByPk(id);
}

const assignLawyer = async (id, lawyerId) => {
    return await Case.update(
        {
            lawyerId,
            status: "assigned",
        },
        {
            where: { id },
        }
    );
};

const getClientCases = async (clientId) => {
    return await Case.findAll({
        where: {
            clientId,
        },
        include: [
            {
                model: User,
                as: "lawyer",
                attributes: ["id", "fullName", "email"]
            }
        ],
        order: [["createdAt", "DESC"]]
    });
};

module.exports = { getCasesById, getAllCases, assignLawyer, getClientCases }