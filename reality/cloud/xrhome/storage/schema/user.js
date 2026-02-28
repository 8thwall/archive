module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    crmId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    newsletterId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    emailVerifyTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    handle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    themeSettings: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    tosAgreements: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    primaryContactEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    givenName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    familyName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    locale: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'en-US',
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneNumberVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    hasFirstTimePublished: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    profileIcon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    /**
     * The latest date a user was seen in the console logs.
     * Updated daily by the pg-users-updater lambda in the dev-activity sfn.
     */
    latestActivityDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Latest date of logged-in activity',
    },
    lastSeenReleasePopupId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'The ID of the last release notes popup seen by this user',
    },
  })

  User.associate = (models) => {
    User.hasOne(models.PlayerUser)
    User.hasMany(models.AssetRequest, {
      foreignKey: 'UserUuid',
    })
    User.hasMany(models.AssetGeneration, {
      foreignKey: 'UserUuid',
    })
    User.hasMany(models.ReferralCodeRedemption, {
      foreignKey: 'UserUuid',
    })
    User.hasMany(models.UserLoginMethods, {
      foreignKey: 'UserUuid',
    })
  }

  return User
}
