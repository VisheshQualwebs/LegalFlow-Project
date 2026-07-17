const User = require("../models/User");
const Lawyer = require("../models/Lawyer")

const createUser = async (userData) => {
    return await User.create(userData);
}

const createLawyer = async (lawyerData) => {
    return await Lawyer.create(lawyerData);
}

const findUserByEmail = async (email) => {
    return await User.findOne({
        where: {
            email
        }
    });
};

module.exports = { createUser, createLawyer, findUserByEmail }