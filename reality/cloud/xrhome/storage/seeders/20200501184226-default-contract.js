module.exports = {
  up: async (queryInterface, Sequelize) => {
    const startDate = new Date()
    const expirationDate = new Date(
      startDate.getFullYear() + 5,
      startDate.getMonth(),
      startDate.getDate()
    )

    await queryInterface.bulkInsert('Contracts', [
      {
        uuid: '8d02ee42-4b7f-4059-bdb1-e24d012f6f43',
        AccountUuid: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 1,
        isReusable: true,
        name: '2019-08-20 Commercial Agreement',
        signedDate: new Date(),
        hasPublicityRights: true,
        pdfPath:
          'contracts/null/8d02ee42-4b7f-4059-bdb1-e24d012f6f43',
        isAvailableAsCanned: true,
        invoicePaymentsAllowed: false,
        startDate,
        expirationDate,
      },
    ])
    await queryInterface.bulkInsert('ContractTemplates', [
      {
        uuid: 'ed66aa47-015b-418f-8c5a-82180e14269c',
        ContractUuid: '8d02ee42-4b7f-4059-bdb1-e24d012f6f43',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: '2019-08-20 Commercial Agreement_DEV',
        description: null,
        amount: 25000,
        interval: 'MONTH',
        intervalCount: 1,
        daysUntilDue: 30,
        type: 'DEV',
        billingScheme: 'PER_UNIT',
        stripeSubPlanId: 'plan_HCT2mTRZXieSIF',
        stripeUsagePlanId: null,
        packageId: '9db48ed8-c4ac-40e2-a40f-cc728a788b7c',
      },
      {
        uuid: 'b9fb535e-ba9b-4ff7-a355-7c7a30bbe9f6',
        ContractUuid: '8d02ee42-4b7f-4059-bdb1-e24d012f6f43',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Pay-per-view',
        description: 'Usage-based billing for variable traffic to your commercial project.',
        amount: 100000,
        interval: 'MONTH',
        intervalCount: 1,
        daysUntilDue: 30,
        type: 'CAMPAIGN',
        billingScheme: 'TIERED',
        stripeSubPlanId: 'plan_HCT2E9LaYSNLpj',
        stripeUsagePlanId: 'plan_HCT2LwkGAs52Xb',
        packageId: 'dd0ca66c-56b2-4edf-a442-18931c29f2bb',
      },
      {
        uuid: '53b73a14-eb29-488d-9ffd-52ff9a5af327',
        ContractUuid: '8d02ee42-4b7f-4059-bdb1-e24d012f6f43',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Standard Bundle',
        description: 'Includes a pre-paid bundle for standard traffic to your commercial project.',
        amount: 300000,
        interval: 'MONTH',
        intervalCount: 1,
        daysUntilDue: 30,
        type: 'CAMPAIGN',
        billingScheme: 'TIERED',
        stripeSubPlanId: 'plan_HCT2VmsWOUjVxL',
        stripeUsagePlanId: 'plan_HCT2Ke2AM0p6Ic',
        packageId: 'ad686307-629c-45d6-bb1d-8f395112989d',
      },
      {
        uuid: 'c58c534f-5589-4fa9-95be-39309077c984',
        ContractUuid: '8d02ee42-4b7f-4059-bdb1-e24d012f6f43',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'High Traffic PPV',
        description: 'Significantly discounted usage-based billing for high volume traffic to your commercial project.',
        amount: 600000,
        interval: 'MONTH',
        intervalCount: 1,
        daysUntilDue: 30,
        type: 'CAMPAIGN',
        billingScheme: 'TIERED',
        stripeSubPlanId: 'plan_HCT2EHy9R1CPYx',
        stripeUsagePlanId: 'plan_HCT2xy2Hgcsm4o',
        packageId: '8de02221-a12c-4dbb-b79b-31460632a4d3',
      },
      {
        uuid: '1c2a50ff-eeb3-496b-8328-3f41c99f74f5',
        ContractUuid: '8d02ee42-4b7f-4059-bdb1-e24d012f6f43',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'High Traffic Bundle',
        description: 'High Traffic usage-based discounts plus a 5-million-view pre-paid bundle for high volume traffic to your commercial project.',
        amount: 600000,
        interval: 'MONTH',
        intervalCount: 1,
        daysUntilDue: 30,
        type: 'CAMPAIGN',
        billingScheme: 'TIERED',
        stripeSubPlanId: 'plan_HCT2MO9kmLGMWm',
        stripeUsagePlanId: 'plan_HCT2dPHYsBLfz8',
        packageId: 'b16f02bc-423d-4a5c-9e30-da475be6d29b',
      },
    ])

    await queryInterface.bulkInsert('ContractTiers', [
      {
        /* Pay-per-view */
        uuid: '4f322b4e-a83d-4cc1-925a-b83986061a1c',
        createdAt: new Date(),
        updatedAt: new Date(),
        flat_amount: 0,
        unit_amount: 100,
        up_to: 0,
        ContractTemplateUuid: 'b9fb535e-ba9b-4ff7-a355-7c7a30bbe9f6',
      },
      {
        /* Standard Bundle */
        uuid: '82e546ba-61bb-40c0-a818-7375901a2da6',
        createdAt: new Date(),
        updatedAt: new Date(),
        flat_amount: 0,
        unit_amount: 0,
        up_to: 5000,
        ContractTemplateUuid: '53b73a14-eb29-488d-9ffd-52ff9a5af327',
      },
      {
        /* Standard Bundle */
        uuid: '3910e9e4-d158-4dbe-a7ee-3cb07e2fe7a5',
        createdAt: new Date(),
        updatedAt: new Date(),
        flat_amount: 0,
        unit_amount: 100,
        up_to: 0,
        ContractTemplateUuid: '53b73a14-eb29-488d-9ffd-52ff9a5af327',
      },
      {
        /* High Traffic PPV */
        uuid: '0fc80e3b-8ced-42e3-a19a-6d3c7c18c520',
        createdAt: new Date(),
        updatedAt: new Date(),
        flat_amount: 0,
        unit_amount: 25,
        up_to: 0,
        ContractTemplateUuid: 'c58c534f-5589-4fa9-95be-39309077c984',
      },
      {
        /* High Traffic Bundle */
        uuid: '7ee8a194-ab15-4f19-a600-3220312aa4d9',
        createdAt: new Date(),
        updatedAt: new Date(),
        flat_amount: 0,
        unit_amount: 0,
        up_to: 50000,
        ContractTemplateUuid: '1c2a50ff-eeb3-496b-8328-3f41c99f74f5',
      },
      {
        /* High Traffic Bundle */
        uuid: 'ad1d33c4-c484-4c98-8abd-df2819935498',
        createdAt: new Date(),
        updatedAt: new Date(),
        flat_amount: 0,
        unit_amount: 25,
        up_to: 0,
        ContractTemplateUuid: '1c2a50ff-eeb3-496b-8328-3f41c99f74f5',
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ContractTiers', null, {})
    await queryInterface.bulkDelete('ContractTemplates', null, {})
    await queryInterface.bulkDelete('Contracts', null, {})
  },
}
