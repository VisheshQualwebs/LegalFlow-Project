const userService = require("../services/userService");

const list = async (req, resp) => {
    const users = await userService.list(req.query);
    return resp.send({
        success: true,
        data: users
    });
};

const read = async (req, resp) => {
    const user = await userService.read(
        req.user,
        req.params.id,
        req.query
    );
    return resp.send({
        success: true,
        data: user
    });
};

const update = async (req, resp) => {
    if (req.user.role !== "admin" && req.user.id !== Number(req.params.id)) {
        return resp.code(403).send({
            message: "Forbidden"
        });
    }
    await userService.update(
        req.user,
        req.params.id,
        req.body
    );
    return resp.send({
        success: true,
        message: "User Updated Successfully"
    });
};

const destroy = async (req, resp) => {
    await userService.remove(req.user, req.params.id);
    return resp.send({
        success: true,
        message: "User Deleted Successfully"
    });
};

module.exports = { list, read, update, destroy };