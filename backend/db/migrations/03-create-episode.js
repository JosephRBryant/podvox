'use strict';

let options = {};
options.tableName = "Episodes"
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Episodes', {
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
      showId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        allowNull: false,
        references: {
          model: 'Shows',
          key: 'id'
        }
      },
      episodeTitle: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      episodeDesc: {
        type: Sequelize.STRING(4000),
        allowNull: false
      },
      guestInfo: {
        type: Sequelize.STRING(150)
      },
      pubDate: {
        type: Sequelize.DATE
      },
      duration: {
        type: Sequelize.INTEGER
      },
      size: {
        type: Sequelize.INTEGER
      },
      tags: {
        type: Sequelize.STRING(300),
        allowNull: false
      },
      episodeUrl: {
        type: Sequelize.STRING
      },
      episodeImage: {
        type: Sequelize.STRING
      },
      explicit: {
        type: Sequelize.BOOLEAN
      },
      published: {
        type: Sequelize.BOOLEAN
      },
      prefix: {
        type: Sequelize.STRING
      },
      downloads: {
        type: Sequelize.INTEGER
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
    options.tableName = "Episodes";
    await queryInterface.dropTable('Episodes');
  }
};
