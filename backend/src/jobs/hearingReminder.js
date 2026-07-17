const cron = require("node-cron");
const { Op } = require("sequelize");
const { Case, User } = require("../models");
const { sendMail } = require("../utils/mail");

cron.schedule("0 7 * * *", async () => {
    try {
        console.log("Checking upcoming hearings...");

        const today = new Date();

        const reminderDate = new Date();
        reminderDate.setDate(today.getDate() + 7);

        // Format YYYY-MM-DD
        const date = reminderDate.toISOString().split("T")[0];

        const cases = await Case.findAll({
            where: {
                hearingDate: {
                    [Op.eq]: date,
                },
                hearingReminderSent: false,
            },
            include: [
                {
                    model: User,
                    as: "client",
                    attributes: ["id", "fullName", "email"],
                },
                {
                    model: User,
                    as: "lawyer",
                    attributes: ["id", "fullName", "email"],
                },
            ],
        });

        for (const item of cases) {

            if (item.client?.email) {
                await sendMail({
                    to: item.client.email,
                    subject: "Upcoming Hearing Reminder",
                    html: `
                        <h2>LegalFlow</h2>

                        <p>Hello ${item.client.fullName},</p>

                        <p>Your hearing is scheduled on Hearing Date:<b>${item.hearingDate}</b>.</p>
                        <p>Hearing Time:<b>${item.hearingTime}</b></p>

                        <p>Please make sure you attend the hearing on time.</p>

                        <br> 

                        <p>Regards,</p>
                        <p>LegalFlow Team</p>
                    `,
                });
            }

            // Lawyer Email
            if (item.lawyer?.email) {
                await sendMail({
                    to: item.lawyer.email,
                    subject: "Upcoming Hearing Reminder",
                    html: `
                        <h2>LegalFlow</h2>

                        <p>Hello ${item.lawyer.fullName},</p>

                        <p>You have a hearing on <b>${item.hearingDate}</b>.</p>
                        <p>Hearing Time:<b>${item.hearingTime}</b></p>

                        <p>Client: <b>${item.client.fullName}</b></p>

                        <br>

                        <p>Regards,</p>
                        <p>LegalFlow Team</p>
                    `,
                });
            }

            // Prevent duplicate emails
            item.hearingReminderSent = true;
            await item.save();
        }

        console.log(`${cases.length} reminder(s) sent`);

    } catch (error) {
        console.error("Hearing Reminder Error:", error.message);
    }
});