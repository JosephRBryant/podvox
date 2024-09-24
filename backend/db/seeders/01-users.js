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
          hashedPassword: bcrypt.hashSync('password'),
          profileImg: ''
        },
        {
          email: 'bob@user.io',
          username: 'BobJohnson',
          hashedPassword: bcrypt.hashSync('password'),
          profileImg: ''
        },
        {
          email: 'emma@user.io',
          username: 'EmmaBrown',
          hashedPassword: bcrypt.hashSync('password'),
          profileImg: ''
        },
        {
          email: 'david@user.io',
          username: 'DavidLee',
          hashedPassword: bcrypt.hashSync('password'),
          profileImg: ''
        },
        {
          email: 'sophia@user.io',
          username: 'SophiaWhite',
          hashedPassword: bcrypt.hashSync('password'),
          profileImg: ''
        },
        {
          email: 'tom@user.io',
          username: 'TomBlack',
          hashedPassword: bcrypt.hashSync('password'),
          profileImg: ''
        },
        {
          email: 'olivia@user.io',
          username: 'OliviaGreen',
          hashedPassword: bcrypt.hashSync('password'),
          profileImg: ''
        },
        {
          email: 'liam@user.io',
          username: 'LiamClark',
          hashedPassword: bcrypt.hashSync('password'),
          profileImg: ''
        },
        {
          email: 'mia@user.io',
          username: 'MiaMartinez',
          hashedPassword: bcrypt.hashSync('password'),
          profileImg: ''
        },
        {
          email: 'noah@user.io',
          username: 'NoahHarris',
          hashedPassword: bcrypt.hashSync('password'),
          profileImg: ''
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
