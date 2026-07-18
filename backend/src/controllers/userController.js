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

 if (
        req.user.role !== "admin" &&
        req.user.id !== Number(req.params.id)
    ) {
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



// const { User } = require("../models");

// const list = async (req, resp) => {
//     const role = req.query.role;
//     const status = req.query.status;

//     const users = User.findAll({
//         where: {
//             role,
//             status
//         }
//     })

//     return resp.send({
//         success: true,
//         message: "Login",
//     })
// }

// const read = async (req, resp) => {
//     const id = req.query.id;

//     const users = User.findIOne({
//         where: {
//             id,
//         }
//     })

//     return resp.send({

//     })
// }

// const update = async (req, resp) => {
//     const id = req.params.user_id;
//     const role = req.payload.role;

//     const users = User.findIOne({
//         where: {
//             id,
//         }
//     })
//     if(!user) {
//         throw new error
//     }

//     user.status = "p"

//     return resp.send({

//     })
// }