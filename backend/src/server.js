require("dotenv").config();
require("./models")
require("./jobs/hearingReminder");
const app = require("./app");
const sequelize = require("./config/database");

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database Connected");

        await sequelize.sync({ alter: true });
        console.log("Tables Synced");

        await app.listen({
            port: process.env.PORT
        });
        console.log(`Server Running On Port ${process.env.PORT}`);
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
};

startServer();