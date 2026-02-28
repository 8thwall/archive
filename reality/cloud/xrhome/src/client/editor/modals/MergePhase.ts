import type {DeepReadonly} from 'ts-essentials'

import {
  IG8FileDiff, IG8MergeAnalysisInfo, IG8MergeTriplet, IMergeHunk, MergeChoice,
} from '../../git/g8-dto'
import type {IDiffViewPane} from '../../git/utils'
import type {DependencyConflictDetails} from '../dependency-conflicts'

interface MergePhase {
  repoId: string
  mergeId: IG8MergeTriplet

  merge: IG8MergeAnalysisInfo
  mineYoursDiff: IG8FileDiff
  fileIds: IG8MergeTriplet
  mergeBlobId: string
  mineBuffer: string                   // obtained from getBobs (in the merge known as yours)
  theirsBuffer: string                 // ditto
  mergeBuffer: string                  // result of calling mergeBlobs()
  hunks: IMergeHunk                    // ditto
  mineTheirsDiffView: IDiffViewPane[]  // computed on mount
  mineMineDiffView: IDiffViewPane[]    // same thing is displayed on both sides
  mineMergeDiffView: IDiffViewPane[]

  // mutable things
  editBuffer: string
  madeEdits: boolean
  editBlobId: string
  choice: MergeChoice | 'edit'  // expecting merge to be default
  choiceMade: boolean
  mineEditDiffView: IDiffViewPane[]  // after saving edits, run a diff on the edit

  // for hunk navigation
  totalHunks: number
  hunkStarts: number[]       // the line on which each hunk begins
  currentHunk: number        // what is the active merge hunk we are scrolled to
  currentScrollLine: number  // the line to navigate to
  hasHunksForward: boolean
  hasHunksBackward: boolean

  // only set for dependency files when delete did not occur.
  dependencyConflictDetails: DependencyConflictDetails
}

interface NonLogicalConflictMerge {
  repoId: string
  mergeId: IG8MergeTriplet

  fileIds: IG8MergeTriplet
  merge: IG8MergeAnalysisInfo

  // When there is no logical conflict, we could automatically merge some configs.
  mergeBlobId: string
}

const getContentForCurrentChoice = (mergePhase: DeepReadonly<MergePhase>): string => {
  switch (mergePhase.choice) {
    case MergeChoice.Mine:
      return mergePhase.mineBuffer
    case MergeChoice.Theirs:
      return mergePhase.theirsBuffer
    case MergeChoice.Merge:
      return mergePhase.mergeBuffer
    case 'edit':
      return mergePhase.editBuffer
  }
}

const getFileIdForCurrentChoice = (mergePhase: DeepReadonly<MergePhase>): string => {
  switch (mergePhase.choice) {
    case MergeChoice.Mine:
      return mergePhase.fileIds.yours
    case MergeChoice.Theirs:
      return mergePhase.fileIds.theirs
    case MergeChoice.Merge:
      return mergePhase.mergeBlobId
    case 'edit':
      return mergePhase.editBlobId
  }
}

const getDiffDataForCurrentChoice = (mergePhase: DeepReadonly<MergePhase>): DeepReadonly<IDiffViewPane[]> => {
  switch (mergePhase.choice) {
    case MergeChoice.Mine: {
      return mergePhase.mineMineDiffView
    }
    case MergeChoice.Theirs: {
      return mergePhase.mineTheirsDiffView
    }
    case MergeChoice.Merge: {
      return mergePhase.mineMergeDiffView
    }
    case 'edit': {
      return mergePhase.mineEditDiffView
    }
  }
}

const getMergeChoice = (mergePhase: DeepReadonly<MergePhase>) => (
  mergePhase.choice === 'edit' ? MergeChoice.Merge : mergePhase.choice
)

export {
  getContentForCurrentChoice,
  getFileIdForCurrentChoice,
  getDiffDataForCurrentChoice,
  getMergeChoice,
}

export type {
  MergePhase,
  NonLogicalConflictMerge,
}
