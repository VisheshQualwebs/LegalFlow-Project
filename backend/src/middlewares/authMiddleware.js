const jwt = require("jsonwebtoken");

const authenticate = async (req, resp) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new Error("token missing")
        }

        if (!authHeader.startsWith("Bearer ")) {
            throw new Error("Invalid Authorization Header");
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (error) {
        return resp.status(401).send({
            success: false,
            message: "Invalid Token",
        });
    }
};

module.exports = authenticate;