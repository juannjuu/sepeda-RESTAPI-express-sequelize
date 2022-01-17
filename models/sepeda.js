'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sepeda extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Sepeda.belongsTo(models.Vendor, {as : "vendor", foreignKey: "vendorId"})
    }
  };
  Sepeda.init({
    name: DataTypes.STRING,
    vendorId: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Sepeda',
  });
  return Sepeda;
};