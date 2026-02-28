/**
This table stores specifications for GenAI models that we are considering offering to customers.
*/

const columnExamples = {
  serviceProvider: ['AWS Bedrock'],
  modelProvider: ['Black Forest Labs', 'Anthropic'],
  modelFamily: ['FLUX', 'Claude'],
  modelId: ['FLUX1.1 Pro', 'claude-3-7-sonnet-20250219-v1:0'],
}
const listExamples = column => `(e.g. ${columnExamples[column].join(', ')})`

module.exports = (sequelize, DataTypes) => {
  const AiModel = sequelize.define('AiModel', {
    uuid: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    serviceProvider: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: `Provider of this service ${listExamples('serviceProvider')}`,
    },
    modelProvider: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: `Provider of this model ${listExamples('modelProvider')}`,
    },
    modelFamily: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: `Name of model family ${listExamples('modelFamily')}`,
    },
    modelId: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: `Version/identifier of the model ${listExamples('modelId')}`,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'QA'),
      defaultValue: 'QA',
      allowNull: false,
      comment: 'Status of this model record',
    },
    UserUuid: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {model: 'Users', key: 'uuid'},
      comment: 'UUID of the user who created this model record',
    },
  })

  AiModel.associate = (models) => {
    AiModel.belongsTo(models.User, {
      foreignKey: 'UserUuid',
      targetKey: 'uuid',
      constraints: false,
    })

    AiModel.hasMany(models.CreditServicePricing, {
      foreignKey: 'AiModelUuid',
      constraints: false,
    })
  }

  return AiModel
}
