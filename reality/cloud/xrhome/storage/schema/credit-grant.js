/**
Credit grants represent individual allotments of credits to an account, including free and
   purchased credits.
NOTES:
 - Recurring subscriptions are will have one credit grant PER billing period. However, a
   workspace will only have one active PAID_PLAN grant at a time.
 - Credit grants from recurring or one-time purchases (i.e. category is PAID_*)
   are one-to-one with Transactions through CreditGrantTransactionMaps.
 - Credit grants that were allotted for free (i.e. category is FREE_*)
   will NOT have an associated Transaction or CreditGrantTransactionMap.
*/

module.exports = (sequelize, DataTypes) => {
  const CreditGrant = sequelize.define('CreditGrant', {
    uuid: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    AccountUuid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {model: 'Accounts', key: 'uuid'},
    },
    /**
     category values:
     - PAID_PLAN: a recurring subscription
     - PAID_TOPUP: a one-time purchase
     - FREE_STANDARD: a scheduled allowance e.g. 10 free credits per day
     - FREE_PROMOTION: a promotional reward for marketing, etc.
    */
    category: {
      type: DataTypes.ENUM('PAID_PLAN', 'PAID_TOPUP', 'FREE_STANDARD', 'FREE_PROMOTION'),
      allowNull: false,
      comment: 'Source of this credit grant',
    },
    quantity: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'Number of credits originally allotted with this grant',
    },
    remainingQuantity: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'Number of unspent credits in this grant',
    },
    /**
    unitPrice is the price the customer paid for one credit at the time of purchase.
     - Any applied discounts would be reflected here.
     - unitPrice=0 when category is FREE_STANDARD or FREE_PROMOTION
    */
    unitPrice: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'Price charged for one credit, in hundredths of a cent',
    },
    // totalPrice = (unitPrice * quantity)
    totalPrice: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'Price charged for this quantity of credits, in hundredths of a cent',
    },
    // unitValue is the monetary value of one credit at the time of grant, based on our pricing.
    unitValue: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'Value of one credit at the time of grant, in hundredths of a cent',
    },
    // totalValue = (unitValue * quantity)
    totalValue: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'Value of this quantity of credits at the time of grant, in hundredths of a cent',
    },
    effectiveAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Timestamp that this credit grant will become available for use',
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Timestamp that this credit grant will expire',
    },
    status: {
      type: DataTypes.ENUM('GRANTED', 'VOIDED'),
      allowNull: false,
      defaultValue: 'GRANTED',
    },
    /**
     - A workspace’s anchor date will initially be the date of their first signin/signup.
     - If, and each time, a subscription is purchased, anchorDate will
       be updated to the purchase date.
    */
    anchorDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date to which this series of grants is anchored',
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    indexes: [
      {fields: ['AccountUuid']},
    ],
  })

  CreditGrant.associate = (models) => {
    CreditGrant.belongsTo(models.Account, {
      foreignKey: 'AccountUuid',
      targetKey: 'uuid',
    })
    CreditGrant.belongsToMany(models.Transaction, {
      through: models.CreditGrantTransactionMap,
      as: 'Transactions',
      foreignKey: 'CreditGrantUuid',
    })

    CreditGrant.hasMany(models.CreditBalanceTransaction, {
      foreignKey: 'CreditGrantUuid',
      sourceKey: 'uuid',
    })
  }

  return CreditGrant
}
