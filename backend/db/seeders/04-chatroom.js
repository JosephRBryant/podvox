'use strict';

const { Chatroom } = require('../models');

let options = {};
options.tableName = "Chatrooms";
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await Chatroom.bulkCreate([
        {
          userId: 1,
          showId: 1,
          chatroomDesc: "Join the conversation about the latest tech trends, gadgets, and innovation news."
        },
        {
          userId: 2,
          showId: 2,
          chatroomDesc: "A place to share your fitness journey, ask workout questions, and get tips from health experts."
        },
        {
          userId: 3,
          showId: 3,
          chatroomDesc: "Share recipes, cooking tips, and foodie adventures with fellow culinary enthusiasts."
        },
        {
          userId: 4,
          showId: 4,
          chatroomDesc: "Explore historical events, share insights, and debate with fellow history buffs."
        },
        {
          userId: 5,
          showId: 5,
          chatroomDesc: "Connect with others practicing mindfulness and share tips for living a more present and balanced life."
        },
        {
          userId: 6,
          showId: 6,
          chatroomDesc: "Talk all things sports—discuss the latest games, share predictions, and debate with fellow fans."
        },
        {
          userId: 7,
          showId: 7,
          chatroomDesc: "Join fellow book lovers to discuss your favorite reads, share book recommendations, and dive deep into literary discussions."
        },
        {
          userId: 8,
          showId: 8,
          chatroomDesc: "Connect with professionals to discuss business strategies, industry trends, and tips for achieving success."
        },
        {
          userId: 9,
          showId: 9,
          chatroomDesc: "Dive into discussions about the latest in movies, TV shows, celebrity news, and all things pop culture."
        },
        {
          userId: 10,
          showId: 10,
          chatroomDesc: "Share your travel stories, tips, and destination recommendations with fellow globetrotters."
        }
      ])
    } catch(error) {
      console.error('Error during seeding chatrooms: ', error);
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Chatrooms';
    let chatrooms = await Chatroom.findAll();
    return queryInterface.bulkDelete(options, null, {})
  }
};
