module.exports = (sequelize, DataTypes) => {
  const AssetRequest = sequelize.define('AssetRequest', {
    uuid: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    AccountUuid: {
      allowNull: false,
      type: DataTypes.UUID,
      comment: 'Uuid of the account from which the request was raised',
      references: {model: 'Accounts', key: 'uuid'},
    },
    UserUuid: {
      allowNull: false,
      type: DataTypes.UUID,
      comment: 'Uuid of the user who raised the request',
      references: {model: 'Users', key: 'uuid'},
    },
    ParentRequestUuid: {
      allowNull: true,
      type: DataTypes.UUID,
      comment: 'Association to the parent request that this request was created from. ' +
        'For example, an IMAGE_TO_IMAGE request used to generate a mesh.',
    },
    totalActionQuantity: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: 'Total cost of this request, in bips.',
    },
    input: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Input parameters for the generation request.',
    },
    type: {
      type: DataTypes.ENUM('TEXT_TO_IMAGE', 'IMAGE_TO_IMAGE', 'IMAGE_TO_MESH', 'MESH_TO_ANIMATION'),
      allowNull: true,
      comment: 'Type of request is determined by input and expected output.',
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM('REQUESTED', 'PROCESSING', 'SUCCESS', 'FAILED'),
      defaultValue: 'REQUESTED',
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
        fields: ['UserUuid'],
      },
      {
        fields: ['AccountUuid'],
      },
    ],
  })

  AssetRequest.associate = (models) => {
    AssetRequest.belongsTo(models.User, {
      foreignKey: 'UserUuid',
      targetKey: 'uuid',
    })
    AssetRequest.belongsTo(models.Account, {
      foreignKey: 'AccountUuid',
      targetKey: 'uuid',
    })
    AssetRequest.hasMany(models.AssetGeneration, {
      foreignKey: 'RequestUuid',
    })
    AssetRequest.hasMany(models.CreditBalanceTransaction, {
      foreignKey: 'AssetRequestUuid',
      constraints: false,
    })
    AssetRequest.belongsTo(models.AssetRequest, {
      foreignKey: 'ParentRequestUuid',
      targetKey: 'uuid',
    })
    AssetRequest.hasMany(models.AssetRequest, {
      foreignKey: 'ParentRequestUuid',
      as: 'ChildRequests',
    })
  }

  return AssetRequest
}
