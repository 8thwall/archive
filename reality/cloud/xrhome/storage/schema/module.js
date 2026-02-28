module.exports = (sequelize, DataTypes) => {
  const Module = sequelize.define('Module', {
    uuid: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'DELETED'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    },
    AccountUuid: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    repoId: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    title: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    description: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    coverImageId: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    publicFeatured: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    /**
     * The version ID of the markdown file stored in S3 for the featured description.
     * This is updated every time the contents of the description is changed.
     */
    featuredDescriptionId: {
      allowNull: true,
      type: DataTypes.STRING,
    },

    /**
     * The URL of the video which should be embedded on the modules import details
     */
    featuredVideoUrl: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    /**
     * Controls which types of projects the module can be imported into
     */
    compatibility: {
      type: DataTypes.ENUM(
        'UNSET', 'CLOUD_EDITOR_ONLY', 'SELF_ONLY', 'ANY', 'CLOUD_STUDIO_ONLY',
        'EDITOR_SELF', 'SELF_STUDIO', 'EDITOR_STUDIO'
      ),
      allowNull: false,
      defaultValue: 'UNSET',
    },
    /**
     * Who has access to the repo (which allows for forking).
     */
    repoVisibility: {
      type: DataTypes.ENUM('PRIVATE', 'PUBLIC'),
      allowNull: false,
      defaultValue: 'PRIVATE',
    },
    /**
     * Archived module is no longer visible but is still importable
     */
    archived: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  })

  Module.associate = (models) => {
    Module.belongsTo(models.Account)
    Module.hasMany(models.ModuleUser, {foreignKey: 'ModuleUuid'})
    Module.hasMany(models.FeaturedAppImage, {foreignKey: 'ModuleUuid'})
    Module.belongsToMany(models.AppTag, {
      through: models.ModuleTagMap,
      as: 'Tags',
      foreignKey: 'ModuleUuid',
    })
  }

  return Module
}
