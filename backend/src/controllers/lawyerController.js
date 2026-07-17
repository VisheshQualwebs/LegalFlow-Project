const { myCases, changeCaseStatus, clientsById, allClients } = require("../services/lawyerServices");

const getMyCases = async (req, resp) => {
    const cases = await myCases(req.user.id);
    return resp.send({
        success: true,
        data: cases,
    });
}

const getClientsById = async (req, resp) => {
    const { id } = req.params;
    const lawyerId = req.user.id;
    const client = await clientsById(id, lawyerId);
    return resp.send({
        success: true,
        data: client,
    })
}

const getAllClients = async (req, resp) => {
    const lawyerId = req.user.id;
    const client = await allClients(lawyerId);
    return resp.send({
        success: true,
        data: client,
    })
}

const updateCaseStatus = async (req, resp) => {
    const { caseId } = req.params;
    const { status } = req.body;
    await changeCaseStatus(caseId, req.user.id, status);
    return resp.send({
        success: true,
        message: "Case Updated!!",
    })
};

module.exports = { getClientsById, getMyCases, updateCaseStatus, getAllClients };