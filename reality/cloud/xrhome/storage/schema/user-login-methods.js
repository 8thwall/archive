module.exports = (sequelize, DataTypes) => {
  const UserLoginMethods = sequelize.define('UserLoginMethods', {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    UserUuid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'uuid',
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    provider: {
      type: DataTypes.ENUM('EMAIL', 'GOOGLE', 'APPLE'),
      allowNull: false,
    },
    thirdPartyUserId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  })

  UserLoginMethods.associate = (models) => {
    UserLoginMethods.belongsTo(models.User)
  }

  return UserLoginMethods
}
