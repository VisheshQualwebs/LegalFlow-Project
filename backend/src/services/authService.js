const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { createUser, findUserByEmail, createLawyer } = require("../repositories/userRepository");

const registerUser = async (userData) => {
    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) {
        throw new Error("Email already Exist");
    }

    const hashedpassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedpassword;

    if (userData.role === "lawyer") {
        userData.status = "pending";
    } else {
        userData.status = "approved";
    }

    const user = await createUser(userData);

    if (user.role === "lawyer") {
        await createLawyer({
            userId: user.id,
            barCouncilNumber: userData.barCouncilNumber,
            specialization: userData.specialization,
            experience: userData.experience,
            license: userData.license,
        });
    }

    return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status
    };
};

const loginUser = async (email, password) => {

    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error("Invalid Email");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid Password!!")
    }

    if (user.role === "lawyer" && user.status !== "approved") {
        throw new Error("Waiting for approval")
    }

    const token = jwt.sign({
        id: user.id,
        role: user.role,
    },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        });

    return {
        token,
        user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            status: user.status
        }
    };
};

module.exports = { registerUser, loginUser }

