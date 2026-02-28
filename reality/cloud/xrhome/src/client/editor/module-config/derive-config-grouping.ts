import type {
  ModuleConfig, ModuleConfigField, ModuleConfigGroup,
} from '../../../shared/module/module-config'

type DerivedGroup = ModuleConfigGroup & {
  fields: ModuleConfigField[]
  isDefault?: boolean
}

const compareGroups = (a: ModuleConfigGroup, b: ModuleConfigGroup) => a.order - b.order

const compareFields = (a: ModuleConfigField, b: ModuleConfigField) => {
  if (a.order === b.order) {
    return a.fieldName.localeCompare(b.fieldName)
  }

  const aHasOrder = typeof a.order === 'number'
  const bHasOrder = typeof b.order === 'number'

  if (aHasOrder && bHasOrder) {
    return a.order - b.order
  } else if (aHasOrder) {
    return -1
  } else {
    return 1
  }
}

const makeDefaultGroup = (fields: ModuleConfigField[]): DerivedGroup => ({
  groupId: '[DEFAULT]',
  name: 'New Group',
  fields,
  isDefault: true,
})

const makeDefaultGrouping = (fields: ModuleConfigField[]) => ([makeDefaultGroup(fields)])

const deriveConfigGrouping = (declaration: ModuleConfig): DerivedGroup[] => {
  if (!declaration || !declaration.fields) {
    return makeDefaultGrouping([])
  }
  if (!declaration.groups) {
    return makeDefaultGrouping(Object.values(declaration.fields).sort(compareFields))
  }

  const ungroupedFields: ModuleConfigField[] = []

  const groupsById: Record<string, DerivedGroup> = {}
  Object.values(declaration.groups).forEach((group) => {
    groupsById[group.groupId] = {...group, fields: []}
  })

  Object.values(declaration.fields).forEach((field) => {
    const group = field.groupId && groupsById[field.groupId]
    if (group) {
      group.fields.push(field)
    } else {
      ungroupedFields.push(field)
    }
  })

  const groups = Object.values(groupsById).sort(compareGroups)
  groups.forEach((group) => {
    group.fields.sort(compareFields)
  })
  if (ungroupedFields.length || groups.length === 0) {
    groups.unshift(makeDefaultGroup(ungroupedFields.sort(compareFields)))
  }
  return groups
}

export {
  DerivedGroup,
  deriveConfigGrouping,
}
