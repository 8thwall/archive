module.exports = (sequelize, DataTypes) => {
  const CreditGrantTransactionMap = sequelize.define('CreditGrantTransactionMap', {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    CreditGrantUuid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'CreditGrants',
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
        fields: ['CreditGrantUuid'],
      },
      {
        fields: ['TransactionUuid'],
      },
      {
        fields: ['CreditGrantUuid', 'TransactionUuid'],
        unique: true,
      },
    ],
  })

  CreditGrantTransactionMap.associate = (models) => {
    CreditGrantTransactionMap.belongsTo(models.CreditGrant, {
      foreignKey: 'CreditGrantUuid',
      targetKey: 'uuid',
    })

    CreditGrantTransactionMap.belongsTo(models.Transaction, {
      foreignKey: 'TransactionUuid',
      targetKey: 'uuid',
    })
  }

  return CreditGrantTransactionMap
}
