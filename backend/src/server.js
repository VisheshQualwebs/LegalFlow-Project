require("dotenv").config();
require("./models")
require("./jobs/hearingReminder");
const app = require("./app");
const sequelize = require("./config/database");
const { initSocket } = require("./utils/socket");

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database Connected");
        await app.ready();
        initSocket(app.server);
        await app.listen({
            port: process.env.PORT,
            host: "0.0.0.0"
        });
        console.log(`Server Running On Port ${process.env.PORT}`);
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
};

startServer();