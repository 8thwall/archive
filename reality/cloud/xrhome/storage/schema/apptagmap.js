module.exports = (sequelize, DataTypes) => {
  const AppTagMap = sequelize.define('AppTagMap', {
    uuid: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDv4,
    },
    AppUuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    AppTagUuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  }, {
    indexes: [
      {
        fields: ['AppUuid'],
      },
      {
        fields: ['AppTagUuid'],
      },
    ],
  })

  AppTagMap.associate = (models) => {
    AppTagMap.belongsTo(models.App)
    AppTagMap.belongsTo(models.AppTag)
  }

  return AppTagMap
}
