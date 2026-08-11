const { Server } = require("socket.io");

let io;
const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
        },
    });

    io.on("connection", (socket) => {
        console.log("user connected", socket.id);
        socket.on("joinCase", (caseId) => {
            socket.join(`case:${caseId}`);
            console.log(`Socket ${socket.id} joined case: ${caseId}`);
        });

        socket.on("leaveCase", (caseId) => {
            socket.leave(`case:${caseId}`);
            console.log(`Socket ${socket.id} left case: ${caseId}`);
        });

        socket.on("disconnect", () => {
            console.log("user disconnect", socket.id);
        });
    });
    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("socket.io has not been initialized");
    }
    return io;
};

module.exports = { initSocket, getIO }

