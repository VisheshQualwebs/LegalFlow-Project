const authorizeRoles = (...allowedRoles) => {
    return (req, resp, done) => {
        if(!allowedRoles.includes(req.user.role)){
            return resp.status(403).send({
                success: false,
                message: "access denied",
            });
        }
        done();
    };
};

module.exports = authorizeRoles;