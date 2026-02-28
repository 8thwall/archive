module.exports = (sequelize, DataTypes) => {
  const AppTag = sequelize.define('AppTag', {
    uuid: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDv4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    restricted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    blocked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    suggestedTag: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    indexes: [
      {
        fields: ['name'],
        unique: true,
      },
    ],
  })

  AppTag.associate = (models) => {
    AppTag.belongsToMany(models.App, {
      through: models.AppTagMap,
      as: 'Apps',
      foreignKey: 'AppTagUuid',
    })
    AppTag.belongsToMany(models.Module, {
      through: models.ModuleTagMap,
      as: 'Modules',
      foreignKey: 'AppTagUuid',
    })
  }

  return AppTag
}
