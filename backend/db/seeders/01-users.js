'use strict';

const {User, Sequelize} = require('../models');
const bcrypt = require('bcryptjs');


let options = {};
options.tableName = 'Users';

if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;
}

module.exports = {


    up: async (queryInterface, Sequelize) => {
      options.tableName = "Users";
      return queryInterface.bulkInsert(options, [
        {
          email: 'alice@user.io',
          username: 'AliceSmith',
          firstName: 'Alice',
          lastName: 'Smith',
          hashedPassword: bcrypt.hashSync('password'),
          profileImg: 'https://toginet.com/images/podvox/profiles/alice-smith.jpg'
        },
        {
          email: 'bob@user.io',
          username: 'BobJohnson',
          firstName: 'Bob',
          lastName: 'Johnson',
          hashedPassword: bcrypt.hashSync('password'),
          profileImg: 'https://toginet.com/images/podvox/profiles/bob-johnson.jpg'
        },
        {
          email: 'emma@user.io',
          username: 'EmmaBrown',
          firstName: 'Emma',
          lastName: 'Brown',
          hashedPassword: bcrypt.hashSync('password'),
          profileImg: 'https://toginet.com/images/podvox/profiles/emma-brown.jpg'
        },
        {
          email: 'david@user.io',
          username: 'DavidLee',
          firstName: 'David',
          lastName: 'Lee',
          hashedPassword: bcrypt.hashSync('password'),
          profileImg: 'https://toginet.com/images/podvox/profiles/david-lee.jpg'
        },
        {
          email: 'sophia@user.io',
          username: 'SophiaWhite',
          firstName: 'Sophia',
          lastName: 'White',
          hashedPassword: bcrypt.hashSync('password'),
          profileImg: 'https://toginet.com/images/podvox/profiles/sophia-white.jpg'
        },
        {
          email: 'tom@user.io',
          username: 'TomBlack',
          firstName: 'Tom',
          lastName: 'Black',
          hashedPassword: bcrypt.hashSync('password'),
          profileImg: 'https://toginet.com/images/podvox/profiles/tom-black.jpg'
        },
        {
          email: 'olivia@user.io',
          username: 'OliviaGreen',
          firstName: 'Olivia',
          lastName: 'Green',
          hashedPassword: bcrypt.hashSync('password'),
          profileImg: 'https://toginet.com/images/podvox/profiles/olivia-green.jpg'
        },
        {
          email: 'liam@user.io',
          username: 'LiamClark',
          firstName: 'Liam',
          lastName: 'Clark',
          hashedPassword: bcrypt.hashSync('password'),
          profileImg: 'https://toginet.com/images/podvox/profiles/liam-clark.jpg'
        },
        {
          email: 'mia@user.io',
          username: 'MiaMartinez',
          firstName: 'Mia',
          lastName: 'Martinez',
          hashedPassword: bcrypt.hashSync('password'),
          profileImg: 'https://toginet.com/images/podvox/profiles/mia-martinez.jpg'
        },
        {
          email: 'noah@user.io',
          username: 'NoahHarris',
          firstName: 'Noah',
          lastName: 'Harris',
          hashedPassword: bcrypt.hashSync('password'),
          profileImg: 'https://toginet.com/images/podvox/profiles/noah-harris.jpg'
        }
      ], {})
    },



    down: async (queryInterface, Sequelize) => {
      options.tableName = "Users";
      const Op = Sequelize.Op;
      return queryInterface.bulkDelete(options, {
        username: {[Op.in]: []}
      })
    }
  }
