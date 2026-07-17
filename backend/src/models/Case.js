const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Case = sequelize.define(
    "Case",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        clientId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        lawyerId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        caseType: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        status: {
            type: DataTypes.ENUM(
                "pending", "assigned", "in_progress", "completed", "closed", "waiting_for_lawyer", "rejected"
            ),
            defaultValue: "pending",
        },

        hearingDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        hearingTime: {
            type: DataTypes.TIME,
            allowNull: true,
        },

        hearingReminderSent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    },
    {
        tableName: "cases",
        timestamps: true,
    }
);

module.exports = Case;