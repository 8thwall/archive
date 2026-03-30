export default (sequelize, DataTypes) => {
  const AccountShortName = sequelize.define('AccountShortName', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    AccountUuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'DELETED'),
      allowNull: false,
    },
  })

  AccountShortName.associate = (models) => {
    AccountShortName.belongsTo(models.Account)
  }

  return AccountShortName
}
