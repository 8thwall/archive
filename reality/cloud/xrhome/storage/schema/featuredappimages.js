module.exports = (sequelize, DataTypes) => {
  const FeaturedAppImage = sequelize.define('FeaturedAppImage', {
    uuid: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDv4,
    },
    AppUuid: {
      allowNull: true,
      type: DataTypes.UUID,
    },
    ModuleUuid: {
      allowNull: true,
      type: DataTypes.UUID,
    },
    objectId: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM('DRAFT', 'FEATURED', 'DELETED', 'DISABLED'),
    },
  }, {
    indexes: [
      {
        fields: ['AppUuid'],
      },
      {
        fields: ['ModuleUuid'],
      },
    ],
  })

  FeaturedAppImage.associate = (models) => {
    FeaturedAppImage.belongsTo(models.App)
    FeaturedAppImage.belongsTo(models.Module)
  }

  return FeaturedAppImage
}
