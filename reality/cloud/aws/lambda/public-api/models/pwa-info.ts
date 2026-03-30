export default (sequelize, DataTypes) => {
  const PwaInfo = sequelize.define('PwaInfo', {
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
    name: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    shortName: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    iconId: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    backgroundColor: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    themeColor: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    AppUuid: {
      allowNull: false,
      type: DataTypes.UUID,
    },
  })

  PwaInfo.associate = (models) => {
    PwaInfo.belongsTo(models.App)
  }

  return PwaInfo
}
