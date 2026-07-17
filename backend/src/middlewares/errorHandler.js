const errorHandler = async (error, req, resp) => {
    const statusCode = error.statusCode || 500;
    console.log(error);
    return resp.status(error.statusCode || 500).send({
        success: false,
        message: error.message || "Internal Server Error"
    })
}

module.exports = errorHandler;