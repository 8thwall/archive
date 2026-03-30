export default (sequelize, DataTypes) => {
  const ModuleUser = sequelize.define('ModuleUser', {
    UserUuid: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      unique: 'compositeIndex',
    },
    ModuleUuid: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      unique: 'compositeIndex',
    },
    accessDate: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    activeBrowser: {
      allowNull: true,
      type: DataTypes.UUID,
    },
  })

  ModuleUser.associate = (models) => {
    ModuleUser.belongsTo(models.Module)
  }

  return ModuleUser
}
