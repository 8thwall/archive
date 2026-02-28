'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Accounts', [
      {
        uuid: 'eeb93d6a-8672-4627-97d3-f2ee9b9585bd',
        name: "com.the8thwall",
        url: "8thwall.com",
        status: "ENABLED",
        shortName: "8w",
        createdAt: new Date(),
        updatedAt: new Date(),
        accountType: 'WebCamera',
        violationStatus: 'None',
      },
      {
        uuid: 'ac7d0be7-6c79-416b-886c-276719cff257',
        name: "com.company",
        url: "somecompany.com",
        status: "ENABLED",
        shortName: "sc",
        createdAt: new Date(),
        updatedAt: new Date(),
        overQuotaUntil: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        accountType: 'WebCamera',
        violationStatus: 'None',
      },
      {
        uuid: 'aa91fa27-7fec-4988-b652-76b8be2a532d',
        name: "com.quotaissues",
        url: "quotaissues.com",
        status: "ENABLED",
        shortName: "qi",
        createdAt: new Date(),
        updatedAt: new Date(),
        overQuotaUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        accountType: 'WebCamera',
        violationStatus: 'None',
      },
      {
        uuid: 'feda84ae-fd79-11e8-8eb2-f2801f1b9fd1',
        name: 'BadAccount',
        url: '8thwall.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        shortName: "bad",
        status: 'ENABLED',
        accountType: 'WebCamera',
        violationStatus: 'Violation'
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {return queryInterface.bulkDelete('Accounts', null, {});
  }
};
