'use strict';
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const existingAdmin = await queryInterface.sequelize.query(`SELECT id FROM "users" WHERE email = 'admin@legalflow.com';`, {
      type: Sequelize.QueryTypes.SELECT,
    });

    if (existingAdmin.length === 0) {
      const hashedpassword = await bcrypt.hash("admin@123", 10);

      await queryInterface.bulkInsert("users", [
        {
          fullName: "Admin",
          email: "admin@legalflow.com",
          password: hashedpassword,
          role: "admin",
          status: "approved",
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ])
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", {
      email: "admin@legalflow.com",
    })
  }
};
