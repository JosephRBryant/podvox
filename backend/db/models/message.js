'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Message.belongsTo(
        models.Chatroom,
        {
          foreignKey: 'roomId',
          onDelete: 'CASCADE'
        }
      )
    }
  }
  Message.init({
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sessionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Nickname already in use'
      },
      validate: {
        len: {
          args: [4,50],
          msg: 'Nickname must be between 4 and 50 characters'
        }
      }
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          arg: [3, 350],
          msg: 'Message must be between 3 and 350 characters'
        }
      }
    },
    edited: {
      type: DataTypes.BOOLEAN
    }
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};
