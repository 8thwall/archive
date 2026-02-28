module.exports = (sequelize, DataTypes) => {
  const Feature = sequelize.define('Feature', {
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
    category: {
      type: DataTypes.ENUM('ACCOUNT', 'APP'),
      allowNull: false,
    },
    featureName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    optionName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Default',
    },
    status: {
      type: DataTypes.ENUM('ENABLED', 'DISABLED', 'VOIDED'),
      allowNull: false,
      defaultValue: 'DISABLED',
    },
    billingType: {
      type: DataTypes.ENUM('RECURRING', 'ONE_TIME'),
      allowNull: false,
    },
    subscriptionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subscriptionItemId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subscriptionScheduleId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subscriptionEndsAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    indexes: [
      {
        fields: ['featureName', 'optionName'],
      },
      {
        fields: ['subscriptionId', 'subscriptionItemId'],
      },
      {
        fields: ['subscriptionId'],
      },
    ],
  })

  Feature.associate = (models) => {
    // Set up association here
    Feature.belongsToMany(models.Account, {
      through: models.AccountFeatureMap,
      as: 'Accounts',
      foreignKey: 'FeatureUuid',
    })
    Feature.belongsToMany(models.App, {
      through: models.AppFeatureMap,
      as: 'Apps',
      foreignKey: 'FeatureUuid',
    })
    Feature.belongsToMany(models.Transaction, {
      through: models.FeatureTransactionMap,
      as: 'Transactions',
      foreignKey: 'FeatureUuid',
    })
  }

  return Feature
}
