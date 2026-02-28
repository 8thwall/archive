module.exports = (sequelize, DataTypes) => {
  const DiscoveryApp = sequelize.define('DiscoveryApp', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      comment: 'This primary key is also a foreign key to records in the App table',
      references: {
        model: 'Apps',
        key: 'uuid',
      },
    },
    hidden: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: 'Hides an app from Discovery',
    },
  })

  DiscoveryApp.associate = (models) => {
    DiscoveryApp.belongsTo(models.App, {foreignKey: 'uuid'})
  }

  return DiscoveryApp
}
