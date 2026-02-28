module.exports = (sequelize, DataTypes) => {
  const AppFeatureMap = sequelize.define('AppFeatureMap', {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    AppUuid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Apps',
        key: 'uuid',
      },
    },
    FeatureUuid: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'Features',
        key: 'uuid',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    indexes: [
      {
        fields: ['AppUuid'],
      },
      {
        fields: ['FeatureUuid'],
        unique: true,
      },
    ],
  })

  AppFeatureMap.associate = (models) => {
    AppFeatureMap.belongsTo(models.App, {
      foreignKey: 'AppUuid',
      targetKey: 'uuid',
    })

    AppFeatureMap.belongsTo(models.Feature, {
      foreignKey: 'FeatureUuid',
      targetKey: 'uuid',
    })
  }

  return AppFeatureMap
}
