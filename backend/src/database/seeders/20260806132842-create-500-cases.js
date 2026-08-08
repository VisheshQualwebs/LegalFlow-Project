'use strict';

const { User, Case } = require("../../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const client = await User.findOne({
      where: {
        email: "vishesh@qualwebs.co"
      }
    })

    if (!client) {
      throw new Error("Client was not found")
    }

    console.log(`Using client: ${client.fullName} (ID: ${client.id})`);

    const caseTypes = [
      "Civil",
      "Criminal",
      "Family",
      "Property",
      "Corporate",
    ];
    // const statuses = "pending";
    const titles = [
      "Property Dispute",
      "Contract Dispute",
      "Family Settlement",
      "Employment Dispute",
      "Consumer Complaint",
      "Land Ownership Dispute",
      "Business Agreement Dispute",
      "Civil Compensation Claim",
      "Rental Agreement Dispute",
      "Inheritance Matter"
    ];
    const cases = [];
    for (let i = 1; i <= 500; i++) {
      const caseType = caseTypes[Math.floor(Math.random() * caseTypes.length)];
      const title = titles[Math.floor(Math.random() * titles.length)];
      const status = "pending";
      // Random hearing date between today and 180 days from today 
      const hearingDate = new Date();
      hearingDate.setDate(hearingDate.getDate() + Math.floor(Math.random() * 180));
      const formattedDate = hearingDate.toISOString().split("T")[0];
      // Random hearing time between 09:00 and 17:00 
      const hour = Math.floor(Math.random() * 9) + 9;
      const minute = Math.floor(Math.random() * 4) * 15;
      const formattedTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
      cases.push({
        clientId: client.id,
        // Admin will assign lawyer later 
        lawyerId: null,
        title: `${title} - Test Case ${i}`,
        description: `This is a test ${caseType.toLowerCase()} 
        case generated for LegalFlow testing and performance evaluation. 
        Case reference number ${i}. The case can later be assigned to a lawyer by the administrator.`,
        caseType,
        status,
        hearingDate: formattedDate,
        hearingTime: formattedTime,
        hearingReminderSent: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await Case.bulkCreate(cases);
    console.log("======================================");
    console.log("500 test cases created successfully.");
    console.log(`Client ID: ${client.id}`);
    console.log(`Client Email: ${client.email}`);
    console.log("Lawyer ID: null");
    console.log("Status: pending");
    console.log("======================================");
  },

  async down(queryInterface, Sequelize) {
    await Case.destroy({
      where: {
        clientId: (
          await User.findOne({
            where: {
              email: "vishesh@qualwebs.co"
            },
          })
        )?.id,
        title: {
          [Sequelize.Op.like]: "%- Test Case %",
        }
      }
    })
    console.log("Generated 500 test cases removed.");
  }
}