const User = require("./User");
const Case = require("./Case");
const Document = require("./Document")

User.hasMany(Case, {
    foreignKey: "clientId",
    as: "clientCases",
});

Case.belongsTo(User, {
    foreignKey: "clientId",
    as: "client",
});

User.hasMany(Case, {
    foreignKey: "lawyerId",
    as: "assignedCases"
});

Case.belongsTo(User, {
    foreignKey: "lawyerId",
    as: "lawyer"
});

Case.hasMany(Document, {
    foreignKey: "caseId",
    as: "documents"
})

Document.belongsTo(Case, {
    foreignKey: "caseId",
    as: "case"
})

User.hasMany(Document, {
    foreignKey: "uploadedBy",
    as: "uploadedDocuments",
})

Document.belongsTo(User, {
    foreignKey: "uploadedBy",
    as: "uploadedDocuments",
})

module.exports = { User, Case, Document }