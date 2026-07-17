const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Lawyer = sequelize.define(
    "Lawyer",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        barCouncilNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        specialization: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        experience: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        license: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
    tableName: "lawyers",
    timestamps: true,
});

module.exports = Lawyer;