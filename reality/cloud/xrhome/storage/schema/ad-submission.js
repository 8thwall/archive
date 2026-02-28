module.exports = (sequelize, DataTypes) => {
  const AdSubmission = sequelize.define('AdSubmission', {
    // The uuid belongs to the ad submission itself
    uuid: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDv4,
    },

    // Each ad submission owns an unique commit id
    commitId: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // The uuid of an ad app which owns the ad submission
    AppUuid: {
      allowNull: false,
      type: DataTypes.UUID,
    },

    // The uuid should match Choam's ad approval request
    requestUuid: {
      allowNull: true,
      type: DataTypes.UUID,
    },

    // Each approval status will be associated with an unique commit id
    reviewStatus: {
      type: DataTypes.ENUM('APPROVED', 'PENDING', 'REJECTED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },

    // Link url refer to the commit
    url: {
      allowNull: true,
      type: DataTypes.STRING,
    },

    // The timestamp for creating the commit
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },

    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },

    reviewedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },

    // Explanation for approving or rejecting the AdSubmission.
    decisionExplanation: {
      allowNull: true,
      type: DataTypes.TEXT,
    },

  })

  AdSubmission.associate = (models) => {
    AdSubmission.belongsTo(models.App)
  }

  return AdSubmission
}
