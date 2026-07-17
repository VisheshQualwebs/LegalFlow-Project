const { pendingLawyers, approvePendingLawyer, allClients, clientDetails, lawyerDetails, allLawyers, assignLawyerToCase, unassignedCases, } = require("../services/adminService");

// const { pendingLawyers } = require("../services/adminService");

const getPendingLawyers = async (req, resp) => {

    //role, status
    // const users = 
    const lawyers = await pendingLawyerss();
    return resp.send({
        success: true,
        data: lawyers,
    })
}

const approveLawyer = async (req, resp) => {
    const { id } = req.params;
    await approvePendingLawyer(id);
    return resp.send({
        success: true,
        message: "Lawyer Approved",
    })
}

const getClients = async (req, resp) => {
    const clients = await allClients();
    return resp.send({
        success: true,
        data: clients
    })
}

const getClientDetails = async (req, resp) => {
    const client = await clientDetails(req.params.id);
    const totalCases = client.clientCases.length;
    const pendingCases = client.clientCases.filter(c => c.status === "pending").length;
    const assignedCases = client.clientCases.filter(c => c.status === "assigned").length;
    const completedCases = client.clientCases.filter(c => c.status === "completed").length;
    return resp.send({
        success: true,
        data: {
            ...client.toJSON(),
            totalCases, pendingCases, assignedCases, completedCases
        },
    });
}

const getLawyers = async (req, resp) => {
    const clients = await allLawyers();
    return resp.send({
        success: true,
        data: clients
    })
}

const getLawyerDetails = async (req, resp) => {
    const lawyer = await lawyerDetails(req.params.id);
    const totalCases = lawyer.lawyerCases.length;
    const pendingCases = lawyer.lawyerCases.filter(c => c.status === "pending").length;
    const assignedCases = lawyer.lawyerCases.filter(c => c.status === "assigned").length;
    const completedCases = lawyer.lawyerCases.filter(c => c.status === "completed").length;
    return resp.send({
        success: true,
        data: {
            ...lawyer.toJSON(),
            totalCases, pendingCases, assignedCases, completedCases
        },
    });
}

const assignLawyer = async (req, resp) => {
    const { caseId } = req.params;
    const { lawyerId } = req.body;
    await assignLawyerToCase(caseId, lawyerId)
    return resp.send({
        success: true,
        message: "Lawyer Assigned"
    })
}

const unassignCases = async () => {
    const cases = await unassignedCases();
    return resp.send({
        success: true,
        data: cases,
    })
}


module.exports = { getPendingLawyers, approveLawyer, getClients, getClientDetails, getLawyerDetails, assignLawyer, unassignCases, getLawyers };


// module.exports = { getPendingLawyers }