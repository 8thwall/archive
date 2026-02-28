module.exports = (sequelize, DataTypes) => {
  const FeatureTransactionMap = sequelize.define('FeatureTransactionMap', {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    FeatureUuid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Features',
        key: 'uuid',
      },
    },
    TransactionUuid: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'Transactions',
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
        fields: ['FeatureUuid'],
      },
      {
        fields: ['TransactionUuid'],
      },
      {
        fields: ['FeatureUuid', 'TransactionUuid'],
        unique: true,
      },
    ],
  })

  FeatureTransactionMap.associate = (models) => {
    FeatureTransactionMap.belongsTo(models.Feature, {
      foreignKey: 'FeatureUuid',
      targetKey: 'uuid',
    })

    FeatureTransactionMap.belongsTo(models.Transaction, {
      foreignKey: 'TransactionUuid',
      targetKey: 'uuid',
    })
  }

  return FeatureTransactionMap
}
