'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('PolicyViolations', [
      {
        uuid: '163e5120-fd7a-11e8-8eb2-f2801f1b9fd1',
        status: 'Violation',
        violationType: 'InappropriateContent',
        AccountUuid: 'feda84ae-fd79-11e8-8eb2-f2801f1b9fd1',
        createdAt: new Date(),
        updatedAt: new Date(),
        creatorId: 4,
      },
      {
        uuid: '163e54d6-fd7a-11e8-8eb2-f2801f1b9fd1',
        status: 'Resolved',
        violationType: 'PaymentFailed',
        AccountUuid: 'feda84ae-fd79-11e8-8eb2-f2801f1b9fd1',
        createdAt: new Date(),
        updatedAt: new Date(),
        resolvedAt: new Date(),
        creatorId: 4,
        resolverId: 4,
      },
      {
        uuid: '163e5120-fd7a-11e8-8eb2-f2801f1b9fff',
        status: 'Violation',
        violationType: 'InappropriateContent',
        AppUuid: '213c12f1-cebc-4e9a-a788-f0a4b999daae',
        createdAt: new Date(),
        updatedAt: new Date(),
        creatorId: 4,
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => { return queryInterface.bulkDelete('PolicyViolations', null, {}) }
};
