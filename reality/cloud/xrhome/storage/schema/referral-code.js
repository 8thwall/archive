module.exports = (sequelize, DataTypes) => {
  const ReferralCode = sequelize.define('ReferralCode', {
    uuid: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    code: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    AccountUuid: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'Accounts',
        key: 'uuid',
      },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  })

  ReferralCode.associate = (models) => {
    ReferralCode.belongsTo(models.Account, {
      as: 'Account',
      foreignKey: 'AccountUuid',
      targetKey: 'uuid',
    })
    ReferralCode.hasMany(models.ReferralCodeRedemption, {
      as: 'Redemptions',
      foreignKey: 'ReferralCodeUuid',
      sourceKey: 'uuid',
    })
    ReferralCode.hasMany(models.Invite, {
      as: 'Invites',
      foreignKey: 'ReferralCodeUuid',
      sourceKey: 'uuid',
    })
  }

  return ReferralCode
}
