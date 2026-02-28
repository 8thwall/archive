'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Apps', [
      {
        uuid: '10ecb51d-08e6-4938-89af-c36d287a7fca',
        status: "ENABLED",
        appName: 'com.8thwall.dreidelAR v1',
        appKey: "FOO",
        AccountUuid: 'eeb93d6a-8672-4627-97d3-f2ee9b9585bd',
        createdAt: new Date(),
        updatedAt: new Date(),
        violationStatus: 'None',
      },
      {
        uuid: '20ecb51d-08e6-4938-89af-c36d287a7fca',
        status: "ENABLED",
        appName: 'com.8thwall.fakeapp',
        appKey: "mobile app key",
        AccountUuid: 'eeb93d6a-8672-4627-97d3-f2ee9b9585bd',
        createdAt: new Date(),
        updatedAt: new Date(),
        violationStatus: 'None',
      },
      {
        uuid: 'b0266dd6-a5e4-412f-aa1c-5bbe76c45144',
        status: "ENABLED",
        appName: 'com.somecompany.Tank v1',
        appKey: "BAR1",
        AccountUuid: 'ac7d0be7-6c79-416b-886c-276719cff257',
        createdAt: new Date(),
        updatedAt: new Date(),
        violationStatus: 'None',
      },
      {
        uuid: '14d8766e-08f4-438e-ad24-3e38aab85ff4',
        status: "ENABLED",
        appName: 'com.somecompany.Tank v2',
        appKey: "BAR2",
        AccountUuid: 'ac7d0be7-6c79-416b-886c-276719cff257',
        createdAt: new Date(),
        updatedAt: new Date(),
        violationStatus: 'None',
      },
      {
        uuid: '213c12f1-cebc-4e9a-a788-f0a4b483daae',
        status: "ENABLED",
        appName: 'com.quotaissues.freeloader',
        appKey: "OVERQUOTA",
        AccountUuid: 'aa91fa27-7fec-4988-b652-76b8be2a532d',
        createdAt: new Date(),
        updatedAt: new Date(),
        violationStatus: 'None',
      },
      {
        uuid: '213c12f1-cebc-4e9a-a788-f0a4b999daae',
        status: "ENABLED",
        appName: 'BadApp',
        appKey: "badApp1",
        AccountUuid: 'eeb93d6a-8672-4627-97d3-f2ee9b9585bd',
        createdAt: new Date(),
        updatedAt: new Date(),
        violationStatus: 'Violation'
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {return queryInterface.bulkDelete('Apps', null, {});
  }
};
