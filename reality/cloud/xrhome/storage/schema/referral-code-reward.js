module.exports = (sequelize, DataTypes) => {
  const ReferralCodeReward = sequelize.define('ReferralCodeReward', {
    uuid: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    referrerCreditAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    refereeCreditAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      unique: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  })

  ReferralCodeReward.associate = (models) => {
    ReferralCodeReward.hasMany(models.ReferralCodeRedemption, {
      as: 'Redemptions',
      foreignKey: 'ReferralCodeRewardUuid',
      sourceKey: 'uuid',
    })
  }

  return ReferralCodeReward
}
