module.exports = (sequelize, DataTypes) => {
  const AssetGeneration = sequelize.define('AssetGeneration', {
    uuid: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    RequestUuid: {
      allowNull: false,
      type: DataTypes.UUID,
      comment: 'Uuid of the request for which the asset was generated',
      references: {model: 'AssetRequests', key: 'uuid'},
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
    assetType: {
      type: DataTypes.ENUM('IMAGE', 'MESH'),
      allowNull: false,
    },
    modelName: {
      allowNull: false,
      type: DataTypes.STRING,
      comment: 'AI model used to generate the asset',
    },
    prompt: {
      allowNull: true,
      type: DataTypes.TEXT,
    },
    negativePrompt: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    style: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    seed: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    metadata: {
      allowNull: true,
      type: DataTypes.JSONB,
      comment: 'Parameters used for generating the asset',
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }, {
    indexes: [
      {
        fields: ['UserUuid'],
      },
      {
        fields: ['AccountUuid'],
      },
      {
        fields: ['RequestUuid'],
      },
    ],
  })

  AssetGeneration.associate = (models) => {
    AssetGeneration.belongsTo(models.User, {
      foreignKey: 'UserUuid',
      targetKey: 'uuid',
    })
    AssetGeneration.belongsTo(models.Account, {
      foreignKey: 'AccountUuid',
      targetKey: 'uuid',
    })
    AssetGeneration.belongsTo(models.AssetRequest, {
      foreignKey: 'RequestUuid',
      targetKey: 'uuid',
    })
  }

  return AssetGeneration
}
