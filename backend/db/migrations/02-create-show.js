'use strict';

let options = {};
options.tableName = "Shows"
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Shows', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      showTitle: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true
      },
      showSubtitle: {
        type: Sequelize.STRING(150)
      },
      showDesc: {
        type: Sequelize.STRING(4000),
        allowNull: false
      },
      author: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      showLink: {
        type: Sequelize.STRING,
        unique: true
      },
      category: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      showImage: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      language: {
        type: Sequelize.STRING,
        allowNull: false
      },
      explicit: {
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
    options.tableName = "Shows";
    await queryInterface.dropTable('Shows');
  }
};
