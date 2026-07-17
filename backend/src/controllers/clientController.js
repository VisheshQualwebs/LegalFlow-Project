const { myCases, caseDetails, lawyerList, createNewCase } = require("../services/clientService")

const createCase = async (req, resp) => {
    const data = await createNewCase(req.user, req.body);
    return resp.status(201).send({
        success: true,
        message: "Case Created Successfully",
        data,
    });
};

const getMyCases = async (req, resp) => {
    const cases = await myCases(req.user.id);
    return resp.send({
        success: true,
        data: cases
    })
};

const getCaseDetails = async (req, resp) => {
    const { id } = req.params;
    const data = await caseDetails(id, req.user.id);
    return resp.send({
        success: true,
        data
    });
}

const getAllLawyers = async (req, resp) => {
    const lawyer = await lawyerList();
    return resp.send({
        success: true,
        data: lawyer,
    })
}

module.exports = { getMyCases, getCaseDetails, getAllLawyers, createCase }