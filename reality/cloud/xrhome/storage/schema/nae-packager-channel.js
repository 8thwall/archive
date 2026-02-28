module.exports = (sequelize, DataTypes) => {
  const NaePackagerChannel = sequelize.define('NaePackagerChannel', {
    name: {
      type: DataTypes.ENUM('branch', 'beta', 'release', 'dev'),
      allowNull: false,
      primaryKey: true,
      comment: 'The name of the build channel',
    },
    version: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      comment: 'The semantic version number of the channel build -' +
        'will match with the value of `version` in a row in `NaePackagerBuilds`',
    },
  })

  return NaePackagerChannel
}
