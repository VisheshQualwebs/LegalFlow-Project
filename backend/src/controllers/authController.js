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
    const data = await loginUser(email, password);
    return resp.send({
        success: true,
        message: "Login Successfull",
        data
    })
}


module.exports = { signup, login }