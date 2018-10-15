// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const goods_history = sequelizeClient.define('goods_history', {
    brand: {
      type: DataTypes.STRING,
      allowNull: true
    },
    barcode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    goodnum: {
      type: DataTypes.STRING,
      allowNull: true
    },
    styleno: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true
    },
    size: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // 系列
    series: {
      type: DataTypes.STRING,
      allowNull: true
    },
    year: {
      type: DataTypes.STRING,
      allowNull: true
    },
    price: {
      type: DataTypes.STRING,
      allowNull: true
    },
    season: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // 仓库名
    warehouse: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // 次品
    badnum: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // 入库时间
    intime: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  goods_history.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return goods_history;
};
