'use strict';
module.exports = (sequelize, Sequelize) => {
  const Bus = sequelize.define("Bus", {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    // source: {
    //   type: Sequelize.STRING,
    //   allowNull: false
    // },
    // destination: {
    //   type: Sequelize.STRING,
    //   allowNull: false
    // },
    seats: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  },
  { timestamps: false}
);

Bus.associate = (models) => {
  Bus.belongsTo(models.Category, {
    foreignKey: {
      name: 'categoryId_1',
      allowNull: false
  },
  as: 'category1'
  });

  Bus.belongsTo(models.Category, {
    foreignKey: {
      name: 'categoryId_2',
      allowNull: false
  },
    as: 'category2'
  });

  Bus.hasMany(models.Date_Bus_Mapper, {
    foreignKey: 'busId',
  });

  Bus.hasMany(models.Route, {
    foreignKey: 'busId',
  });

}

  return Bus;
};
