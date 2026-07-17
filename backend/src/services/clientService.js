const { getMyCases, getCaseDetails, getAllApprovedLawyers, createCase, getLawyerById } = require("../repositories/clientRepository")

const createNewCase = async (user, caseData) => {
    if (user.role !== "client") {
        throw new Error("Only Clients can Create Cases!!");
    }
    caseData.clientId = user.id;
    if (caseData.lawyerId) {
        const lawyer = getAllApprovedLawyers(caseData.lawyerId);

        if (!lawyer) {
            throw new Error("lawyer not found!!");
        }
        caseData.status = "waiting_for_lawyer";
    } else {
        caseData.status = "pending";
        caseData.lawyerId = null;
    }
    return await createCase(caseData);
}

const myCases = async (clientId) => {
    return await getMyCases(clientId);
};

const caseDetails = async (caseId, clientId) => {
    const data = await getCaseDetails(caseId, clientId);
    if(!data) {
        throw new Error("Case Not found");
    }
    return data;
}

const lawyerList = async () => {
    return await getAllApprovedLawyers();
}

const lawyerById = async (lawyerId) => {
    return await getLawyerById(lawyerId);
}


module.exports = { myCases, caseDetails, lawyerList, createNewCase, lawyerById }