module.exports = (sequelize, DataTypes) => {
  const ImageTarget = sequelize.define('ImageTarget', {
    uuid: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDv4,
    },
    type: {
      allowNull: false,
      type: DataTypes.ENUM('UNSPECIFIED', 'PLANAR', 'CYLINDER', 'CONICAL', 'SCAN'),
      defaultValue: 'UNSPECIFIED',
    },
    AppUuid: {
      primaryKey: false,
      allowNull: true,
      type: DataTypes.UUID,
    },
    name: DataTypes.STRING(255),
    originalImagePath: DataTypes.STRING(1024),
    // when cone: overwritten with the crop of geometryTexturePath
    // when scan: overwritten with the jpg image from Scaniverse
    imagePath: DataTypes.STRING(1024),
    luminanceImagePath: DataTypes.STRING(1024),
    thumbnailImagePath: DataTypes.STRING(1024),
    // only for cone: unconified texture of the originalImagePath
    geometryTexturePath: DataTypes.STRING(1024),
    // only for scan: path to the glb file
    scanDataPath: DataTypes.STRING(1024),
    status: DataTypes.ENUM('UNKNOWN', 'ENABLED', 'DISABLED', 'DELETED', 'DRAFT', 'TAKEN_DOWN'),
    userMetadata: DataTypes.STRING(100 * 1024),
    moveable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    physicalWidthInMeters: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    metadata: DataTypes.STRING(100 * 1024),
    isRotated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    userMetadataIsJson: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  })

  ImageTarget.associate = (models) => {
    ImageTarget.belongsTo(models.App, {foreignKey: 'AppUuid'})
  }

  return ImageTarget
}
