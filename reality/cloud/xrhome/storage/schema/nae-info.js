module.exports = (sequelize, DataTypes) => {
  const NaeInfo = sequelize.define('NaeInfo', {
    uuid: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDv4,
    },
    AppUuid: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {model: 'Apps', key: 'uuid'},
    },
    platform: {
      allowNull: false,
      type: DataTypes.ENUM('ANDROID', 'IOS'),
      defaultValue: 'ANDROID',
      comment: 'The platform of the app.',
    },
    publisher: {
      allowNull: true,
      type: DataTypes.STRING,
      comment: 'The app publisher, e.g. “8th Wall”.',
    },
    displayName: {
      allowNull: true,
      type: DataTypes.STRING,
      comment: 'The app display name, e.g. “Fun Game”.',
    },
    bundleId: {
      allowNull: true,
      type: DataTypes.STRING,
      comment: 'The app bundle ID, e.g. “com.8thwall.fungame”.',
    },
    iconId: {
      allowNull: true,
      type: DataTypes.STRING,
      comment: 'The ID of the app icon stored in S3.',
    },
    launchScreenIconId: {
      allowNull: true,
      type: DataTypes.STRING,
      comment: 'The ID of the app launch screen icon stored in S3.',
    },
    permissions: {
      allowNull: true,
      type: DataTypes.JSONB,
      comment: 'The set of app level permissions.',
    },
    lastBuiltVersionName: {
      allowNull: true,
      type: DataTypes.STRING,
      comment: 'The version name, e.g. “1.0.3”, of the last build.',
    },
    lastBuiltVersionCode: {
      allowNull: true,
      type: DataTypes.INTEGER,
      comment: 'The version code, e.g. 100, of the last build.',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    indexes: [
      {
        fields: ['AppUuid'],
      },
    ],
  })

  NaeInfo.associate = (models) => {
    NaeInfo.belongsTo(models.App)
  }

  return NaeInfo
}
