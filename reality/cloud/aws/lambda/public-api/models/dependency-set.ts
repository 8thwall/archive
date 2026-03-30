export default (sequelize, DataTypes) => {
  const DependencySet = sequelize.define('DependencySet', {
    uuid: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDv4,
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
    data: {
      allowNull: false,
      type: DataTypes.JSONB,
    },
  })

  DependencySet.associate = (models) => {
    DependencySet.belongsTo(models.App)
  }

  return DependencySet
}
