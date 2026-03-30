export default (sequelize, DataTypes) => {
  const AccountContractAgreement = sequelize.define('AccountContractAgreement', {
    AccountUuid: {
      allowNull: false,
      type: DataTypes.UUID,
      primaryKey: true,
    },
    ContractUuid: {
      allowNull: false,
      type: DataTypes.UUID,
      primaryKey: true,
    },
    acceptedBy: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    acceptedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  })

  AccountContractAgreement.associate = (models) => {
    AccountContractAgreement.belongsTo(models.Account)
    AccountContractAgreement.belongsTo(models.Contract)
  }

  return AccountContractAgreement
}
