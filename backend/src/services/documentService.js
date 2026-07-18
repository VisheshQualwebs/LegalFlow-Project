const { Case, User } = require("../models");
const Document = require("../models/Document");

const list = async (user) => {
    const caseFilter = {};

    if (user.role === "client") {
        caseFilter.clientId = user.id;
    }

    if (user.role === "lawyer") {
        caseFilter.lawyerId = user.id;
    }

    const documents = await Document.findAll({
        include: [
            {
                model: Case,
                as: "case",
                where: caseFilter,
                attributes: ["id", "title"],
                include: [
                    {
                        model: User,
                        as: "client",
                        attributes: ["id", "fullName", "email"],
                    }
                ]
            }
        ],
        order: [["createdAt", "DESC"]],
    });
    return documents;
}

module.exports = { list };