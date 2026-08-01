'use strict';
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    console.log("seeder started")
    const existingAdmin = await queryInterface.sequelize.query(`SELECT id FROM "users" WHERE email = 'admin@legalflow.com';`, {
      type: Sequelize.QueryTypes.SELECT,
    });

    if (existingAdmin.length === 0) {
      console.log("Inserting user")
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
      ]);
      console.log("Inserted");
      console.log({
        DB_HOST: process.env.DB_HOST,
        DB_NAME: process.env.DB_NAME,
        DB_USER: process.env.DB_USER,
        NODE_ENV: process.env.NODE_ENV,
      });
      const result = await queryInterface.sequelize.query(
        `SELECT * FROM "users" WHERE email='admin@legalflow.com';`
      );

      console.log(result);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", {
      email: "admin@legalflow.com",
    })
  }
};
