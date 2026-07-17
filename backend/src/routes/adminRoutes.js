const adminController = require("../controllers/adminController");
const authorizeRoles = require("../middlewares/roleMiddleware");
const authenticate = require("../middlewares/authMiddleware");

async function adminRoutes(app) {
//     app.get("/users", {
//         preHandler: [authenticate, authorizeRoles("admin")]
//     },
//         adminController.getPendingLawyers
//     );

//     app.patch("/users/[user]")
// }

    app.patch("/lawyer/:id/approve", {
        preHandler: [authenticate, authorizeRoles("admin")]
    },
        adminController.approveLawyer
    );

    app.get("/clients", {
        preHandler: [authenticate, authorizeRoles("admin")]
    },
        adminController.getClients
    );

    app.get("/clients/:id", {
        preHandler: [authenticate, authorizeRoles("admin")]
    },
        adminController.getClientDetails
    );

    app.get("/lawyers", {
        preHandler: [authenticate, authorizeRoles("admin")]
    },
        adminController.getLawyers
    );

    app.get("/lawyer/:id", {
        preHandler: [authenticate, authorizeRoles("admin")]
    },
        adminController.getLawyerDetails
    );

    app.patch("/admin/:caseId/assign-lawyer", {
        preHandler: [authenticate, authorizeRoles("admin")]
    },
        adminController.assignLawyer
    );

    app.get("/unassigned-cases", {
        preHandler: [authenticate, authorizeRoles("admin")]
    },
        adminController.unassignCases
    )
};

module.exports = adminRoutes;