module.exports = (sequelize, DataTypes) => {
  const ContractTemplate = sequelize.define('ContractTemplate', {
    uuid: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
    },
    name: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    description: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    ContractUuid: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    amount: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    interval: {
      allowNull: false,
      type: DataTypes.ENUM('DAY', 'WEEK', 'MONTH'),
    },
    intervalCount: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    daysUntilDue: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    type: {
      allowNull: false,
      type: DataTypes.ENUM('DEMO', 'DEV', 'DEV_EXT', 'CAMPAIGN', 'CAMPAIGN_EXT'),
    },
    billingScheme: {
      allowNull: false,
      type: DataTypes.ENUM('PER_UNIT', 'TIERED'),
      defaultValue: 'PER_UNIT',
    },
    stripeSubPlanId: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    stripeUsagePlanId: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    packageId: {
      allowNull: true,
      type: DataTypes.STRING,
    },
  })

  ContractTemplate.associate = (models) => {
    ContractTemplate.belongsTo(models.Contract)
    ContractTemplate.hasMany(models.ContractTier)
  }

  return ContractTemplate
}
