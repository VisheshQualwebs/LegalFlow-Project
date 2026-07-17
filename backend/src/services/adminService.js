const { getPendingLawyers, approveLawyer, getAllClients, getClientDetails, getAllLawyers, getLawyerDetails, getLawyerById, getCasesWhereLawyerNotAssign, findUser } = require("../repositories/adminRepository");
const { assignLawyer } = require("../repositories/caseRepository");

// const { findUser } = require("../repositories/adminRepository")

const pendingLawyers = async () => {
    return await getPendingLawyers();
}

const approvePendingLawyer = async (id) => {
    const lawyer = await approveLawyer(id);
    if (!lawyer) {
        throw new Error("Lawyer not found");
    }
    return lawyer;
}

const allClients = async () => {
    return await getAllClients();
}

const clientDetails = async (id) => {
    const client = await getClientDetails(id);
    if (!client) {
        throw new Error("Client not found!!")
    }
    return client;
}

const allLawyers = async () => {
    return await getAllLawyers();
}

const lawyerDetails = async (id) => {
    const lawyer = await getLawyerDetails(id);
    if (!lawyer) {
        throw new Error("lawyer not found!!")
    }
    return lawyer;
}

const assignLawyerToCase = async (caseId, lawyerId) => {
    const lawyer = await getLawyerById(lawyerId);

    if (!lawyer) {
        throw new Error("Lawyer not found");
    }
    if (lawyer.status !== "approved") {
        throw new Error("Lawyer not approved!");
    }
    return assignLawyer(caseId, lawyerId);
}

const unassignedCases = async () => {
    return await getCasesWhereLawyerNotAssign();
}


module.exports = { pendingLawyers, approvePendingLawyer, allClients, clientDetails, allLawyers, lawyerDetails, assignLawyerToCase, unassignedCases }


// const pendingLawyers = async () => {
//     return await findUser({
//         role: "lawyer",
//         status: "pending",
//     })
// }

// module.exports = { pendingLawyers }