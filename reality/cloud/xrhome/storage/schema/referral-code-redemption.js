module.exports = (sequelize, DataTypes) => {
  const ReferralCodeRedemption = sequelize.define('ReferralCodeRedemption', {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    ReferralCodeUuid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'ReferralCodes',
        key: 'uuid',
      },
    },
    ReferralCodeRewardUuid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'ReferralCodeRewards',
        key: 'uuid',
      },
    },
    UserUuid: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'User who redeemed the code',
      references: {
        model: 'Users',
        key: 'uuid',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    source: {
      type: DataTypes.ENUM('SIGNUP', 'EMAIL', 'UNKNOWN'),
      allowNull: false,
      defaultValue: 'UNKNOWN',
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'PAID', 'REJECTED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  })

  ReferralCodeRedemption.associate = (models) => {
    ReferralCodeRedemption.belongsTo(models.ReferralCode, {
      foreignKey: 'ReferralCodeUuid',
      targetKey: 'uuid',
    })
    ReferralCodeRedemption.belongsTo(models.ReferralCodeReward, {
      as: 'Reward',
      foreignKey: 'ReferralCodeRewardUuid',
      targetKey: 'uuid',
    })
    ReferralCodeRedemption.belongsTo(models.User, {
      foreignKey: 'UserUuid',
      targetKey: 'uuid',
    })
  }

  return ReferralCodeRedemption
}
