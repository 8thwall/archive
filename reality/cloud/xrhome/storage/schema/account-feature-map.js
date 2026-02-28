module.exports = (sequelize, DataTypes) => {
  const AccountFeatureMap = sequelize.define('AccountFeatureMap', {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    AccountUuid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Accounts',
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
        fields: ['AccountUuid'],
      },
      {
        fields: ['FeatureUuid'],
        unique: true,
      },
    ],
  })

  AccountFeatureMap.associate = (models) => {
    AccountFeatureMap.belongsTo(models.Account, {
      foreignKey: 'AccountUuid',
      targetKey: 'uuid',
    })

    AccountFeatureMap.belongsTo(models.Feature, {
      foreignKey: 'FeatureUuid',
      targetKey: 'uuid',
    })
  }

  return AccountFeatureMap
}
