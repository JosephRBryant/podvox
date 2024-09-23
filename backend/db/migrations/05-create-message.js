'use strict';

let options = {};
options.tableName = "Messages"
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      roomId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        allowNull: false,
        references: {
          model: 'Chatrooms',
          key: 'id'
        }
      },
      sessionId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      nickname: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      content: {
        type: Sequelize.STRING(350),
        allowNull: false
      },
      edited: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Messages"
    await queryInterface.dropTable('Messages');
  }
};
