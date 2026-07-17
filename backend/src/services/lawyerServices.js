const { getMyCases, updateCaseStatus, getClientsById, getAllMyClients } = require("../repositories/lawyerRepository");

const myCases = async (lawyerId) => {
    return await getMyCases(lawyerId);
}

const changeCaseStatus = async (caseId, lawyerId, status) => {
    const validStatus = ["pending", "assigned", "in_progress", "completed", "closed"];
    if(!validStatus.includes(status)){
        throw new Error("status not defined or Invalid status")
    }
    return await updateCaseStatus(caseId, lawyerId, status);
}

const clientsById = async (id, lawyerId) => {
    return await getClientsById(id, lawyerId);
}

const allClients = async (lawyerId) => {
    return await getAllMyClients(lawyerId);
}

module.exports = { myCases, changeCaseStatus, clientsById, allClients };