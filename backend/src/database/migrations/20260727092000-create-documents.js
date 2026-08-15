'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('documents', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      caseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cases',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      fileName: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      originalName: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'NA',
      },

      filePath: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      fileType: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      fileSize: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      version: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },

      uploadedBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('documents');
  },
};