const authenticate = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const clientController = require("../controllers/clientController")

async function clientRoutes(app) {

    app.post("/new-case", {
        preHandler: [authenticate, authorizeRoles("client")],
    },
        clientController.createCase
    );

    app.get("/cases/:caseId", {
        preHandler: [authenticate, authorizeRoles("client")]
    },
        clientController.getCaseDetails
    )

    app.get("/lawyers", {
        preHandler: [authenticate, authorizeRoles("client")]
    },
        clientController.getAllLawyers
    )

};

module.exports = clientRoutes;

/* 
PATCH /cases/:id

DELETE /cases/:id

GET /lawyers/:id
*/