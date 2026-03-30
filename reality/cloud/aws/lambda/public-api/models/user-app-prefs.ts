export default (sequelize, DataTypes) => {
  const UserApp = sequelize.define('User_App_Pref', {
    UserUuid: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      unique: 'compositeIndex',
    },
    AppUuid: {
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

  UserApp.associate = (models) => {
    UserApp.belongsTo(models.App)
  }

  return UserApp
}
