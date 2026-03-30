export default (sequelize, DataTypes) => {
  const ContractItem = sequelize.define('ContractItem', {
    uuid: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    AppUuid: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    ContractUuid: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    amount: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    startDate: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    endDate: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    canceledAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    stripeInvoiceId: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    stripeInvoiceItemId: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  })

  ContractItem.associate = (models) => {
    ContractItem.belongsTo(models.Contract)
    ContractItem.belongsTo(models.App)
  }

  return ContractItem
}
