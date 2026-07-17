const fastify = require("fastify");
const app = fastify({ logger: true });
const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const caseRoutes = require("./routes/caseRoutes");
const lawyerRoutes = require("./routes/lawyerRoutes");
const clientRoutes = require("./routes/clientRoutes");
const errorHandler = require("./middlewares/errorHandler");
const userRoutes = require("./routes/userRoutes");
const cors = require("@fastify/cors");
const multipart = require("@fastify/multipart");

app.register(cors, {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
});

app.setErrorHandler(errorHandler);

app.get("/test", async () => {
    throw new Error("Something went wrong");
})

app.register(multipart);

app.register(healthRoutes);

app.register(authRoutes, {
prefix: "/auth"
});

app.register(userRoutes)

app.register(caseRoutes)

app.register(adminRoutes, {
    prefix: "/admin"
});

app.register(caseRoutes, {
    prefix: "/cases"
})

app.register(lawyerRoutes, {
    prefix: "/lawyers",
});

app.register(clientRoutes, {
    prefix: "/client",
});

module.exports = app;