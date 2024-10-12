'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chatroom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Chatroom.belongsTo(
        models.User,
        {
          foreignKey: 'userId',
          onDelete: 'CASCADE'
        }
      ),
      Chatroom.belongsTo(
        models.Show,
        {
          foreignKey: 'showId',
          onDelete: 'CASCADE'
        }
      ),
      Chatroom.hasMany(
        models.Message,
        {
          foreignKey: 'roomId',
          onDelete: 'CASCADE'
        }
      )
    }
  }
  Chatroom.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    showId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    chatroomDesc: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Chatroom description is required'
        },
        len: {
          args: [50-500],
          msg: 'Chatroom description must be between 50 and 500 characters'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Chatroom',
  });
  return Chatroom;
};
