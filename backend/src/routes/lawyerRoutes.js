const lawyerController = require("../controllers/lawyerController");
const authenticate = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

async function lawyerRoutes(app) {
    app.get("/my-cases", {
        preHandler: [authenticate, authorizeRoles("lawyer")]
    },
        lawyerController.getMyCases
    );
    app.patch("/cases/:caseId/status", {
        preHandler: [authenticate, authorizeRoles("lawyer")]
    },
        lawyerController.updateCaseStatus
    );

    app.get("/clients/:id", {
        preHandler: [authenticate, authorizeRoles("lawyer")]
    },
        lawyerController.getClientsById
    )

    app.get("/clients", {
        preHandler: [authenticate, authorizeRoles("lawyer")]
    },
        lawyerController.getAllClients
    )
}

module.exports = lawyerRoutes;


/* 
GET /pending-requests

PATCH /cases/:id/accept

PATCH /cases/:id/reject

*/

