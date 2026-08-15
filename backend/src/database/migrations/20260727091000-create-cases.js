'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cases', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      clientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      lawyerId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      caseType: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM(
          'pending',
          'assigned',
          'in_progress',
          'completed',
          'closed',
          'waiting_for_lawyer',
          'rejected'
        ),
        allowNull: false,
        defaultValue: 'pending',
      },

      hearingDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      hearingTime: {
        type: Sequelize.TIME,
        allowNull: true,
      },

      hearingReminderSent: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    await queryInterface.dropTable('cases');
  },
};