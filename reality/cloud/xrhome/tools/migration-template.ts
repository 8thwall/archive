import type {QueryInterface, DataTypes as DataTypesNamespace} from 'sequelize'

const up = async (queryInterface: QueryInterface, DataTypes: typeof DataTypesNamespace) => {
  const transaction = await queryInterface.sequelize.transaction()
  try {
    // Add altering commands here.
    await queryInterface.addColumn('ExampleTable', 'exampleColumn', {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Explanation of what the column represents',
    }, {transaction})
    await transaction.commit()
  } catch (err) {
    await transaction.rollback()
    throw err
  }
}

const down = async (queryInterface: QueryInterface) => {
  const transaction = await queryInterface.sequelize.transaction()
  try {
    // Add reverting commands here.
    await queryInterface.removeColumn('ExampleTable', 'exampleColumn', {transaction})
    await transaction.commit()
  } catch (err) {
    await transaction.rollback()
    throw err
  }
}

export {up, down}
