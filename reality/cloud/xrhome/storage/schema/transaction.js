module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
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
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    priceId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    invoiceId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    invoiceItemId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    invoiceLineItemId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    indexes: [
      {
        fields: ['AccountUuid'],
      },
      {
        fields: ['productId'],
      },
      {
        fields: ['priceId'],
      },
      {
        fields: ['invoiceId'],
      },
    ],
  })

  Transaction.associate = (models) => {
    // Set up association here
    Transaction.belongsToMany(models.Feature, {
      through: models.FeatureTransactionMap,
      as: 'Features',
      foreignKey: 'TransactionUuid',
    })
    Transaction.belongsToMany(models.CreditGrant, {
      through: models.CreditGrantTransactionMap,
      as: 'CreditGrants',
      foreignKey: 'TransactionUuid',
    })
  }

  return Transaction
}
