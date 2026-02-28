module.exports = (sequelize, DataTypes) => {
  const ScheduledSubscription = sequelize.define('ScheduledSubscription', {
    uuid: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDv4,
    },
    AppUuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    planId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentSource: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    collectionMethod: {
      type: DataTypes.ENUM('send_invoice', 'charge_automatically'),
      allowNull: false,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    scheduledStatus: {
      type: DataTypes.ENUM('DEVELOP', 'LAUNCH'),
      allowNull: false,
    },
  }, {
    indexes: [
      {
        fields: ['AppUuid'],
      },
    ],
  })

  ScheduledSubscription.associate = (models) => {
    ScheduledSubscription.belongsTo(models.App)
  }

  return ScheduledSubscription
}
