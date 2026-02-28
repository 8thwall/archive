import React from 'react'
import {useTranslation} from 'react-i18next'
import {Icon} from 'semantic-ui-react'

import {SortableContainer} from 'react-sortable-hoc'

import useActions from '../../common/use-actions'
import coreGitActions from '../../git/core-git-actions'
import type {IGitFile} from '../../git/g8-dto'
import {useScopedGit} from '../../git/hooks/use-current-git'
import {FieldBuilder} from './field-builder'
import {MANIFEST_FILE_PATH} from '../../common/editor-files'
import {
  configBuilderReducer, fileChangeAction, patchFieldAction, saveStartAction,
  newFieldAction, deleteFieldAction, initConfigState, newGroupAction, patchGroupAction,
  deleteGroupAction,
  captureUngroupedAction,
  sortGroupAction,
  sortFieldAction,
  moveFieldAction,
} from './module-config-builder-reducer'
import type {ModuleManifest} from '../../../shared/module/module-manifest'
import type {ModuleConfigField, ModuleConfigFieldPatch} from '../../../shared/module/module-config'
import AutoHeadingScope from '../../widgets/auto-heading-scope'
import AutoHeading from '../../widgets/auto-heading'
import {deriveConfigGrouping} from './derive-config-grouping'
import {BuilderGroup, SortableBuilderGroup} from './builder-group'
import {NewFieldForm} from './new-field-form'
import {createThemedStyles} from '../../ui/theme'
import {SortableBuilder} from './builder'
import {TertiaryButton} from '../../ui/components/tertiary-button'
import {useCurrentRepoId} from '../../git/repo-id-context'

const useStyles = createThemedStyles(theme => ({
  container: {
    position: 'relative',
    marginTop: '1rem',
    padding: '1rem',
    color: theme.fgMain,
    flex: '2 0 0',
    overflow: 'auto',
  },
  groupSection: {
    margin: '1rem 0rem',
  },
  newParameter: {
    'border': '0',
    'background': 'transparent',
    'cursor': 'pointer',
    'fontFamily': 'inherit',
    'fontSize': '14px',
    'fontWeight': '400',
    'color': theme.fgBlue,
    'padding': 0,
    '&:disabled': {
      'color': theme.controlInactive,
    },
  },
  dragged: {
    zIndex: 100,
    opacity: 0.8,
  },
}))

const SortableContainerWrapper = SortableContainer(({children}) => <div>{children}</div>)

const ModuleConfigBuilder: React.FC<{}> = () => {
  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages'])
  const {transformFile} = useActions(coreGitActions)

  const repoId = useCurrentRepoId()
  const git = useScopedGit(repoId)
  const fileContent = git.filesByPath[MANIFEST_FILE_PATH]?.content

  const [configState, dispatch] = React.useReducer(
    configBuilderReducer, fileContent, initConfigState
  )

  const [newFieldTargetGroup, setNewFieldTargetGroup] = React.useState<string>(null)

  const hasChanges = configState.needsSave

  React.useEffect(() => {
    dispatch(fileChangeAction(fileContent))
  }, [fileContent])

  React.useEffect(() => {
    if (!hasChanges) {
      return undefined
    }

    const timeout = setTimeout(async () => {
      await transformFile(git?.repo, MANIFEST_FILE_PATH, (file: IGitFile) => {
        const manifest = JSON.parse(file.content) as ModuleManifest
        manifest.config = configState.config
        const newContent = JSON.stringify(manifest, null, 2)
        dispatch(saveStartAction(newContent))
        return newContent
      })
    }, 1000)

    return () => {
      clearTimeout(timeout)
    }
  }, [transformFile, hasChanges, configState])

  const groups = deriveConfigGrouping(configState.config)

  // NOTE(christoph): If the user syncs or changes clients while adding a param, if the group is
  // no longer visible, the buttons needs to be enabled again.
  const newFieldVisible = groups.some(g => g.groupId === newFieldTargetGroup)

  const onSortEnd = ({oldIndex, newIndex}) => {
    if (oldIndex === newIndex) {
      return
    }

    const beforeIndex = oldIndex > newIndex ? newIndex - 1 : newIndex
    const afterIndex = oldIndex > newIndex ? newIndex : newIndex + 1
    const {groupId} = groups[oldIndex]
    const beforeId = groups[beforeIndex]?.groupId
    const afterId = groups[afterIndex]?.groupId

    dispatch(sortGroupAction(groupId, beforeId, afterId))
  }

  const onFieldSortEnd = (oldIndex: number, newIndex: number, fields: ModuleConfigField[]) => {
    if (oldIndex === newIndex) {
      return
    }
    const beforeIndex = oldIndex > newIndex ? newIndex - 1 : newIndex
    const afterIndex = oldIndex > newIndex ? newIndex : newIndex + 1
    const {fieldName} = fields[oldIndex]
    const beforeFieldName = fields[beforeIndex]?.fieldName
    const afterFieldName = fields[afterIndex]?.fieldName

    dispatch(sortFieldAction(fieldName, beforeFieldName, afterFieldName))
  }

  return (
    <div className={classes.container}>
      <AutoHeadingScope level={2}>
        <AutoHeading>{t('module_config.module_config_builder.config_builder')}</AutoHeading>
        <TertiaryButton
          height='small'
          onClick={() => dispatch(newGroupAction({name: 'Untitled Group'}))}
        >
          {t('module_config.module_config_builder.new_config_group')}
        </TertiaryButton>
        <SortableContainerWrapper
          useDragHandle
          onSortEnd={onSortEnd}
          helperClass={classes.dragged}
        >
          {groups.map((group, i) => {
            const GroupComponent = group.isDefault ? BuilderGroup : SortableBuilderGroup

            return (
              <GroupComponent
                key={group.groupId}
                index={i}
                isDefault={group.isDefault}
                name={group.name}
                onRename={(newName) => {
                  if (group.isDefault) {
                    dispatch(captureUngroupedAction(newName))
                  } else {
                    dispatch(patchGroupAction(group.groupId, {name: newName}))
                  }
                }}
                canDelete={!group.isDefault && group.fields.length === 0}
                onDelete={() => {
                  dispatch(deleteGroupAction(group.groupId))
                }}
              >
                <div className={classes.groupSection}>
                  <SortableContainerWrapper
                    useDragHandle
                    key={group.groupId}
                    helperClass={classes.dragged}
                    onSortEnd={({oldIndex, newIndex}) => onFieldSortEnd(
                      oldIndex, newIndex, group.fields
                    )}
                  >
                    {group.fields.map((field, j) => (
                      <SortableBuilder
                        index={j}
                        key={field.fieldName}
                        name={field.fieldName}
                        onDelete={() => dispatch(deleteFieldAction(field.fieldName))}
                        onMove={(fieldName, groupId) => {
                          dispatch(moveFieldAction(fieldName, groupId))
                        }}
                        otherGroups={groups.filter(g => g.groupId !== group.groupId)}
                      >
                        <FieldBuilder
                          key={field.fieldName}
                          fieldName={field.fieldName}
                          field={field}
                          onUpdate={(e: ModuleConfigFieldPatch) => {
                            dispatch(patchFieldAction(field.fieldName, e))
                          }}
                        />
                      </SortableBuilder>
                    ))}
                  </SortableContainerWrapper>
                  {newFieldTargetGroup === group.groupId &&
                    <NewFieldForm
                      currentConfig={configState.config}
                      onCancel={() => setNewFieldTargetGroup(null)}
                      onSubmit={(newField) => {
                        dispatch(newFieldAction({
                          ...newField,
                          groupId: group.isDefault ? undefined : newFieldTargetGroup,
                        }))
                        setNewFieldTargetGroup(null)
                      }}
                    />
                  }
                  <button
                    type='button'
                    className={classes.newParameter}
                    onClick={() => setNewFieldTargetGroup(group.groupId)}
                    disabled={!!newFieldTargetGroup && newFieldVisible}
                  >
                    <Icon name='plus' />{t('module_config.module_config_builder.new_parameter')}
                  </button>
                </div>
              </GroupComponent>
            )
          })}
        </SortableContainerWrapper>
      </AutoHeadingScope>
    </div>
  )
}

export {
  ModuleConfigBuilder,
}
