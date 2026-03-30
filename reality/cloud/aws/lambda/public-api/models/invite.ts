export default (sequelize, DataTypes) => {
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
  }

  return Invite
}
