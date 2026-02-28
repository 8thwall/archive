/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('ReferralCodeRewards', [{
      uuid: 'a4423355-4851-47dc-bfab-eaf50c65db1c',
      name: 'Default Reward',
      referrerCreditAmount: 10.0,
      refereeCreditAmount: 5.0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {})
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('ReferralCodeRewards', null, {
      where: {
        uuid: 'a4423355-4851-47dc-bfab-eaf50c65db1c',
      },
    })
  },
}
