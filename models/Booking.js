'use strict';
module.exports = (sequelize, Sequelize) => {
  const Booking = sequelize.define("Booking", {
    qty: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    // path: {
    //   type: Sequelize.INTEGER,
    //   allowNull: false
    // },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'active'
    },
    amount: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    totalAmount: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }
);

  Booking.associate = (models) => {
    Booking.belongsTo(models.Bus, {
      foreignKey: {
        name: 'busId',
        allowNull: false
      },
    });

    Booking.belongsTo(models.Route, {
      foreignKey: {
        name: 'routeId',
        allowNull: false
      }
    });

    Booking.belongsTo(models.Date_Bus_Mapper, {
      foreignKey: {
        name: 'date_busId',
      }
    });
  };

  return Booking;
};
