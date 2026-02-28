module.exports = (sequelize, DataTypes) => {
  const App = sequelize.define('App', {
    uuid: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDv4,
    },
    status: DataTypes.ENUM('UNKNOWN', 'ENABLED', 'DISABLED', 'DELETED'),
    appName: DataTypes.STRING,  // string name of the app
    appKey: DataTypes.STRING,  // what you plug into Unity
    AccountUuid: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    createdBy: DataTypes.UUID,  // user uuid that created appkey
    keyTimestamp: DataTypes.BIGINT,  // the timestamp of generating the app key
    version: DataTypes.TEXT,  // engine channel or version for app
    prevEngine: DataTypes.TEXT,  // previous engine version for app

    // Web specific fields
    isWeb: DataTypes.BOOLEAN,  // is web
    shortLink: DataTypes.STRING,  // 8th.io/shortLink for 8codes

    // Third-party hosted apps
    webUrl: DataTypes.STRING(2000),  // url of app, user defined if self-hosted
    webOrigins: DataTypes.ARRAY(DataTypes.TEXT),  // web allowed origins
    isCommercial: {
      type: DataTypes.BOOLEAN,  // is commercial
      allowNull: false,
      defaultValue: false,
    },

    // 8th Wall Hosted Apps
    isPublic: DataTypes.BOOLEAN,  // hosted app is publicly accessible
    webReviewRequestedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    webReviewStatus: {
      type: DataTypes.ENUM('UNKNOWN', 'PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'),
      allowNull: false,
      defaultValue: 'UNKNOWN',
    },
    webVersionStaging: DataTypes.TEXT,  // user upload
    webVersionReview: DataTypes.TEXT,  // set when review requested
    webVersionProduction: DataTypes.TEXT,  // set when deployed
    // used for ARCamera
    webBackingUuid: {
      type: DataTypes.UUID,
      allowNull: true,
    },  // app uuid that serves
    passphrase: DataTypes.STRING,

    // Billing
    subscriptionItem: DataTypes.STRING,
    violationStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'None',
    },
    ContractUuid: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    commercialStatus: {
      type: DataTypes.ENUM('DEMO', 'DEVELOP', 'LAUNCH', 'COMPLETE', 'CANCELED'),
      allowNull: true,
    },

    endingAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    subscriptionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    usageSubscriptionItemId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    licenseSubscriptionItemId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Legacy accounts include "WebDeveloper", "WebCamera", "UnityDeveloper", etc.
    // Represents the type of legacy account that created this application. This column will
    // be used to help transition to a state where accounts develop all types of applications.
    legacyAccountType: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    campaignRedirectUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // DEPRECATED: Use ScheduledSubscription.
    devSubStartDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // DEPRECATED: Use ScheduledSubscription.
    devSubPlanId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // DEPRECATED: Use ScheduledSubscription.
    campaignSubStartDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // DEPRECATED: Use ScheduledSubscription.
    campaignSubPlanId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // The licensing package that goes into effect once the app goes live.
    launchPackageId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // A short description of the application. This will appear as the subtext in the previews
    // displayed when sharing links to this app over social media and messaging platforms.
    appDescription: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // A ID used to resolve the CDN URL for the cover image of the app. If a coverImageId
    // does not exist or is invalid, a default cover image will be used.
    coverImageId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // The formal title of the application. This name will be used as the title that appears
    // in the preview when sharing an app's URL on social media and messaging platforms.
    // This is not to be confused with the app name.
    // e.g.   appTitle = "Alvin's Amazing App"
    //        appName = "alvins-amazing-app"
    appTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    /**
     * Represents the status of the git repo associated with the app.
     *  UNKNOWN - deprecated
     *  NONE - no code commit repo exists for this app; this is the case on initial app creation
     *  PRIVATE - NOT viewable/cloneable outside the parent workspace
     *  PUBLIC - viewable/cloneable outside the parent workspace
     */
    repoStatus: {
      type: DataTypes.ENUM('UNKNOWN', 'NONE', 'PRIVATE', 'PUBLIC'),
      defaultValue: 'NONE',
      allowNull: false,
    },

    /**
     * Store the last known SPDX License Identifier for this repo.
     * https://spdx.org/licenses/
     */
    repoLicenseMaster: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    repoLicenseProd: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    connectedDomain: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    domainAssociationId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    buildSettingsSplashScreen: {
      type: DataTypes.ENUM(
        'UNKNOWN', 'DEFAULT', 'DISABLED', 'DEMO', 'NONCOMMERCIAL', 'EDUCATIONAL', 'APP'
      ),
      defaultValue: 'UNKNOWN',
      allowNull: false,
    },

    /**
     * Determines whether the app should have PWA features generated at build time.
     */
    hasPwaEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    /** Apps where publicFeatured is true can be accessed in the public profile page
     * when the account's publicFeatured is also true
     */
    publicFeatured: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
    },

    /**
     * Overrides the upload limits on assets and bundles, in a JSON format
     */
    assetLimitOverrides: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Represents whether the app is on an enterprise license (i.e. it is expected to be recurring)
    hasRecurringLicense: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    // The Stripe Invoice Line Item ID which represents an amount that has been billed to the user
    // for the purposes of using this app commercially
    licenseInvoiceLineItemId: {
      allowNull: true,
      type: DataTypes.STRING,
    },

    /** If this flag is enabled, the app is opted out of the "Try it Out" button on the featured
     * project page.
     */
    featuredPreviewDisabled: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    /**
     * The version ID of the markdown file stored in S3 for the Featured App Page description.
     * This is updated every time the contents of the description is changed.
     */
    featuredDescriptionId: {
      allowNull: true,
      type: DataTypes.STRING,
    },

    /**
     * The URL of the video which should be embedded on the app's featured page.
     */
    featuredVideoUrl: {
      allowNull: true,
      type: DataTypes.STRING,
    },

    /**
     * The timestamp indicating when a featured app is published.
     */
    publishedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },

    productionCommitHash: {
      allowNull: true,
      type: DataTypes.STRING,
    },

    /**
     * The specifier where the app's repo lives.
     * Added October 2021 for repo partitioning.
     * https://docs.google.com/document/d/<REMOVED_BEFORE_OPEN_SOURCING>
     * Example legacy specifier: cc/0/8w.pawel-2
     * Example new specifier: cc/1/1a08775c-1d1f-435c-ae58-5217c3a7ccf3
     */
    repoId: {
      allowNull: true,
      type: DataTypes.STRING,
    },

    /**
     * User preference for app hosting type
     */
    hostingType: {
      type: DataTypes.ENUM('UNSET', 'CLOUD_EDITOR', 'CLOUD_STUDIO', 'SELF', 'INTERNAL', 'AD'),
      defaultValue: 'UNSET',
      allowNull: false,
    },

    /**
     * The sequence that should be used by default when the simulator is opened.
     * Examples:
     *   - "World"
     *   - "Face Tracking.Face Sample"
     *   - "World.Park.Day"
     */
    defaultSimulatorSequence: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    indexes: [
      {
        fields: ['appKey'],
        unique: true,
      },
      {
        fields: ['connectedDomain'],
      },
    ],
  })

  App.associate = (models) => {
    App.belongsTo(models.Account)
    App.belongsTo(models.Contract)
    App.hasOne(models.PwaInfo, {foreignKey: 'AppUuid'})
    App.hasMany(models.NaeInfo, {foreignKey: 'AppUuid'})
    App.hasMany(models.ContractItem)
    App.hasMany(models.PolicyViolation)
    App.hasMany(models.ImageTarget, {foreignKey: 'AppUuid'})
    App.hasMany(models.ScheduledSubscription)
    App.hasMany(models.User_App_Pref, {foreignKey: 'AppUuid'})
    App.belongsToMany(models.AppTag, {
      through: models.AppTagMap,
      as: 'AppTags',
      foreignKey: 'AppUuid',
    })
    App.hasMany(models.FeaturedAppImage, {foreignKey: 'AppUuid'})
    App.hasOne(models.DiscoveryApp, {foreignKey: 'uuid'})
    App.belongsToMany(models.Account, {
      through: {
        model: models.CrossAccountPermission,
        unique: false,
      },
      as: 'FromAccounts',
      foreignKey: 'AppUuid',
      otherKey: 'FromAccountUuid',
    })
    App.belongsToMany(models.Account, {
      through: {
        model: models.CrossAccountPermission,
        unique: false,
      },
      as: 'ToAccounts',
      foreignKey: 'AppUuid',
      otherKey: 'ToAccountUuid',
    })
    App.hasMany(models.CrossAccountPermission, {
      as: 'SharePermissions',
    })
    App.hasMany(models.DependencySet)
    App.hasMany(models.AdSubmission)
    App.hasMany(models.WayspotAnchor, {foreignKey: 'AppUuid'})
    App.belongsToMany(models.Feature, {
      through: models.AppFeatureMap,
      as: 'Features',
      foreignKey: 'AppUuid',
    })
  }

  return App
}
