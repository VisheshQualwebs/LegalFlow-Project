'use strict';
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const password = await bcrypt.hash("Lawyer@123", 10);

    const lawyers = ["Aarav Sharma",
      "Aditya Verma",
      "Arjun Mehta",
      "Rohan Singh",
      "Rahul Gupta",
      "Vikram Patel",
      "Karan Malhotra",
      "Ankit Jain",
      "Mohit Agarwal",
      "Nikhil Joshi",
      "Siddharth Rao",
      "Varun Kapoor",
      "Manish Tiwari",
      "Abhishek Soni",
      "Rajat Saxena",
      "Yash Mishra",
      "Akash Srivastava",
      "Harsh Vyas",
      "Devendra Sharma",
      "Pranav Bansal",
      "Ishaan Khanna",
      "Ayush Pandey",
      "Ritvik Choudhary",
      "Saurabh Yadav",
      "Dhruv Mehta",
    ];

    // const specializations = [
    //   "Corporate Law",
    //   "Criminal Law",
    //   "Civil Law",
    //   "Family Law",
    //   "Intellectual Property Law",
    //   "Tax Law",
    //   "Cyber Law",
    //   "Environmental Law",
    //   "Real Estate Law",
    //   "Constitutional Law",
    //   "Labor and Employment Law",
    //   "Immigration Law"
    // ];

    const lawyerData = lawyers.map((fullName, index) => ({
      fullName,
      email: `lawyer${index + 1}@legalflow.com`,
      phone: `98765${String(10000 + index).slice(-5)}`,
      password,
      role: "lawyer",
      status: "pending",
      // barCouncilNumber: Math.floor(Math.random() * 100),
      // specialization: specializations[Math.floor(Math.random * specializations.length)],
      // experience: Math.floor(Math.random() * 15) + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("users", lawyerData);
    console.log("======================================");
    console.log("25 lawyers created successfully.");
    console.log("Email: lawyer1@legalflow.test");
    console.log("       lawyer2@legalflow.test");
    console.log("       ...");
    console.log("       lawyer25@legalflow.test");
    console.log("Password: Lawyer@123");
    console.log("Status: approved");
    console.log("======================================");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "users",
      {
        email: {
          [Sequelize.Op.like]: "lawyer%@legalflow.com",
        },
        role: "lawyer",
      }
    );
    console.log("25 test lawyers removed successfully.");
  }
};
