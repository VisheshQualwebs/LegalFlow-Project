const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Document = sequelize.define(
    "Document",
    {

        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        caseId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        fileName: {
            type: DataTypes.STRING,
            allowNull: false
        },

        originalName: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "NA"
        },

        filePath: {
            type: DataTypes.STRING,
            allowNull: false
        },

        fileType: {
            type: DataTypes.STRING,
            allowNull: false
        },

        fileSize: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        version: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },

        uploadedBy: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }

    },
    {
        tableName: "documents",
        timestamps: true
    }
);


module.exports = Document;