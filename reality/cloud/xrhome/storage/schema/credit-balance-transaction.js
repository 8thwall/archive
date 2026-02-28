/**
Credit balance transactions track individual events that affect the credit balance of an account.
*/

module.exports = (sequelize, DataTypes) => {
  const CreditBalanceTransaction = sequelize.define('CreditBalanceTransaction', {
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
     type values:
     - REDEEM: usage of credits on an action
     - REFUND: return of credits for an action that failed/timed out
     - BUY: allocation of credits from a paid subscription or top-up
     - GRANT: allocation of free credits by a scheduled allowance or a marketing promotion
     - ADJUST: manual adjustment of credits by an administrator

     */
    type: {
      type: DataTypes.ENUM('BUY', 'GRANT', 'REDEEM', 'REFUND', 'ADJUST'),
      allowNull: false,
      comment: 'Event that this transaction is associated with',
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Description of this transaction',
    },
    UserUuid: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {model: 'Users', key: 'uuid'},
      comment: 'UUID of the user who initiated this transaction',
    },
    CreditGrantUuid: {
      type: DataTypes.UUID,
      // All records will have an associated credit grant
      allowNull: false,
      references: {model: 'CreditGrants', key: 'uuid'},
      comment: 'Credit grant associated with this transaction',
    },
    quantity: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'Number of credits handled by this credit grant',
    },
    value: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'Value of the credits handled by this credit grant, in hundredths of a cent',
    },
    CreditServicePricingUuid: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Associated service pricing record, if applicable',
    },
    totalActionQuantity: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'Total number of credits handled by this action across' +
        ' associated credit grants',
    },
    totalActionValue: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'Total value of credits handled by this action across' +
        ' associated credit grants, in hundredths of a cent',
    },
    AssetRequestUuid: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {model: 'AssetRequests', key: 'uuid'},
      comment: 'Associated asset request, if applicable',
    },
    /**
     This column will only be filled when type = REDEEM:
        - Its initial value will be PENDING
        - It will be updated to COMPLETED or FAILED when the transaction is processed
        - It will be updated to TIMED_OUT through the credit-notifications stack if
         the transaction is not processed within a certain time frame
     */
    redeemStatus: {
      type: DataTypes.ENUM('PENDING', 'COMPLETED', 'FAILED', 'TIMED_OUT'),
      allowNull: true,
      comment: 'Status of this transaction',
    },
    /**
     requestId will be filled for transactions made to services that do not have a valid foreign
     key in the pg database.
         - This is helpful in case a request fails: we can identify the associated CBT records,
           update their redeemStatus to FAILED, and refund the appropriate CreditGrants
     */
    requestId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Associated request ID, if a service does not have a valid foreign key in pg',
    },
  }, {
    indexes: [
      {
        fields: ['AccountUuid'],
      },
      {
        fields: ['CreditGrantUuid'],
      },
      {
        fields: ['requestId'],
      },
    ],
  })

  CreditBalanceTransaction.associate = (models) => {
    CreditBalanceTransaction.belongsTo(models.Account, {
      foreignKey: 'AccountUuid',
      targetKey: 'uuid',
    })

    CreditBalanceTransaction.belongsTo(models.CreditGrant, {
      foreignKey: 'CreditGrantUuid',
      targetKey: 'uuid',
    })

    CreditBalanceTransaction.belongsTo(models.AssetRequest, {
      foreignKey: 'AssetRequestUuid',
      targetKey: 'uuid',
      constraints: false,
    })
  }

  return CreditBalanceTransaction
}
