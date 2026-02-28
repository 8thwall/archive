'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('User_Accounts', [
      {
        UserUuid: "17dac8dd-24df-4e02-a67d-7024d4186cef",
        AccountUuid: 'eeb93d6a-8672-4627-97d3-f2ee9b9585bd',
        role: 'OWNER',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserUuid: "2d3aea57-db3f-42df-845a-4390612700c1",
        AccountUuid: 'eeb93d6a-8672-4627-97d3-f2ee9b9585bd',
        role: 'DEV',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserUuid: "c136498d-7e27-4a22-b7d7-767eb91ba019",
        AccountUuid: 'eeb93d6a-8672-4627-97d3-f2ee9b9585bd',
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserUuid: "3c79eb40-fd55-11e7-be19-1be6a0e0ed3b",
        AccountUuid: 'ac7d0be7-6c79-416b-886c-276719cff257',
        role: 'OWNER',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserUuid: "2d3aea57-db3f-42df-845a-4390612700c1",
        AccountUuid: 'ac7d0be7-6c79-416b-886c-276719cff257',
        role: 'DEV',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
  },

  down: (queryInterface, Sequelize) => { return queryInterface.bulkDelete('User_Accounts', null, {}) }
};
