'use strict';
module.exports = (sequelize, Sequelize) => {
  const Route = sequelize.define("Route", {
    source: {
      type: Sequelize.STRING,
      allowNull: false
    },
    destination: {
      type: Sequelize.STRING,
      allowNull: false
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  },
  { timestamps: false }
);

Route.associate = (models) => {
  Route.belongsTo(models.Bus, {
    foreignKey: {
      name: 'busId',
      allowNull: false
    }
  });
};

  return Route;
};
