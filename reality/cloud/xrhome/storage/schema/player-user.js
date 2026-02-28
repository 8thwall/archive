module.exports = (sequelize, DataTypes) => {
  const PlayerUser = sequelize.define('PlayerUser', {
    UserUuid: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    playerId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  })

  PlayerUser.associate = (models) => {
    PlayerUser.belongsTo(models.User)
  }

  return PlayerUser
}
