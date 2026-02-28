// Note(Brandon): The message is a translation key related to i18next-react. The actual string can
// be found in cloud-editor-pages.json
const gitLoadProgress = {
  UNSPECIFIED: {
    group: 'sync',
    message: 'progress_indicator.message.getting_started',
    progress: 0.1,
  },
  START: {
    group: 'sync',
    message: 'progress_indicator.message.getting_started',
    progress: 0.2,
  },
  NEEDS_INIT: {
    group: 'sync',
    message: 'progress_indicator.message.needs_init',
    progress: 0.3,
  },
  HAS_REPO_NEEDS_CLONE: {
    group: 'sync',
    message: 'progress_indicator.message.has_repo_needs_clone',
    progress: 0.4,
  },
  CLONE_REPO: {
    group: 'sync',
    message: 'progress_indicator.message.clone_repo',
    progress: 0.5,
  },
  COPY_REPO: {
    group: 'sync',
    message: 'progress_indicator.message.copy_repo',
    progress: 0.6,
  },
  SYNC_MASTER: {
    group: 'sync',
    message: 'progress_indicator.message.sync_master',
    progress: 0.7,
  },
  CHECK_CLIENTS: {
    group: 'check',
    message: 'progress_indicator.message.loading_project_ellipses_1',
    progress: 0.8,
  },
  INIT_DEFAULT_CLIENT: {
    group: 'check',
    message: 'progress_indicator.message.loading_project_ellipses_1',
    progress: 0.9,
  },
  CLIENTS_OK: {
    group: 'check',
    message: 'progress_indicator.message.loading_project_ellipses_1',
    progress: 0.91,
  },
  CHECK_ACTIVE_CLIENT: {
    group: 'check',
    message: 'progress_indicator.message.loading_project_ellipses_2',
    progress: 0.92,
  },
  SET_ACTIVE_CLIENT: {
    group: 'check',
    message: 'progress_indicator.message.loading_project_ellipses_2',
    progress: 0.93,
  },
  ACTIVE_CLIENT_OK: {
    group: 'check',
    message: 'progress_indicator.message.loading_project_ellipses_2',
    progress: 0.94,
  },
  LOADING_FILES: {
    group: 'load',
    message: 'progress_indicator.message.loading_project_ellipses_3',
    progress: 0.96,
  },
  DONE: {
    group: 'load',
    message: '✓',
    progress: 1.0,
  },
}

export {
  gitLoadProgress,
}
