module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.bulkInsert('Accounts', [
      {
        uuid: '5f853779-a91d-4c71-b90b-13d3f114fa85',
        name: '8th Wall',
        url: '8thwall.com',
        status: 'ENABLED',
        shortName: '8thwall',
        createdAt: new Date(),
        updatedAt: new Date(),
        accountType: 'WebEnterprise',
        violationStatus: 'None',
        publicFeatured: true,
        bio: '8th Wall is breaking down walls between the digital and physical worlds, allowing creators and brands to develop immersive content that can be instantly published to the mobile web.',
        icon: 'fbf075d2-08f8-4cfe-917a-16e82ab3fb66',
      },
    ], {}),
    queryInterface.bulkInsert('Apps', [
      {
        uuid: 'ece9afc2-bc39-4d7a-be80-157a6e861b7a',
        appName: 'floatnotes-aframe',
        status: 'ENABLED',
        appKey: '<REMOVED_BEFORE_OPEN_SOURCING>',
        repoStatus: 'PUBLIC',
        createdAt: new Date(),
        updatedAt: new Date(),
        AccountUuid: '5f853779-a91d-4c71-b90b-13d3f114fa85',
        publicFeatured: true,
        isWeb: true,
        appDescription: 'Drop AR post-it notes in 3D space! You can also edit and delete them. Example of anchoring objects to the air and text input.',
        coverImageId: '2ny51vkvowgys4ilrqaknuilabto23c2w7vmphydobi1ev5k8ac56n93',
      },
      {
        uuid: '0d3df79f-c75f-4f73-abb0-9d900dc9e666',
        status: 'DISABLED',
        appName: 'aframe_placeground',
        appKey: '<REMOVED_BEFORE_OPEN_SOURCING>',
        repoStatus: 'PUBLIC',
        createdAt: new Date(),
        updatedAt: new Date(),
        AccountUuid: '5f853779-a91d-4c71-b90b-13d3f114fa85',
        publicFeatured: true,
        isWeb: true,
      },
      {
        uuid: 'a12d9ed4-3955-4459-9306-e648b343c156',
        status: 'ENABLED',
        appName: 'inline-ar',
        appKey: '<REMOVED_BEFORE_OPEN_SOURCING>',
        repoStatus: 'PUBLIC',
        createdAt: new Date(),
        updatedAt: new Date(),
        AccountUuid: '5f853779-a91d-4c71-b90b-13d3f114fa85',
        publicFeatured: true,
        isWeb: true,
        appDescription: 'This example embeds a WebAR experience inside an existing website. Useful for immersive articles, e-commerce product carousels, and more!',
        coverImageId: '4s2vjtgwj3gg43jw7swy52idzl1e4gpwzo8ltc3qsqvbuwptd7zvvrjo',
      },
    ], {}),
  ]),

  down: (queryInterface, Sequelize) => (
    Promise.all([
      queryInterface.bulkDelete('Accounts', {
        uuid: '5f853779-a91d-4c71-b90b-13d3f114fa85',
      }, {}),
      queryInterface.bulkDelete('Apps', {
        AccountUuid: '5f853779-a91d-4c71-b90b-13d3f114fa85',
      }, {}),
    ])
  ),
}
