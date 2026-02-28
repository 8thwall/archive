module.exports = (sequelize, DataTypes) => {
  const CrossAccountPermission = sequelize.define('CrossAccountPermission', {
    uuid: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDv4,
    },
    FromAccountUuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDv4,
    },
    ToAccountUuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDv4,
    },
    AppUuid: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: DataTypes.UUIDv4,
    },
    status: DataTypes.ENUM('INVITED', 'ACTIVE', 'DELETED'),
    inviteToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    invitedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    indexes: [
      {
        fields: ['AppUuid'],
      },
      {
        fields: ['FromAccountUuid'],
      },
      {
        fields: ['ToAccountUuid'],
      },
    ],
  })

  CrossAccountPermission.associate = (models) => {
    CrossAccountPermission.belongsTo(models.App)
    CrossAccountPermission.belongsTo(models.Account, {
      as: 'FromAccount',
      foreignKey: 'FromAccountUuid',
      targetKey: 'uuid',
    })
    CrossAccountPermission.belongsTo(models.Account, {
      as: 'ToAccount',
      foreignKey: 'ToAccountUuid',
      targetKey: 'uuid',
    })
  }

  return CrossAccountPermission
}
