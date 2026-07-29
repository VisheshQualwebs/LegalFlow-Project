const documentController = require("../controllers/documentController");
const { summarizeDocumentController } = require("../controllers/summarizeDocumentController");
const authenticate = require("../middlewares/authMiddleware");

async function documentRoutes(app) {

    app.get("/documents", {
        preHandler: [authenticate],
    }, documentController.list);

    app.get("/documents/:id/view", {
        preHandler: [authenticate],
    }, documentController.viewDocument);

    app.get("/documents/:id/download", {
        preHandler: [authenticate],
    }, documentController.downloadDocument);

    app.post("/documents/:id/summarize", {
        preHandler: [authenticate],
    }, summarizeDocumentController)

}

module.exports = documentRoutes;