const fastify = require("fastify");
const app = fastify({ logger: true });
const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const caseRoutes = require("./routes/caseRoutes");
const errorHandler = require("./middlewares/errorHandler");
const userRoutes = require("./routes/userRoutes");
const cors = require("@fastify/cors");
const multipart = require("@fastify/multipart");
const documentRoutes = require("./routes/documentRoute");
const path = require("path");
const fastifyStatic = require("@fastify/static");

app.register(cors, {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
});

app.register(fastifyStatic, {
    root: path.join(process.cwd(), "uploads"),
    prefix: "/uploads/",
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

app.register(userRoutes);

app.register(caseRoutes);

app.register(documentRoutes);

// app.register(caseRoutes, {
//     prefix: "/cases"
// })


module.exports = app;