const { registerUser, loginUser, } = require("../services/authService");

const signup = async (req, resp) => {
    const user = await registerUser(req.body);
    return resp.status(201).send({
        success: true,
        message: "User Registered Successfully",
        data: user
    })
};

const login = async (req, resp) => {
    const { email, password } = req.body;
    try {
        const data = await loginUser(email, password);
        return resp.status(200).send({
            success: true,
            message: "Login Successfull",
            data
        })
    } catch (error) {
        return resp.status(401).send({
            success: false,
            message: error.message,
        })
    }
}


module.exports = { signup, login }