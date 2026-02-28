module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User_Account', {
    UserUuid: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
    },
    AccountUuid: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
    },
    role: DataTypes.ENUM('OWNER', 'ADMIN', 'DEV', 'BILLMANAGER'),
    handle: DataTypes.STRING(20),
    firebaseId: DataTypes.STRING,
  }, {
    indexes: [
      {
        fields: ['UserUuid'],
      },
      {
        fields: ['AccountUuid'],
      },
      {
        fields: ['firebaseId'],
      },
    ],
  })

  User.associate = (models) => {
    User.belongsTo(models.Account)
  }

  return User
}
