module.exports = (sequelize, DataTypes) => {
  const PolicyViolation = sequelize.define('PolicyViolation', {
    uuid: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDv4,
    },
    violationType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Unspecified',
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Unspecified',
    },
    resolvedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    AccountUuid: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    AppUuid: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    resolverId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        fields: ['AccountUuid'],
      },
      {
        fields: ['AppUuid'],
      },
    ],
  }, {
    classMethods: {
      associate(models) {
        PolicyViolation.belongsTo(models.Account)
        PolicyViolation.belongsTo(models.App)
      },
    },
  })

  PolicyViolation.Type = {
    UNSPECIFIED: 'Unspecified',

    // Contains inappropriate content.
    INAPPROPRIATE_CONTENT: 'InappropriateContent',

    // Failed to make an expected payment.
    PAYMENT_FAILED: 'PaymentFailed',

    // Abused license terms
    LICENSE_MISUSE: 'LicenseMisuse',

    // Account is in a restricted region.
    REGION_RESTRICTION: 'RegionRestriction',
  }

  PolicyViolation.Status = {
    UNSPECIFIED: 'Unspecified',

    // Violation is active and needs to be resolved.
    VIOLATION: 'Violation',

    // Violation has been resolved.
    RESOLVED: 'Resolved',
  }

  PolicyViolation.OwnerStatus = {
    // The account/app has no history of violations.
    NONE: 'None',

    // The account/app has at least one active violation.
    VIOLATION: 'Violation',

    // The account/app has only resolved violations.
    RESOLVED: 'Resolved',
  }

  return PolicyViolation
}
