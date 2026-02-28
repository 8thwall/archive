module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    uuid: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDv4,
    },
    name: DataTypes.STRING,
    url: DataTypes.STRING,  // company's domain name (optional), e.g. 8thwall.com
    status: DataTypes.ENUM('UNKNOWN', 'ENABLED', 'DISABLED', 'DELETED', 'ACTIVATING'),
    // NOTE(pawel): when this column is updated, AccountShortNames should also be updated
    shortName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    webOrigin: DataTypes.BOOLEAN,  // allow external origins
    webPrivate: DataTypes.BOOLEAN,  // allow temporary viewing tokens
    webPublic: DataTypes.BOOLEAN,  // allow public hosting (e.g. editor)
    stripeId: DataTypes.STRING,  // Stripe Customer ID
    accountSubscriptionId: {
      type: DataTypes.STRING,  // Stripe top-level subsciption object associated with account
      allowNull: true,
    },
    accountLicenseSubscriptionItemId: {
      type: DataTypes.STRING,  // Stripe subscription item id for the plan type
      allowNull: true,
    },
    accountType: {
      type: DataTypes.STRING,  // allow different billing schedules
      allowNull: false,
      defaultValue: 'UnityDeveloper',
    },
    overQuotaUntil: DataTypes.DATE,  // if set, account is blocked until this date due to quota
    subscriptionItem: DataTypes.STRING,  // Usage on Pro accounts
    lastBillingClose: DataTypes.DATE,
    violationStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'None',
    },
    pendingCancellation: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'None',
    },
    additionalLicensesSubItemId: {
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

    // Fields that are seen in the public profiles
    // bio is shown the profile page as a blurb
    bio: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    // when an account is featured, its profile page is publicly
    // accessible. Only apps that are also publicFeatured are accesssible
    publicFeatured: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
    },
    // contains prefix that can be used to locate different sizes of the icon
    icon: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    trialStatus: {
      allowNull: false,
      type: DataTypes.ENUM(
        'NONE', 'ACCOUNT', 'BILLING', 'ACTIVE', 'CANCELED', 'ENDED', 'UPGRADED', 'VIOLATION',
        'INELIGIBLE', 'VOIDED'
      ),
      defaultValue: 'NONE',
    },
    trialUntil: {  // used to show on the front end. The Stripe subscription contains the actual period
      allowNull: true,
      type: DataTypes.DATE,
    },
    defaultAppLicenseInvoicePaymentsAllowed: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // The Stripe Invoice Line Item Id which represents the amount that has been
    // billed to the user for access to an 8th Wall account
    accountLicenseInvoiceLineItemId: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    // For user profile in new partner page and public workspace page
    googleMapsPlaceId: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    googleMapsPlaceIdUpdatedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    contactUrl: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    verifiedPartner: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verifiedPremierePartner: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    apiAccessOverride: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    twitterHandle: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    linkedInHandle: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    youtubeHandle: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    // The ID of the workspace's connected Stripe account.
    stripeConnectAccountId: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
      unique: true,
    },
    // Acts as the primary key for lightship accounts.
    developerId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    // specialFeatures primary use is allowlisting beta features and one-off flags
    specialFeatures: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    // The ID of the Stripe Subscription Schedule which manages
    // the subscription referenced by `accountSubscriptionId`.
    accountSubscriptionScheduleId: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    // Whether the account is able to create ad projects.
    adEnabled: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
    },
  }, {
    indexes: [
      {
        fields: ['connectedDomain'],
      },
      {
        fields: ['developerId'],
        unique: true,
      },
    ],
  })

  Account.associate = (models) => {
    // Set up association here
    Account.hasMany(models.User_Account, {as: 'Users', foreignKey: 'AccountUuid'})
    Account.hasMany(models.App)
    Account.hasMany(models.PolicyViolation)
    Account.hasMany(models.Contract)
    Account.hasMany(models.AccountContractAgreement)
    Account.hasMany(models.ApiKey)
    Account.hasMany(models.AccountShortName)
    Account.hasMany(models.Module)
    Account.hasMany(models.Invite)
    Account.belongsToMany(models.App, {
      through: {
        model: models.CrossAccountPermission,
        unique: false,
      },
      as: 'SharingApps',
      foreignKey: 'FromAccountUuid',
      otherKey: 'AppUuid',
    })
    Account.belongsToMany(models.App, {
      through: {
        model: models.CrossAccountPermission,
        unique: false,
      },
      as: 'ExternalApps',
      foreignKey: 'ToAccountUuid',
      otherKey: 'AppUuid',
    })
    Account.hasMany(models.CrossAccountPermission, {
      as: 'SharingPermissions',
      foreignKey: 'FromAccountUuid',
    })
    Account.hasMany(models.CrossAccountPermission, {
      as: 'ExternalPermissions',
      foreignKey: 'ToAccountUuid',
    })
    Account.hasMany(models.AssetRequest, {
      foreignKey: 'AccountUuid',
    })
    Account.hasMany(models.AssetGeneration, {
      foreignKey: 'AccountUuid',
    })
    Account.hasMany(models.CreditGrant, {
      foreignKey: 'AccountUuid',
    })
    Account.belongsToMany(models.Feature, {
      through: models.AccountFeatureMap,
      as: 'Features',
      foreignKey: 'AccountUuid',
    })
    Account.hasMany(models.CreditBalanceTransaction, {
      foreignKey: 'AccountUuid',
    })
    Account.hasMany(models.ReferralCode, {
      as: 'ReferralCodes',
      foreignKey: 'AccountUuid',
    })
  }

  Account.types = {
    WEB_CAMERA: 'WebCamera',
    WEB_CAMERA_PRO: 'WebCameraPro',
    WEB_DEVELOPER: 'WebDeveloper',
    WEB_DEVELOPER_PRO: 'WebDeveloperPro',
    WEB_STARTER: 'WebStarter',
    WEB_PLUS: 'WebPlus',
    WEB_ENTERPRISE: 'WebEnterprise',
    WEB_AGENCY: 'WebAgency',
    WEB_BUSINESS: 'WebBusiness',
    UNITY_DEVELOPER: 'UnityDeveloper',
    UNITY_DEVELOPER_PRO: 'UnityDeveloperPro',
    LIGHTSHIP_DEVELOPER: 'Lightship',
  }

  Account.PendingCancelType = {
    NONE: 'None',
    IMMEDIATE: 'Immediate',
    END_OF_CYCLE: 'EndOfCycle',
  }

  return Account
}
