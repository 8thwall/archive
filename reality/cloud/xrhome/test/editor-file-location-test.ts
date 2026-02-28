import {describe, it} from 'mocha'
import {assert} from 'chai'

import {
  deriveEditorRouteParams,
  EditorFileLocation,
  editorFileLocationEqual, extractFilePath, extractRepoId, extractScopedLocation,
  extractTopLevelPath,
  deriveLocationKey,
  resolveEditorFileLocation,
  stripPrimaryRepoId,
  deriveLocationFromKey,
  deriveEditableLocationFromKey,
} from '../src/client/editor/editor-file-location'
import type {IMultiRepoContext} from '../src/client/editor/multi-repo-context'
import type {EditorRouteParams} from '../src/client/editor/editor-route'
import type {IDependencyContext} from '../src/client/editor/dependency-context'

describe('extractFilePath', () => {
  it('Returns path directly for unscoped location', () => {
    assert.strictEqual(extractFilePath('my/path.ts'), 'my/path.ts')
  })
  it('Returns path for scoped location', () => {
    assert.strictEqual(extractFilePath({filePath: 'my/path.ts'}), 'my/path.ts')
  })
  it('Returns empty string for missing locations', () => {
    assert.strictEqual(extractFilePath(''), '')
    assert.strictEqual(extractFilePath({filePath: ''}), '')
    assert.strictEqual(extractFilePath(null), '')
  })
})

describe('extractRepoId', () => {
  it('Returns null for unscoped', () => {
    assert.strictEqual(extractRepoId('my/path.ts'), null)
  })
  it('Returns repo ID for scoped location with repo ID', () => {
    assert.strictEqual(extractRepoId({filePath: 'my/path.ts', repoId: 'my-repo-id'}), 'my-repo-id')
  })
  it('Returns null for scoped location without repo ID', () => {
    assert.strictEqual(extractRepoId({filePath: 'my/path.ts'}), null)
  })
  it('Returns null for missing repo ID', () => {
    assert.strictEqual(extractRepoId({filePath: 'my-file.ts'}), null)
    assert.strictEqual(extractRepoId('my-file.ts'), null)
    assert.strictEqual(extractRepoId(null), null)
  })
})

describe('editorFileLocationEqual', () => {
  it('Returns true for equal locations', () => {
    assert.isTrue(editorFileLocationEqual('my/path.ts', 'my/path.ts'))
  })
  it('Returns true for falsy locations', () => {
    assert.isTrue(editorFileLocationEqual('', null))
  })
  it('Returns true for equal scoped locations', () => {
    assert.isTrue(editorFileLocationEqual({filePath: 'my/path.ts'}, {filePath: 'my/path.ts'}))
  })
  it('Returns true for a scoped an unscoped location whe the scoped location is falsy', () => {
    assert.isTrue(editorFileLocationEqual('my/path.ts', {filePath: 'my/path.ts', repoId: null}))
  })
  it('Returns true for equal scoped locations with falsy repoIds', () => {
    assert.isTrue(editorFileLocationEqual(
      {filePath: 'my/path.ts', repoId: null},
      {filePath: 'my/path.ts'}
    ))
  })
  it('Returns true for falsy scoped locations', () => {
    assert.isTrue(editorFileLocationEqual({filePath: ''}, {filePath: null}))
    assert.isTrue(editorFileLocationEqual('', null))
  })
  it('Returns false for different file paths', () => {
    assert.isFalse(editorFileLocationEqual(
      {filePath: 'other/path.ts', repoId: null},
      {filePath: 'my/path.ts'}
    ))
    assert.isFalse(editorFileLocationEqual(
      'other/path.ts',
      {filePath: 'my/path.ts'}
    ))
  })
  it('Returns false for the same file in different scoped locations', () => {
    assert.isFalse(editorFileLocationEqual(
      'my/path.ts',
      {filePath: 'my/path.ts', repoId: 'my-repo-id'}
    ))
    assert.isFalse(editorFileLocationEqual(
      {filePath: 'my/path.ts', repoId: 'my-repo-id'},
      {filePath: 'my/path.ts'}
    ))
  })
})

describe('resolveEditorFileLocation', () => {
  it('Returns path directly for unscoped location', () => {
    assert.strictEqual(resolveEditorFileLocation('my/path.ts'), 'my/path.ts')
  })
  it('Returns empty path for undefined path', () => {
    assert.strictEqual(resolveEditorFileLocation(undefined, {} as any, {} as any), '')
  })
  it('Uses contexts to resolve scoped location', () => {
    const multiRepoContext: IMultiRepoContext = {
      primaryRepoId: 'my-repo-id',
      subRepoIds: new Set(),
      openDependencies: {dependency1: 'my-module-repo-id'},
      repoIdToDependencyId: {},
      repoIdToTitle: {},
    }

    const dependencyContext: IDependencyContext = {
      moduleIdToAlias: {},
      dependenciesByPath: {'.dependencies/dep.json': {dependencyId: 'dependency1'} as any},
      targetOverrides: {},
      dependencyIdToPath: {},
      aliasToPath: {'my-module': '.dependencies/dep.json'},
    }

    const params: EditorRouteParams = {
      moduleAlias: 'my-module',
      filePath: 'module.js',
    }

    assert.deepEqual(resolveEditorFileLocation(params, multiRepoContext, dependencyContext), {
      filePath: 'module.js',
      repoId: 'my-module-repo-id',
    })
  })
  it('Returns empty string if referenced alias is not open locally', () => {
    const multiRepoContext: IMultiRepoContext = {
      primaryRepoId: 'my-repo-id',
      subRepoIds: new Set(),
      openDependencies: {dependency1: 'my-module-repo-id'},
      repoIdToDependencyId: {},
      repoIdToTitle: {},
    }

    const dependencyContext: IDependencyContext = {
      moduleIdToAlias: {},
      dependenciesByPath: {},
      targetOverrides: {},
      dependencyIdToPath: {},
      aliasToPath: {'my-module': '.dependencies/dep.json'},
    }

    const params: EditorRouteParams = {
      moduleAlias: 'my-non-existent-module',
      filePath: 'module.js',
    }

    assert.deepEqual(resolveEditorFileLocation(params, multiRepoContext, dependencyContext), '')
  })
  it('Appends backend file extension for backend config paths', () => {
    const multiRepoContext: IMultiRepoContext = {
      primaryRepoId: 'my-repo-id',
      subRepoIds: new Set(),
      openDependencies: {dependency1: 'my-module-repo-id'},
      repoIdToDependencyId: {},
      repoIdToTitle: {},
    }

    const dependencyContext: IDependencyContext = {
      moduleIdToAlias: {},
      dependenciesByPath: {'.dependencies/dep.json': {dependencyId: 'dependency1'} as any},
      targetOverrides: {},
      dependencyIdToPath: {},
      aliasToPath: {'my-module': '.dependencies/dep.json'},
    }

    const params: EditorRouteParams = {
      moduleAlias: 'my-module',
      filePath: 'backends/my-config',
    }
    assert.strictEqual(
      resolveEditorFileLocation('backends/my-test'), 'backends/my-test.backend.json'
    )
    assert.deepEqual(
      resolveEditorFileLocation(params, multiRepoContext, dependencyContext),
      {filePath: 'backends/my-config.backend.json', repoId: 'my-module-repo-id'}
    )
  })
  it('Returns path directly for standard files inside backends folder', () => {
    const multiRepoContext: IMultiRepoContext = {
      primaryRepoId: 'my-repo-id',
      subRepoIds: new Set(),
      openDependencies: {dependency1: 'my-module-repo-id'},
      repoIdToDependencyId: {},
      repoIdToTitle: {},
    }

    const dependencyContext: IDependencyContext = {
      moduleIdToAlias: {},
      dependenciesByPath: {'.dependencies/dep.json': {dependencyId: 'dependency1'} as any},
      targetOverrides: {},
      dependencyIdToPath: {},
      aliasToPath: {'my-module': '.dependencies/dep.json'},
    }

    const params: EditorRouteParams = {
      moduleAlias: 'my-module',
      filePath: 'backends/test.js',
    }
    assert.strictEqual(
      resolveEditorFileLocation('backends/path.ts'), 'backends/path.ts'
    )
    assert.deepEqual(
      resolveEditorFileLocation(params, multiRepoContext, dependencyContext),
      {filePath: 'backends/test.js', repoId: 'my-module-repo-id'}
    )
  })
})

describe('deriveEditorRouteParams', () => {
  it('Returns path directly for unscoped location', () => {
    assert.strictEqual(deriveEditorRouteParams('my/path.ts'), 'my/path.ts')
  })
  it('Uses contexts to resolve scoped location', () => {
    const multiRepoContext: IMultiRepoContext = {
      primaryRepoId: 'my-repo-id',
      subRepoIds: new Set(),
      openDependencies: {},
      repoIdToDependencyId: {'my-module-repo-id': 'dependency1'},
      repoIdToTitle: {},
    }

    const dependencyContext: IDependencyContext = {
      moduleIdToAlias: {},
      dependenciesByPath: {'.dependencies/dep.json': {alias: 'my-module'} as any},
      targetOverrides: {},
      dependencyIdToPath: {dependency1: '.dependencies/dep.json'},
      aliasToPath: {'my-module': '.dependencies/dep.json'},
    }

    const location: EditorFileLocation = {
      repoId: 'my-module-repo-id',
      filePath: 'module.js',
    }

    assert.deepEqual(deriveEditorRouteParams(location, multiRepoContext, dependencyContext), {
      filePath: 'module.js',
      moduleAlias: 'my-module',
    })
  })
  it('Resolves dependency file to module route', () => {
    const dependencyContext: IDependencyContext = {
      moduleIdToAlias: {},
      dependenciesByPath: {'.dependencies/uuid.json': {alias: 'my-module'} as any},
      targetOverrides: {},
      dependencyIdToPath: {},
      aliasToPath: {'my-module': '.dependencies/uuid.json'},
    }

    const location: EditorFileLocation = {
      filePath: '.dependencies/uuid.json',
    }

    assert.deepEqual(deriveEditorRouteParams(location, null, dependencyContext), {
      isDependencyFile: true,
      moduleAlias: 'my-module',
    })
  })
})

describe('extractScopedLocation', () => {
  it('Returns a scoped location out of an unscoped location', () => {
    assert.deepEqual(extractScopedLocation('my/path.ts'), {filePath: 'my/path.ts', repoId: null})
  })
  it('Returns scoped locations unchanged', () => {
    assert.deepEqual(
      extractScopedLocation({filePath: 'my/path.ts', repoId: 'my-repo-id'}),
      {filePath: 'my/path.ts', repoId: 'my-repo-id'}
    )
    assert.deepEqual(
      extractScopedLocation({filePath: 'my/path.ts', repoId: null}),
      {filePath: 'my/path.ts', repoId: null}
    )
  })
})

describe('extractTopLevelPath', () => {
  it('Returns the top-level path from a string', () => {
    assert.deepEqual(extractTopLevelPath('my/path.ts'), 'my/path.ts')
  })
  it('Returns null for scoped locations', () => {
    assert.deepEqual(extractTopLevelPath({filePath: 'my/path.ts', repoId: 'my-repo-id'}), '')
  })
  it('Returns the top level path if repoId is falsy', () => {
    assert.deepEqual(extractTopLevelPath({filePath: 'my/path.ts', repoId: undefined}), 'my/path.ts')
    assert.deepEqual(extractTopLevelPath({filePath: 'my/path.ts', repoId: null}), 'my/path.ts')
  })
})

describe('stripPrimaryRepoId', () => {
  it('Turns an unscoped location into scoped', () => {
    assert.deepEqual(
      stripPrimaryRepoId('my/path.ts', 'primary-repo'),
      {filePath: 'my/path.ts', repoId: null}
    )
  })
  it('Returns scoped locations unchanged', () => {
    assert.deepEqual(
      stripPrimaryRepoId({filePath: 'my/path.ts', repoId: 'my-repo-id'}, 'primary-repo'),
      {filePath: 'my/path.ts', repoId: 'my-repo-id'}
    )
    assert.deepEqual(
      stripPrimaryRepoId({filePath: 'my/path.ts', repoId: null}, 'primary-repo'),
      {filePath: 'my/path.ts', repoId: null}
    )
  })
  it('Removes primary repo from any scoped location', () => {
    assert.deepEqual(
      stripPrimaryRepoId({filePath: 'my/path.ts', repoId: 'primary-repo'}, 'primary-repo'),
      {filePath: 'my/path.ts', repoId: null}
    )
  })
})

describe('deriveLocationKey', () => {
  it('Returns a id from filePath and repoId', () => {
    assert.strictEqual(deriveLocationKey({filePath: 'my/path.ts', repoId: 'my-repo-id'}),
      '.repos/my-repo-id/my/path.ts')
  })
  it('Returns a id from filePath', () => {
    assert.strictEqual(deriveLocationKey({filePath: 'my/path.ts', repoId: null}), 'my/path.ts')
  })
  it('Returns a id from filePath string', () => {
    assert.strictEqual(deriveLocationKey('my/path.ts'), 'my/path.ts')
  })
  it('Returns empty id from null', () => {
    assert.strictEqual(deriveLocationKey(null), '')
  })
})

describe('deriveLocationFromKey', () => {
  it('Returns empty filePath if string is null/undefined', () => {
    assert.strictEqual(deriveLocationFromKey(null), '')
    assert.strictEqual(deriveLocationFromKey(undefined), '')
  })
  it('Returns a scoped location from module file key', () => {
    assert.deepEqual(deriveLocationFromKey('.repos/test.module.1a-2b-3c/path.ts'),
      {filePath: 'path.ts', repoId: 'test.module.1a-2b-3c'})
  })
  it('Returns a scoped location from module file with folders key', () => {
    assert.deepEqual(deriveLocationFromKey('.repos/test.module.1a-2b-3c/folder1/folder2/path.ts'),
      {filePath: 'folder1/folder2/path.ts', repoId: 'test.module.1a-2b-3c'})
  })
  it('Returns a basic location from project file key', () => {
    assert.strictEqual(deriveLocationFromKey('path.ts'), 'path.ts')
  })
  it('Returns a basic location from project file with folders key', () => {
    assert.strictEqual(deriveLocationFromKey('folder1/folder2/path.ts'), 'folder1/folder2/path.ts')
  })
})

describe('deriveEditableLocationFromKey', () => {
  it('Returns empty filePath if string is null/undefined', () => {
    assert.strictEqual(deriveEditableLocationFromKey(null), '')
    assert.strictEqual(deriveEditableLocationFromKey(undefined), '')
  })
  it('Returns a scoped location from module file key', () => {
    assert.deepEqual(deriveEditableLocationFromKey(
      '.repos/test.module.1a-2b-3c/path.ts'
    ),
    {filePath: 'path.ts', repoId: 'test.module.1a-2b-3c'})
  })
  it('Returns a scoped location from module file with folders key', () => {
    assert.deepEqual(deriveEditableLocationFromKey(
      '.repos/test.module.1a-2b-3c/folder1/folder2/path.ts'
    ),
    {filePath: 'folder1/folder2/path.ts', repoId: 'test.module.1a-2b-3c'})
  })
  it('Returns a basic location from project file key', () => {
    assert.strictEqual(deriveEditableLocationFromKey('path.ts'), 'path.ts')
  })
  it('Returns a basic location from project file with folders key', () => {
    assert.strictEqual(deriveEditableLocationFromKey(
      'folder1/folder2/path.ts'
    ), 'folder1/folder2/path.ts')
  })
  it('Returns the manifest location for a config key', () => {
    assert.deepEqual(
      deriveEditableLocationFromKey('node_modules/config.ts'),
      'manifest.json'
    )
  })

  const myDeps: IDependencyContext = {
    moduleIdToAlias: undefined,
    dependenciesByPath: undefined,
    targetOverrides: undefined,
    dependencyIdToPath: {'dep-id-1': '.dependencies/my-dep-file.json'},
    aliasToPath: {'my-module': 'dep-id-1'},
  }

  const myRepos: IMultiRepoContext = {
    primaryRepoId: 'my-primary-repo',
    subRepoIds: undefined,
    openDependencies: undefined,
    repoIdToDependencyId: {'module-repo': 'dep-id-1'},
    repoIdToTitle: undefined,
  }

  it('Returns the dependency location for a module in-context config', () => {
    assert.strictEqual(
      deriveEditableLocationFromKey('.repos/module-repo/node_modules/config.ts', myDeps, myRepos),
      '.dependencies/my-dep-file.json'
    )
  })
})
