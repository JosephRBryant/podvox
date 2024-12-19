'use strict';
const {
  Model, ValidationError
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Show extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Show.belongsTo(
        models.User,
        {
          foreignKey: 'userId',
          onDelete: 'CASCADE'
        }
      ),
      Show.hasMany(
        models.Episode,
        { foreignKey: 'showId', onDelete: 'CASCADE'}
      ),
      Show.hasOne(
        models.Chatroom,
        { foreignKey: 'showId', onDelete: 'CASCADE'}
      )
    }
  }
  Show.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    showTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Show title already in use'
      },
      validate: {
        notNull: {
          msg: 'Show title is required'
        },
        len: {
          args: [3, 150],
          msg: 'Show title must be between 3 and 150 characters'
        },
        // is: {
        //   args: /^[a-zA-Z\s]+$/,
        //   msg: 'Show title must be only letters and spaces'
        // }
      }
    },
    showSubtitle: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3, 150],
          msg: 'Show subtitle must be between 3 and 150 characters'
        },
        // is: {
        //   args: /^[a-zA-Z\s]+$/,
        //   msg: 'Show subtitle must be only letters and spaces'
        // }
      }
    },
    showDesc: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Show description is required'
        },
        len: {
          args: [50, 4000],
          msg: 'Show description must be between 50 and 4000 characters'
        },
        // is: {
        //   args: /^[a-zA-Z\s]+$/,
        //   msg: 'Show description must be only letters and spaces'
        // }
      }
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Author is required'
        },
        len: {
          args: [3, 100],
          msg: 'Author must be between 3 and 100 characters'
        },
        // is: {
        //   args: /^[a-zA-Z\s]+$/,
        //   msg: 'Author must be only letters and spaces'
        // }
      }
    },
    showLink: {
      type: DataTypes.STRING,
      // unique: {
      //   msg: 'Link must be unique'
      // },
      validate: {
        isURL: {
          msg: 'Show link must be a URL'
        }
      }
    },
    category: {
      type: DataTypes.STRING,
      validate: {
        len: {
          arg: [2, 150],
          msg: 'Show categories must be between 2 and 150 characters'
        }
      }
    },
    showImage: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Show image must be unique'
      },
      validate: {
        notNull: {
          msg: 'Show image is required'
        },
        isUrl: {
          msg: 'Show image must be a URL'
        }
      }
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Show language is required'
        },
        // is: {
        //   args: /^[a-zA-Z\s]+$/,
        //   msg: 'Show language must be only letters and spaces'
        // }
      }
    },
    explicit: {
      type: DataTypes.BOOLEAN
    }
  }, {
    sequelize,
    modelName: 'Show',
  });
  return Show;
};
