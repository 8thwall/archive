import {Sequelize, DataTypes} from 'sequelize'

const sequelize = new Sequelize('sqlite::memory:', {
  logging: true,
})

const Log = sequelize.define('Logs', {
  timestamp: DataTypes.DATE,
  type: DataTypes.INTEGER,
  content: DataTypes.JSON,
  recordingId: DataTypes.INTEGER,
}, {timestamps: false})

const Recording = sequelize.define('Recordings', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: DataTypes.TEXT,
})

Recording.hasMany(Log, {foreignKey: 'recordingId'})

sequelize.sync()

export {
  sequelize,
  Log,
  Recording,
}
