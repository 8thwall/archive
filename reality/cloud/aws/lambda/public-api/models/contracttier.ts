export default (sequelize, DataTypes) => {
  const ContractTier = sequelize.define('ContractTier', {
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
    flat_amount: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    unit_amount: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    up_to: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    ContractTemplateUuid: {
      allowNull: false,
      type: DataTypes.UUID,
    },
  })

  ContractTier.associate = (models) => {
    ContractTier.belongsTo(models.ContractTemplate)
  }

  return ContractTier
}
