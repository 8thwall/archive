module.exports = (sequelize, DataTypes) => {
  const ModuleTagMap = sequelize.define('ModuleTagMap', {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    ModuleUuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    AppTagUuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  }, {
    indexes: [
      {fields: ['ModuleUuid']},
      {fields: ['AppTagUuid']},
    ],
  })

  ModuleTagMap.associate = (models) => {
    ModuleTagMap.belongsTo(models.Module)
    ModuleTagMap.belongsTo(models.AppTag)
  }

  return ModuleTagMap
}
