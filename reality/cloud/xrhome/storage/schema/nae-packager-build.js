module.exports = (sequelize, DataTypes) => {
  const NaePackagerBuild = sequelize.define('NaePackagerBuild', {
    version: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      comment: 'The version string, e.g. "1.0.0.123"',
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'The date when the version was released',
    },
    status: {
      type: DataTypes.ENUM('COMPLETED', 'FAILED', 'PENDING'),
      allowNull: true,
      comment: 'The status of the build, e.g. "COMPLETED", "FAILED"',
    },
    buildType: {
      type: DataTypes.ENUM('branch', 'main'),
      allowNull: true,
      comment: 'The source of build, e.g. "branch" or "main"',
    },
    byteSize: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: 'The size of the build in bytes',
    },
    filename: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'The name of the file, e.g. "nae-1.0.0.zip"',
    },
    sha256: {
      type: DataTypes.STRING(64),
      allowNull: true,
      comment: 'The SHA256 hash of the build file',
    },
  })

  return NaePackagerBuild
}
