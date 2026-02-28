const PROPERTY_TYPE_OVERRIDES = {
  'App': {
    'webOrigins': 'string[]',
  },
  'DependencySet': {
    'data': '{dependenciesById: DependenciesById}',
  },
  'User': {
    'themeSettings': 'Partial<UserEditorSettings>',
    'tosAgreements': 'TermsAgreements',
  },
  'Account': {
    'specialFeatures': 'Array<SpecialFeatureFlag>',
  },
  'AssetGeneration': {
    'metadata': 'Record<string, unknown>',
  },
  'AssetRequest': {
    'input': 'Partial<GenerateRequestInput>',
  },
  'NaeInfo': {
    'permissions': 'Permissions',
  },
}

export {
  PROPERTY_TYPE_OVERRIDES,
}
