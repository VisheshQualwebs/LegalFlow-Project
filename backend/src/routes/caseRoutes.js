const caseController = require("../controllers/caseController");
const authenticate = require("../middlewares/authMiddleware");

async function caseRoutes(app) {

    app.post("/cases", {
        preHandler: [authenticate]
    }, caseController.create);

    app.get("/cases", {
        preHandler: [authenticate]
    }, caseController.list);

    app.get("/cases/:id", {
        preHandler: [authenticate]
    }, caseController.read);

    app.patch("/cases/:id", {
        preHandler: [authenticate]
    }, caseController.update);

    app.delete("/cases/:id", {
    preHandler: [authenticate]
    }, caseController.destroy);

}

module.exports = caseRoutes;