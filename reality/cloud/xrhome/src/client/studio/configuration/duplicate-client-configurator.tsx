import React from 'react'
import {useTranslation} from 'react-i18next'

import {createThemedStyles} from '../../ui/theme'
import {SearchBar} from '../ui/search-bar'
import type {IG8Client} from '../../git/g8-dto'
import {combine} from '../../common/styles'
import {Loader} from '../../ui/components/loader'
import useActions from '../../common/use-actions'
import coreGitActions from '../../git/core-git-actions'
import {useCurrentGit, useGitClients, useGitRemoteClients} from '../../git/hooks/use-current-git'
import {FloatingMenuButton} from '../../ui/components/floating-menu-button'
import {IconButton} from '../../ui/components/icon-button'
import {NewClientConfigurator} from './new-client-configurator'

const NAME_MATCH_SEARCH_REGEX = /_(\d+)$/

const cleanClientName = (clientName: string) => clientName.replace(/-/g, '_')
  .replace('origin/', '')

/**
 * Converts a date to a human-readable relative time string
 * @param date - A date to convert to relative time string
 * @returns Relative time string like '24m', '3h', '1d'
 */
const getRelativeTimeString = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()

  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d`
  if (hours > 0) return `${hours}h`
  if (minutes > 0) return `${minutes}m`
  return `${seconds}s`
}

const parseBranchName = (remoteBranchName: string): [string, string] | null => {
  const clientName =
    remoteBranchName.startsWith('origin/') ? remoteBranchName.substring(7) : remoteBranchName
  const parts = clientName.split('-')
  if (parts.length !== 2 && parts.length !== 3) {
    return null
  }

  return [parts.slice(0, -1).join('-'), clientName]
}

const useStyles = createThemedStyles(theme => ({
  clientButton: {
    'position': 'relative',
    'display': 'flex',
  },
  clientButtonHover: {
    '&:hover': {
      'backgroundColor': theme.studioBtnHoverBg,
      'borderRadius': '0.25em',
    },
  },
  menuButton: {
    'display': 'flex',
    'justifyContent': 'space-between',
    'alignItems': 'center',
    'width': '100%',
    'wordBreak': 'break-word',
    '& svg': {
      'minWidth': '16px',
      'color': theme.fgMuted,
      '&:hover': {
        color: theme.fgMain,
      },
    },
  },
  clientItemButton: {
    maxWidth: '150px',
    gap: '0.5em',
  },
  horizontalDivider: {
    'color': theme.sfcHighlight,
    'borderBottom': theme.studioSectionBorder,
  },
  searchBarContainer: {
    'display': 'flex',
    'paddingBottom': '0.25rem',
    '& input': {
      width: '0.75rem',
      paddingRight: '0.5rem',
    },
  },
  searchContentHeaderContainer: {
    'display': 'flex',
    'flexDirection': 'row',
    'fontSize': '12px',
    'gap': '0.5rem',
    'color': theme.sfcHighlight,
    'marginBottom': '4px',
    '& label': {
      'display': 'flex',
      'width': '100%',
      'justifyContent': 'center',
      'alignItems': 'center',
      'userSelect': 'none',
    },
    'minWidth': '150px',
  },
  searchContainerBackBtn: {
    'position': 'absolute',
    '& svg': {
      'width': '0.75rem',
      'height': '0.75rem',
    },
    '&:hover': {
      color: theme.fgMain,
    },
  },
  clientItemTimestamp: {
    color: theme.fgMuted,
    textAlign: 'right',
  },
  disabled: {
    'color': theme.fgDisabled,
    '&:hover': {
      'color': theme.fgDisabled,
    },
  },
  loadingContainer: {
    position: 'relative',
    width: '100%',
    height: '16px',
  },
}))

interface IClientButton extends Pick<IClientSection,
  'transformClientName' | 'onDuplicate' | 'onNaming' | 'onNamingCancel' | 'disabled'
> {
  selectedClient: IG8Client
  allClientNames: string[]
}

const ClientButton: React.FC<IClientButton> = ({
  selectedClient, allClientNames, disabled, transformClientName, onDuplicate, onNaming,
  onNamingCancel,
}) => {
  const {t} = useTranslation(['cloud-studio-pages'])
  const classes = useStyles()

  const [isNaming, setIsNaming] = React.useState(false)

  const clientName = transformClientName(selectedClient.name)
  if (!clientName) {
    return null
  }

  const handleClick = () => {
    setIsNaming(true)
    onNaming()
  }

  let newClientName = `${clientName}_copy`
  if (isNaming && allClientNames.find(client => client === newClientName)) {
    const existingNumbers = allClientNames.map((c) => {
      const match = c.match(NAME_MATCH_SEARCH_REGEX)
      return match ? parseInt(match[1], 10) : 0
    })

    const nextNumber = existingNumbers.length ? Math.max(...existingNumbers) + 1 : 1
    newClientName = `${newClientName}_${nextNumber}`
  }

  return isNaming
    ? (
      <NewClientConfigurator
        label={t('source_control_configurator.duplicate_client.label')}
        submitButtonLabel={t('source_control_configurator.duplicate_client.button')}
        clients={new Set(allClientNames)}
        divider={false}
        prefill={newClientName}
        disabled={disabled}
        onSave={(name) => {
          onDuplicate(selectedClient, name)
          setIsNaming(false)
        }}
        onCancel={() => {
          setIsNaming(false)
          onNamingCancel()
        }}
      />
    )
    : (
      <div className={combine(classes.clientButton, !disabled && classes.clientButtonHover)}>
        <FloatingMenuButton onClick={handleClick} isDisabled={disabled}>
          <div className={combine(classes.menuButton, classes.clientItemButton)}>
            {clientName}
            <div
              className={combine(
                classes.clientItemTimestamp, disabled && classes.disabled
              )}
            >
              {t('source_control_configurator.duplicate_client.client_relative_time', {
                time: getRelativeTimeString(selectedClient.lastSaveTime),
              })}
            </div>
          </div>
        </FloatingMenuButton>
      </div>
    )
}

interface IClientSection {
  title: string
  clientList: IG8Client[]
  onDuplicate: (client: IG8Client, newClientName: string) => void
  isHeader?: boolean
  isLoading?: boolean
  disabled?: boolean
  headerDisabled?: boolean
  transformClientName?: (clientName: string) => string | null
  returnToMainMenu: () => void
  onNaming: () => void
  onNamingCancel: () => void
}

const ClientSection: React.FC<IClientSection> = ({
  title,
  clientList,
  isHeader,
  isLoading,
  disabled,
  headerDisabled,
  transformClientName = clientName => clientName,
  onDuplicate,
  onNaming,
  onNamingCancel,
  returnToMainMenu,
}) => {
  const classes = useStyles()
  const userGitClients = useGitClients()

  const [selectedClient, setSelectedClient] = React.useState<IG8Client | null>(null)

  const allClientNames = userGitClients.map(client => cleanClientName(client.name))
  const sortedClients = clientList.sort(
    (a, b) => new Date(b.lastSaveTime).getTime() - new Date(a.lastSaveTime).getTime()
  )

  return (
    <>
      <div
        className={combine(
          classes.searchContentHeaderContainer, isHeader && classes.horizontalDivider
        )}
      >
        {isHeader && (
          <div
            className={combine(
              classes.searchContainerBackBtn, headerDisabled && classes.disabled
            )}
            id='duplicate-back'
          >
            <IconButton
              stroke='chevronLeft'
              text={title}
              onClick={() => returnToMainMenu()}
              disabled={headerDisabled}
            />
          </div>
        )}
        <label htmlFor='duplicate-back'>
          {title}
        </label>
      </div>
      {isLoading
        ? (
          <div className={classes.loadingContainer}>
            <Loader size='tiny' />
          </div>
        )
        : (
          sortedClients.map(client => (
            <ClientButton
              key={client.name}
              selectedClient={client}
              allClientNames={allClientNames}
              disabled={selectedClient ? selectedClient.name !== client.name : disabled}
              transformClientName={transformClientName}
              onDuplicate={(_, name) => {
                onDuplicate(client, name)
                setSelectedClient(null)
              }}
              onNaming={() => {
                setSelectedClient(client)
                onNaming()
              }}
              onNamingCancel={() => {
                setSelectedClient(null)
                onNamingCancel()
              }}
            />
          ))
        )}
    </>
  )
}

interface IDuplicateClientConfigurator {
  lockClient: (moveToSavingState: boolean) => void
  returnToMainMenu: () => void
}

const DuplicateClientConfigurator: React.FC<IDuplicateClientConfigurator> = ({
  lockClient, returnToMainMenu,
}) => {
  const {t} = useTranslation(['cloud-studio-pages'])
  const classes = useStyles()

  const [clientSearchValue, setClientSearchValue] = React.useState('')
  const [isDuplicatingLocalClient, setIsDuplicatingLocalClient] = React.useState(false)
  const [isDuplicatingRemoteClient, setIsDuplicatingRemoteClient] = React.useState(false)
  const [isLoadingRemoteClients, setIsLoadingRemoteClients] = React.useState(false)
  const [isNaming, setIsNaming] = React.useState(false)

  const repo = useCurrentGit(g => g.repo)
  const clients = useGitClients()
  const remoteClients = useGitRemoteClients()
  const {fetchRemoteClients, newClientFromExistingClient} = useActions(coreGitActions)

  const filteredClients = clients.filter(
    client => client.name.toLowerCase().includes(clientSearchValue.toLowerCase())
  )

  const filteredExternalClients = remoteClients.filter(
    (client) => {
      const branchParts = parseBranchName(client.name)
      if (!branchParts) {
        return false
      }

      const [owner, clientName] = branchParts
      const includeFromSearch =
        cleanClientName(clientName).toLowerCase().includes(clientSearchValue.toLowerCase())

      // filter out our own clients and also filter by search value
      return repo.handle !== owner && includeFromSearch
    }
  )

  const handleDuplicateClient = async (
    client: IG8Client, newClientName: string, isRemote: boolean
  ) => {
    await lockClient(false)

    if (isRemote) {
      setIsDuplicatingRemoteClient(true)
    } else {
      setIsDuplicatingLocalClient(true)
    }

    await newClientFromExistingClient(repo, newClientName, client)
    returnToMainMenu()

    if (isRemote) {
      setIsDuplicatingRemoteClient(false)
    } else {
      setIsDuplicatingLocalClient(false)
    }
  }

  React.useEffect(() => {
    (async () => {
      setIsLoadingRemoteClients(true)
      await fetchRemoteClients(repo.repoId)
      setIsLoadingRemoteClients(false)
    })()
  }, [])

  return (
    <>
      <div className={classes.searchBarContainer}>
        <SearchBar
          searchText={clientSearchValue}
          setSearchText={setClientSearchValue}
          disabled={isDuplicatingLocalClient || isNaming || isDuplicatingRemoteClient}
          focusOnOpen
        />
      </div>

      <ClientSection
        key='duplicate-local-clients'
        clientList={filteredClients}
        title={t('source_control_configurator.title.duplicate_client')}
        isHeader
        isLoading={isDuplicatingLocalClient}
        disabled={isDuplicatingLocalClient || isNaming || isDuplicatingRemoteClient}
        headerDisabled={isDuplicatingLocalClient || isDuplicatingRemoteClient}
        onDuplicate={(client, name) => handleDuplicateClient(client, name, false)}
        onNaming={() => setIsNaming(true)}
        onNamingCancel={() => setIsNaming(false)}
        returnToMainMenu={returnToMainMenu}
      />

      <ClientSection
        key='duplicate-remote-clients'
        clientList={filteredExternalClients}
        title={t('source_control_configurator.title.team_clients')}
        isLoading={isLoadingRemoteClients || isDuplicatingRemoteClient}
        disabled={isDuplicatingLocalClient || isNaming || isDuplicatingRemoteClient}
        onDuplicate={(client, name) => handleDuplicateClient(client, name, true)}
        onNaming={() => setIsNaming(true)}
        onNamingCancel={() => setIsNaming(false)}
        returnToMainMenu={returnToMainMenu}
        transformClientName={(name) => {
          const branchParts = parseBranchName(name)
          if (!branchParts) {
            return null
          }

          const [, clientName] = branchParts
          return cleanClientName(clientName)
        }}
      />
    </>
  )
}

export {
  DuplicateClientConfigurator,
}
