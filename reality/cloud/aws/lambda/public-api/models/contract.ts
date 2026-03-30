export default (sequelize, DataTypes) => {
  const Contract = sequelize.define('Contract', {
    uuid: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
    },
    AccountUuid: {
      allowNull: true,
      type: DataTypes.UUID,
    },
    createdBy: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    expirationDate: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    isReusable: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    startDate: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    signedDate: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    hasPublicityRights: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    pdfPath: {
      allowNull: false,
      defaultValue: '',
      type: DataTypes.STRING(1024),
    },
    // Show this contract as an option for all new apps when it does not belong to an account
    isAvailableAsCanned: {
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    // Whether a commercial license under this contract can be paid through invoices.
    invoicePaymentsAllowed: {
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    // Represents whether apps created under this contract will be considered “enterprise”
    isRecurringContract: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  })

  Contract.associate = (models) => {
    Contract.belongsTo(models.Account)
    Contract.hasMany(models.ContractItem)
    Contract.hasMany(models.ContractTemplate)
    Contract.hasMany(models.App)
    Contract.hasMany(models.AccountContractAgreement)
  }

  return Contract
}
