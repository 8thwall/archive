module.exports = (sequelize, DataTypes) => {
  const NaePackagerVersionState = sequelize.define('NaePackagerVersionState', {
    name: {
      type: DataTypes.ENUM('main', 'branch'),
      allowNull: false,
      primaryKey: true,
      comment: 'The name of the version state; tied to a jenkins job, e.g. "main", "branch"',
    },
    major: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'The major version number',
    },
    minor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'The major version number',
    },
    patch: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'The version number to use for a patch or hotfix',
    },
    main: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'The version number incremented for each main release',
    },
  })

  return NaePackagerVersionState
}
