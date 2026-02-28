/**
This table stores the base pricing information for each model and request type.
*/

module.exports = (sequelize, DataTypes) => {
  const CreditServicePricing = sequelize.define('CreditServicePricing', {
    uuid: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    feature: {
      type: DataTypes.ENUM('ASSET_GEN', 'NAE'),
      allowNull: false,
      comment: 'Feature that this pricing record is associated with',
    },
    // If ASSET_GEN, requestType=(TEXT_TO_IMAGE, IMAGE_TO_IMAGE, IMAGE_TO_MESH, MESH_TO_ANIMATION)
    // If NAE, requestType=(ANDROID, IOS, HTML)
    requestType: {
      type: DataTypes.ENUM(
        'TEXT_TO_IMAGE',
        'IMAGE_TO_IMAGE',
        'IMAGE_TO_MESH',
        'MESH_TO_ANIMATION',
        'ANDROID',
        'IOS',
        'HTML'
      ),
      allowNull: false,
      comment: 'Type of request to the feature',
    },
    // Because requests are configurable by the user, this price only represents the base
    //     number of credits that would be charged for this requestType.
    // The final price may be higher based on the batch size, input type, etc. and the
    //     total will be stored as totalActionQuantity in CreditBalanceTransactions.
    // Specific parameters chosen for asset generation will be stored as metadata in
    //     AssetGenerations.
    requestPrice: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'Base price, in credits, that the customer will be charged for this request',
    },
    AiModelUuid: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {model: 'AiModels', key: 'uuid'},
      comment: 'UUID of the AI model that this pricing record is associated with, if applicable',
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'QA'),
      defaultValue: 'QA',
      allowNull: false,
      comment: 'Status of this pricing record',
    },
    UserUuid: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {model: 'Users', key: 'uuid'},
      comment: 'UUID of the user who created this pricing record',
    },
  })

  CreditServicePricing.associate = (models) => {
    // User who created this pricing record
    CreditServicePricing.belongsTo(models.User, {
      foreignKey: 'UserUuid',
      targetKey: 'uuid',
      constraints: false,
    })

    // AI model associated with this pricing record, if applicable
    CreditServicePricing.belongsTo(models.AiModel, {
      foreignKey: 'AiModelUuid',
      targetKey: 'uuid',
      constraints: false,
    })
  }
  return CreditServicePricing
}
