'use strict';
module.exports = (sequelize, Sequelize) => {
  const Date_Bus_Mapper = sequelize.define("Date_Bus_Mapper", {
    date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    seatsAvailable: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  },
  { timestamps: false}
);

Date_Bus_Mapper.associate = (models) => {
  Date_Bus_Mapper.belongsTo(models.Bus, {
    foreignKey: {
      name: 'busId',
      allowNull: false
    }
  });
};

  return Date_Bus_Mapper;
};
