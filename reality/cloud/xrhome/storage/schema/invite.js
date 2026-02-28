module.exports = (sequelize, DataTypes) => {
  const Invite = sequelize.define('Invite', {
    AccountUuid: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
    },
    email: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.STRING,
    },
    from: DataTypes.TEXT,
    token: DataTypes.STRING,
    ReferralCodeUuid: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'ReferralCodes',
        key: 'uuid',
      },
    },
  }, {
    indexes: [
      {
        fields: ['email'],
      },
      {
        fields: ['AccountUuid'],
      },
    ],
  })

  Invite.associate = (models) => {
    Invite.belongsTo(models.Account)
    Invite.belongsTo(models.ReferralCode, {
      foreignKey: 'ReferralCodeUuid',
      targetKey: 'uuid',
    })
  }

  return Invite
}
