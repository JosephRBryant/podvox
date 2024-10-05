'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Episode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Episode.belongsTo(
        models.User,
        {
          foreignKey: 'userId',
          onDelete: 'CASCADE'
        }
      ),
      Episode.belongsTo(
        models.Show,
        {
          foreignKey: 'showId',
          onDelete: 'CASCADE'
        }
      )
    }
  }
  Episode.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    showId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    episodeTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Episode title is required'
        },
        len: {
          args: [3, 150],
          msg: 'Episode title must be between 3 and 150 characters'
        },
        // is: {
        //   args: /^[a-zA-Z\s]+$/,
        //   msg: 'Episode title must be only letters and spaces'
        // }
      }
    },
    episodeDesc: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Episode description is required'
        },
        len: {
          args: [50, 4000],
          msg: 'Episode description must be between 50 and 4000 characters'
        },
        // is: {
        //   args: /^[a-zA-Z\s]+$/,
        //   msg: 'Episode description must be only letters and spaces'
        // }
      }
    },
    guestInfo: {
      type: DataTypes.STRING
    },
    pubDate: {
      type:DataTypes.DATE
    },
    duration: {
      type: DataTypes.INTEGER
    },
    size: {
      type: DataTypes.INTEGER
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Tags are required'
        },
        len: {
          args: [3, 300],
          msg: 'Tags must be between 3 and 300 characters'
        },
        // is: {
        //   args: /^[a-zA-Z\s]+$/,
        //   msg: 'Tags must be only letters and spaces'
        // }
      }
    },
    episodeUrl: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          msg: 'Episode URL must be a URL'
        }
      }
    },
    episodeImage: {
      type: DataTypes.STRING,
      // validate: {
      //   isUrl: {
      //     msg: 'Episode image must but a URL'
      //   }
      // }
    },
    explicit: {
      type: DataTypes.BOOLEAN,
    },
    published: {
      type: DataTypes.BOOLEAN,
    },
    prefix: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          msg: 'Episode prefix must be a URL'
        }
      }
    },
    downloads: {
      type: DataTypes.INTEGER,
    }
  }, {
    sequelize,
    modelName: 'Episode',
  });
  return Episode;
};
