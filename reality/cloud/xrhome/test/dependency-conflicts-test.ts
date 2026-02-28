import {assert} from 'chai'
import uuidv4 from 'uuid/v4'
import type {DeepReadonly} from 'ts-essentials'

import {
  DependencyConflictDetails, autoMergeDependencies, generateDependencyConflictDetails,
  resolveDependencyConflicts,
} from '../src/client/editor/dependency-conflicts'
import type {GatewayDefinition} from '../src/shared/gateway/gateway-types'

const BASE_CONFIG = {
  example: 'value',
} as const

const LITERAL_1 = {type: 'literal', value: 'literal-1'} as const
const LITERAL_2 = {type: 'literal', value: 'literal-2'} as const
const SECRET_1 = {type: 'secret', secretId: 'secret-1'} as const
const SECRET_2 = {type: 'secret', secretId: 'secret-2'} as const

const BASE_BACKEND_SLOT_VALUES = {slot1: LITERAL_1, slot2: SECRET_1}

const BACKEND_1: DeepReadonly<GatewayDefinition> = {
  headers: {header1: LITERAL_1},
  routes: [],
}

const BACKEND_2: DeepReadonly<GatewayDefinition> = {
  headers: {header2: SECRET_1},
  routes: [],
}

const BASE_DEPENDENCY = {
  type: 'module',
  dependencyId: uuidv4(),
  moduleId: uuidv4(),
  alias: 'original',
  target: {type: 'branch', branch: 'master'},
  config: BASE_CONFIG,
  backendSlotValues: BASE_BACKEND_SLOT_VALUES,
} as const

const SYMBOL_FOR_INDECISION = Symbol('indecision')

const BASE_DETAILS: DeepReadonly<DependencyConflictDetails> = {
  mine: BASE_DEPENDENCY,
  theirs: BASE_DEPENDENCY,
  conflictedAlias: null,
  conflictedTarget: null,
  conflictedConfigEntries: {},
  conflictedBackendSlotValues: {},
  dependencyWithoutConflicts: BASE_DEPENDENCY,
  symbolForIndecision: SYMBOL_FOR_INDECISION,
}

describe('autoMergeDependencies', () => {
  it('Returns null if there is an alias conflict', () => {
    const yours = {...BASE_DEPENDENCY, alias: 'yours'}
    assert.isNull(autoMergeDependencies(yours, BASE_DEPENDENCY, BASE_DEPENDENCY))
  })

  it('Returns null if there is a target conflict', () => {
    const yours = {...BASE_DEPENDENCY, target: {type: 'branch', branch: 'other'}} as const
    assert.isNull(autoMergeDependencies(yours, BASE_DEPENDENCY, BASE_DEPENDENCY))
  })

  it('Returns null if there is a config conflict', () => {
    const yours = {...BASE_DEPENDENCY, config: {example: 'my-value'}} as const
    const theirs = {...BASE_DEPENDENCY, config: {example: 'other-value'}} as const
    assert.isNull(autoMergeDependencies(yours, theirs, BASE_DEPENDENCY))
  })

  it('Returns null if there is a backend literal value conflict', () => {
    const yours = {...BASE_DEPENDENCY, backendSlotValues: {example: LITERAL_1}} as const
    const theirs = {...BASE_DEPENDENCY, backendSlotValues: {example: LITERAL_2}} as const
    assert.isNull(autoMergeDependencies(yours, theirs, BASE_DEPENDENCY))
  })

  it('Returns null if there is a backend secret value conflict', () => {
    const yours = {...BASE_DEPENDENCY, backendSlotValues: {example: SECRET_1}} as const
    const theirs = {...BASE_DEPENDENCY, backendSlotValues: {example: LITERAL_1}} as const
    assert.isNull(autoMergeDependencies(yours, theirs, BASE_DEPENDENCY))
  })

  it('Returns merged state if backend slot values updated independently', () => {
    const yours = {...BASE_DEPENDENCY, backendSlotValues: {slot3: LITERAL_2}} as const
    const theirs = {...BASE_DEPENDENCY, backendSlotValues: {slot4: SECRET_2}} as const
    assert.deepStrictEqual(autoMergeDependencies(yours, theirs, BASE_DEPENDENCY), {
      ...BASE_DEPENDENCY,
      backendSlotValues: {
        slot3: LITERAL_2,
        slot4: SECRET_2,
      },
    })
  })

  it('Returns merged state if config updated independently', () => {
    const yours = {...BASE_DEPENDENCY, config: {...BASE_CONFIG, example1: 'my-value'}} as const
    const theirs = {...BASE_DEPENDENCY, config: {...BASE_CONFIG, example2: 'other-value'}} as const
    assert.deepStrictEqual(autoMergeDependencies(yours, theirs, BASE_DEPENDENCY), {
      ...BASE_DEPENDENCY,
      config: {
        ...BASE_CONFIG,
        example1: 'my-value',
        example2: 'other-value',
      },
    })
  })

  it('Returns their config for backend if targets are equivalent', () => {
    const yours = {...BASE_DEPENDENCY, backendTemplates: [BACKEND_1]} as const
    const theirs = {...BASE_DEPENDENCY, backendTemplates: [BACKEND_2]} as const
    assert.deepStrictEqual(autoMergeDependencies(yours, theirs, BASE_DEPENDENCY), theirs)
  })

  it('Merges equivalent states', () => {
    assert.deepStrictEqual(
      autoMergeDependencies(BASE_DEPENDENCY, BASE_DEPENDENCY, BASE_DEPENDENCY),
      BASE_DEPENDENCY
    )
  })

  it('Doesn\'t add backendSlotValues if it wasn\'t already present', () => {
    const withoutBackend = {...BASE_DEPENDENCY, backendSlotValues: undefined}
    assert.deepStrictEqual(
      autoMergeDependencies(withoutBackend, withoutBackend, withoutBackend),
      withoutBackend
    )
  })
})

describe('resolveDependencyConflicts', () => {
  it('Resolves non-conflicted details', () => {
    assert.deepStrictEqual(resolveDependencyConflicts(BASE_DETAILS), BASE_DEPENDENCY)
  })

  it('Returns null for details with alias conflict', () => {
    assert.isNull(resolveDependencyConflicts({
      ...BASE_DETAILS,
      conflictedAlias: {
        mine: 'mine',
        theirs: 'theirs',
        resolution: SYMBOL_FOR_INDECISION,
      },
    }))
  })

  it('Returns null for details with target conflict', () => {
    assert.isNull(resolveDependencyConflicts({
      ...BASE_DETAILS,
      conflictedTarget: {
        mine: {type: 'branch', branch: 'master'},
        theirs: {type: 'branch', branch: 'master2'},
        resolution: SYMBOL_FOR_INDECISION,
      },
    }))
  })

  it('Returns null for details with config conflict', () => {
    assert.isNull(resolveDependencyConflicts({
      ...BASE_DETAILS,
      conflictedConfigEntries: {
        alreadyResolved: {mine: 0, theirs: 1, resolution: 1},
        stillConflicted: {mine: 0, theirs: 1, resolution: SYMBOL_FOR_INDECISION},
      },
    }))
  })

  it('Returns null for details with slot value conflict', () => {
    assert.isNull(resolveDependencyConflicts({
      ...BASE_DETAILS,
      conflictedBackendSlotValues: {
        alreadyResolved: {mine: LITERAL_1, theirs: LITERAL_2, resolution: LITERAL_1},
        stillConflicted: {mine: LITERAL_1, theirs: LITERAL_2, resolution: SYMBOL_FOR_INDECISION},
      },
    }))
  })

  it('Returns merged state after all conflicts are resolved', () => {
    assert.deepStrictEqual(resolveDependencyConflicts({
      ...BASE_DETAILS,
      conflictedAlias: {
        mine: 'mine',
        theirs: 'theirs',
        resolution: 'mine',
      },
      conflictedTarget: {
        mine: {type: 'branch', branch: 'master'},
        theirs: {type: 'branch', branch: 'master2'},
        resolution: {type: 'branch', branch: 'master2'},
      },
      conflictedConfigEntries: {
        alreadyResolved: {mine: 0, theirs: 1, resolution: 1},
        stillConflicted: {mine: 0, theirs: 1, resolution: 0},
      },
    }), {
      ...BASE_DEPENDENCY,
      alias: 'mine',
      target: {type: 'branch', branch: 'master2'},
      config: {
        ...BASE_CONFIG,
        alreadyResolved: 1,
        stillConflicted: 0,
      },
    })
  })

  it('Resolves the backendTemplates to match theirs if their target was chosen', () => {
    const mine = {
      ...BASE_DEPENDENCY,
      target: {type: 'branch', branch: 'my-branch'},
      backendTemplates: [BACKEND_1],
    } as const
    const theirs = {
      ...BASE_DEPENDENCY,
      target: {type: 'branch', branch: 'their-branch'},
      backendTemplates: [BACKEND_2],
    } as const

    assert.deepStrictEqual(resolveDependencyConflicts({
      ...BASE_DETAILS,
      mine,
      theirs,
      conflictedAlias: {
        mine: 'mine',
        theirs: 'theirs',
        resolution: 'mine',
      },
      conflictedTarget: {
        mine: mine.target,
        theirs: theirs.target,
        resolution: theirs.target,
      },
      conflictedConfigEntries: {
        alreadyResolved: {mine: 0, theirs: 1, resolution: 1},
        stillConflicted: {mine: 0, theirs: 1, resolution: 0},
      },
    }), {
      ...BASE_DEPENDENCY,
      alias: 'mine',
      target: theirs.target,
      config: {
        ...BASE_CONFIG,
        alreadyResolved: 1,
        stillConflicted: 0,
      },
      backendTemplates: theirs.backendTemplates,
    })
  })

  it('Resolves the backendTemplates to match mine if my target was chosen', () => {
    const mine = {
      ...BASE_DEPENDENCY,
      target: {type: 'branch', branch: 'my-branch'},
      backendTemplates: [BACKEND_1],
    } as const
    const theirs = {
      ...BASE_DEPENDENCY,
      target: {type: 'branch', branch: 'their-branch'},
      backendTemplates: [BACKEND_2],
    } as const

    assert.deepStrictEqual(resolveDependencyConflicts({
      ...BASE_DETAILS,
      mine,
      theirs,
      conflictedAlias: {
        mine: 'mine',
        theirs: 'theirs',
        resolution: 'mine',
      },
      conflictedTarget: {
        mine: mine.target,
        theirs: theirs.target,
        resolution: mine.target,
      },
      conflictedConfigEntries: {
        alreadyResolved: {mine: 0, theirs: 1, resolution: 1},
        stillConflicted: {mine: 0, theirs: 1, resolution: 0},
      },
    }), {
      ...BASE_DEPENDENCY,
      alias: 'mine',
      target: mine.target,
      config: {
        ...BASE_CONFIG,
        alreadyResolved: 1,
        stillConflicted: 0,
      },
      backendTemplates: mine.backendTemplates,
    })
  })

  it('Resolves backendTemplates to undefined my target with no backends was chosen', () => {
    const mine = {
      ...BASE_DEPENDENCY,
      target: {type: 'branch', branch: 'my-branch'},
    } as const
    const theirs = {
      ...BASE_DEPENDENCY,
      target: {type: 'branch', branch: 'their-branch'},
      backendTemplates: [BACKEND_2],
    } as const

    assert.deepStrictEqual(resolveDependencyConflicts({
      ...BASE_DETAILS,
      mine,
      theirs,
      conflictedAlias: {
        mine: 'mine',
        theirs: 'theirs',
        resolution: 'mine',
      },
      conflictedTarget: {
        mine: mine.target,
        theirs: theirs.target,
        resolution: mine.target,
      },
      conflictedConfigEntries: {
        alreadyResolved: {mine: 0, theirs: 1, resolution: 1},
        stillConflicted: {mine: 0, theirs: 1, resolution: 0},
      },
    }), {
      ...BASE_DEPENDENCY,
      alias: 'mine',
      target: mine.target,
      config: {
        ...BASE_CONFIG,
        alreadyResolved: 1,
        stillConflicted: 0,
      },
    })
  })
})

describe('generateDependencyConflictDetails', () => {
  it('Returns no conflicts for equivalent dependencies', () => {
    const details = generateDependencyConflictDetails(
      BASE_DEPENDENCY, BASE_DEPENDENCY, BASE_DEPENDENCY
    )
    assert.deepStrictEqual(details, {
      mine: BASE_DEPENDENCY,
      theirs: BASE_DEPENDENCY,
      conflictedAlias: null,
      conflictedTarget: null,
      conflictedConfigEntries: {},
      conflictedBackendSlotValues: {},
      dependencyWithoutConflicts: BASE_DEPENDENCY,
      symbolForIndecision: details.symbolForIndecision,
    })
  })

  it('Returns conflict if I changed alias', () => {
    const yours = {...BASE_DEPENDENCY, alias: 'new-alias'}

    const details = generateDependencyConflictDetails(
      yours,
      BASE_DEPENDENCY,
      BASE_DEPENDENCY
    )

    const expectedDependencyWithoutConflicts = {...BASE_DEPENDENCY}
    delete expectedDependencyWithoutConflicts.alias

    assert.deepStrictEqual(details, {
      mine: yours,
      theirs: BASE_DEPENDENCY,
      conflictedAlias: {
        mine: 'new-alias',
        theirs: BASE_DEPENDENCY.alias,
        resolution: details.symbolForIndecision,
      },
      conflictedTarget: null,
      conflictedConfigEntries: {},
      conflictedBackendSlotValues: {},
      dependencyWithoutConflicts: expectedDependencyWithoutConflicts,
      symbolForIndecision: details.symbolForIndecision,
    })
  })

  it('Returns conflict if they changed alias', () => {
    const theirs = {...BASE_DEPENDENCY, alias: 'new-alias'}

    const details = generateDependencyConflictDetails(
      BASE_DEPENDENCY,
      theirs,
      BASE_DEPENDENCY
    )

    const expectedDependencyWithoutConflicts = {...BASE_DEPENDENCY}
    delete expectedDependencyWithoutConflicts.alias

    assert.deepStrictEqual(details, {
      mine: BASE_DEPENDENCY,
      theirs,
      conflictedAlias: {
        mine: BASE_DEPENDENCY.alias,
        theirs: 'new-alias',
        resolution: details.symbolForIndecision,
      },
      conflictedTarget: null,
      conflictedConfigEntries: {},
      conflictedBackendSlotValues: {},
      dependencyWithoutConflicts: expectedDependencyWithoutConflicts,
      symbolForIndecision: details.symbolForIndecision,
    })
  })

  it('Returns conflict if I changed target', () => {
    const yours = {...BASE_DEPENDENCY, target: {type: 'branch', branch: 'new-branch'}} as const

    const details = generateDependencyConflictDetails(
      yours,
      BASE_DEPENDENCY,
      BASE_DEPENDENCY
    )

    const expectedDependencyWithoutConflicts = {...BASE_DEPENDENCY}
    delete expectedDependencyWithoutConflicts.target

    assert.deepStrictEqual(details, {
      mine: yours,
      theirs: BASE_DEPENDENCY,
      conflictedAlias: null,
      conflictedTarget: {
        mine: {type: 'branch', branch: 'new-branch'},
        theirs: BASE_DEPENDENCY.target,
        resolution: details.symbolForIndecision,
      },
      conflictedConfigEntries: {},
      conflictedBackendSlotValues: {},
      dependencyWithoutConflicts: expectedDependencyWithoutConflicts,
      symbolForIndecision: details.symbolForIndecision,
    })
  })

  it('Returns conflict if they changed target', () => {
    const theirs = {...BASE_DEPENDENCY, target: {type: 'branch', branch: 'new-branch'}} as const

    const details = generateDependencyConflictDetails(
      BASE_DEPENDENCY,
      theirs,
      BASE_DEPENDENCY
    )

    const expectedDependencyWithoutConflicts = {...BASE_DEPENDENCY}
    delete expectedDependencyWithoutConflicts.target

    assert.deepStrictEqual(details, {
      mine: BASE_DEPENDENCY,
      theirs,
      conflictedAlias: null,
      conflictedTarget: {
        mine: BASE_DEPENDENCY.target,
        theirs: {type: 'branch', branch: 'new-branch'},
        resolution: details.symbolForIndecision,
      },
      conflictedConfigEntries: {},
      conflictedBackendSlotValues: {},
      dependencyWithoutConflicts: expectedDependencyWithoutConflicts,
      symbolForIndecision: details.symbolForIndecision,
    })
  })

  it('Returns merged state if I added config', () => {
    const yours = {...BASE_DEPENDENCY, config: {...BASE_CONFIG, newValue: 1}} as const

    const details = generateDependencyConflictDetails(
      yours,
      BASE_DEPENDENCY,
      BASE_DEPENDENCY
    )

    assert.deepStrictEqual(details, {
      mine: yours,
      theirs: BASE_DEPENDENCY,
      conflictedAlias: null,
      conflictedTarget: null,
      conflictedConfigEntries: {},
      conflictedBackendSlotValues: {},
      dependencyWithoutConflicts: yours,
      symbolForIndecision: details.symbolForIndecision,
    })
  })

  it('Returns merged state if they added config', () => {
    const theirs = {...BASE_DEPENDENCY, config: {...BASE_CONFIG, newValue: 1}} as const

    const details = generateDependencyConflictDetails(
      BASE_DEPENDENCY,
      theirs,
      BASE_DEPENDENCY
    )

    assert.deepStrictEqual(details, {
      mine: BASE_DEPENDENCY,
      theirs,
      conflictedAlias: null,
      conflictedTarget: null,
      conflictedConfigEntries: {},
      conflictedBackendSlotValues: {},
      dependencyWithoutConflicts: theirs,
      symbolForIndecision: details.symbolForIndecision,
    })
  })

  it('Returns merged state if we both added config', () => {
    const mine = {...BASE_DEPENDENCY, config: {...BASE_CONFIG, v1: 1, v2: 2}} as const
    const theirs = {...BASE_DEPENDENCY, config: {...BASE_CONFIG, v1: 1}} as const

    const details = generateDependencyConflictDetails(
      mine,
      theirs,
      BASE_DEPENDENCY
    )

    assert.deepStrictEqual(details, {
      mine,
      theirs,
      conflictedAlias: null,
      conflictedTarget: null,
      conflictedConfigEntries: {},
      conflictedBackendSlotValues: {},
      dependencyWithoutConflicts: mine,
      symbolForIndecision: details.symbolForIndecision,
    })
  })

  it('Returns conflict if config changes differ', () => {
    const mine = {...BASE_DEPENDENCY, config: {...BASE_CONFIG, v1: 1, v2: 2}} as const
    const theirs = {...BASE_DEPENDENCY, config: {...BASE_CONFIG, v1: 2}} as const

    const details = generateDependencyConflictDetails(
      mine,
      theirs,
      BASE_DEPENDENCY
    )

    assert.deepStrictEqual(details, {
      mine,
      theirs,
      conflictedAlias: null,
      conflictedTarget: null,
      conflictedConfigEntries: {
        v1: {
          mine: 1,
          theirs: 2,
          resolution: details.symbolForIndecision,
        },
      },
      conflictedBackendSlotValues: {},
      dependencyWithoutConflicts: {
        ...BASE_DEPENDENCY,
        config: {
          ...BASE_CONFIG,
          v2: 2,  // v2 was added separately so it can be added directly
        },
      },
      symbolForIndecision: details.symbolForIndecision,
    })
  })

  it('Returns merged state if I added slot value', () => {
    const yours = {
      ...BASE_DEPENDENCY,
      backendSlotValues: {
        ...BASE_BACKEND_SLOT_VALUES,
        slot3: LITERAL_2,
      },
    } as const

    const details = generateDependencyConflictDetails(
      yours,
      BASE_DEPENDENCY,
      BASE_DEPENDENCY
    )

    assert.deepStrictEqual(details, {
      mine: yours,
      theirs: BASE_DEPENDENCY,
      conflictedAlias: null,
      conflictedTarget: null,
      conflictedConfigEntries: {},
      conflictedBackendSlotValues: {},
      dependencyWithoutConflicts: yours,
      symbolForIndecision: details.symbolForIndecision,
    })
  })

  it('Returns merged state if they added slot value', () => {
    const theirs = {
      ...BASE_DEPENDENCY,
      backendSlotValues: {
        ...BASE_BACKEND_SLOT_VALUES,
        slot3: LITERAL_2,
      },
    } as const

    const details = generateDependencyConflictDetails(
      BASE_DEPENDENCY,
      theirs,
      BASE_DEPENDENCY
    )

    assert.deepStrictEqual(details, {
      mine: BASE_DEPENDENCY,
      theirs,
      conflictedAlias: null,
      conflictedTarget: null,
      conflictedConfigEntries: {},
      conflictedBackendSlotValues: {},
      dependencyWithoutConflicts: theirs,
      symbolForIndecision: details.symbolForIndecision,
    })
  })

  it('Returns merged state if we both added slot value', () => {
    const mine = {
      ...BASE_DEPENDENCY,
      backendSlotValues: {
        ...BASE_BACKEND_SLOT_VALUES,
        slot3: LITERAL_1,
        slot4: SECRET_2,
      },
    } as const

    const theirs = {
      ...BASE_DEPENDENCY,
      backendSlotValues: {
        ...BASE_BACKEND_SLOT_VALUES,
        slot3: LITERAL_1,
      },
    } as const

    const details = generateDependencyConflictDetails(
      mine,
      theirs,
      BASE_DEPENDENCY
    )

    assert.deepStrictEqual(details, {
      mine,
      theirs,
      conflictedAlias: null,
      conflictedTarget: null,
      conflictedConfigEntries: {},
      conflictedBackendSlotValues: {},
      dependencyWithoutConflicts: mine,
      symbolForIndecision: details.symbolForIndecision,
    })
  })

  it('Returns conflict if slot value changes differ', () => {
    const mine = {
      ...BASE_DEPENDENCY,
      backendSlotValues: {
        ...BASE_BACKEND_SLOT_VALUES,
        slot3: LITERAL_1,
        slot4: SECRET_1,
      },
    } as const

    const theirs = {
      ...BASE_DEPENDENCY,
      backendSlotValues: {
        ...BASE_BACKEND_SLOT_VALUES,
        slot3: LITERAL_2,
      },
    } as const

    const details = generateDependencyConflictDetails(
      mine,
      theirs,
      BASE_DEPENDENCY
    )

    assert.deepStrictEqual(details, {
      mine,
      theirs,
      conflictedAlias: null,
      conflictedTarget: null,
      conflictedConfigEntries: {},
      conflictedBackendSlotValues: {
        slot3: {
          mine: LITERAL_1,
          theirs: LITERAL_2,
          resolution: details.symbolForIndecision,
        },
      },
      dependencyWithoutConflicts: {
        ...BASE_DEPENDENCY,
        backendSlotValues: {
          ...BASE_BACKEND_SLOT_VALUES,
          slot4: SECRET_1,  // slot4 was added separately so it can be added directly
        },
      },
      symbolForIndecision: details.symbolForIndecision,
    })
  })
})
