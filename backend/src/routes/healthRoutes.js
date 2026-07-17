async function healthRoutes(fastify, options){
    fastify.get("/health", async (req, resp) => {
        return {
            success: true,
            message: "Server is running"
        };
    });
}

module.exports = healthRoutes;