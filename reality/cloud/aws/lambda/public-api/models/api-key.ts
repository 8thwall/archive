export default (sequelize, DataTypes) => {
  const ApiKey = sequelize.define('ApiKey', {
    uuid: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDv4,
    },
    secretKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('ENABLED', 'DISABLED', 'DELETED'),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    AccountUuid: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    fullAccountAccess: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    keyId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  })

  ApiKey.associate = (models) => {
    ApiKey.belongsTo(models.Account)
  }

  return ApiKey
}
