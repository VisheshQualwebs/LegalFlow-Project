const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const registerUser = async (userData) => {
    const existingUser = await User.findOne({
        where: {
            email: userData.email.toLowerCase()
        }
    });

    if (existingUser) {
        throw new Error("Email already Exist");
    }

    const hashedpassword = await bcrypt.hash(userData.password, 10);

    if (userData.role === "lawyer") {
        if (!userData.barCouncilNumber ||  !userData.specialization || !userData.experience) {
            throw new Error("Lawyer details are required");
        }
    }

    const user = await User.create({
        ...userData,
        password: hashedpassword,
        status: userData.role === "lawyer" ? "pending" : "approved"
    });

    return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status
    };
};

const loginUser = async (email, password) => {

    const user = await User.findOne({
        where: {
            email
        }
    });

    if (!user) {
        throw new Error("Invalid Email or Password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid Email or Password!!")
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

