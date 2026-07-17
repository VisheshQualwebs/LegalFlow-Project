const authController = require("../controllers/authController")
const authenticate = require("../middlewares/authMiddleware");

async function authRoutes(app) {
    app.post("/signup", authController.signup);
    app.post("/login", authController.login);

    app.get("/profile", {
        preHandler: authenticate
    }, async (req, resp) => {
        return {
            success: true,
            user: req.user
        };
    });
}

module.exports = authRoutes;