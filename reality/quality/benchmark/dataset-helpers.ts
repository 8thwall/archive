// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Akul Gupta
// Helpers for common dataset script usage.

// @visibility(//visibility:public)

import * as path from 'path'
import * as fs from 'fs'
import * as os from 'os'

const datasetDir = path.join(os.homedir(), 'datasets')

/* Modifies param:sequences by appending all the dataset sequences in the datasetDirs list to it.
 @param sequences, the list of sequences that will be used and modified.
 @param datasetDirs, a list of dataset directories found in ~/datasets. Ex ['portals',...].
 @param fileFormat, a function that returns the dataset file in the format in the sequences list.
 @param fileHasString, a list of substring that a file name should have. Ie ['quick-movement'].
 */
const appendDatasetSequences = (sequences, datasetDirs, fileFormat,
  fileHasAnySubStrings = ['']) => {
  // Helper: DFS of a directory, returns a list of all benchmark files in the directory(s).
  const walk = (dir) => {
    const results = []
    const list = fs.readdirSync(dir)
    list.forEach((file) => {
      const filepath = `${dir}/${file}`
      const stat = fs.statSync(filepath)
      if (stat && stat.isDirectory()) {
        // Recurse into a subdirectory.
        results.push(...walk(filepath))
      } else {
        // Is a filepath.
        const badExts = ['.DS_Store', '.mp4', '.png', '.jpg']
        // The file does not contain any of the badExts and is not already in SEQUENCES?
        if (badExts.every(badExt => !file.includes(badExt)) &&
          !sequences.includes(fileFormat(file)) &&
          fileHasAnySubStrings.some(substr => file.includes(substr))) {
          // Remove datasetDir from the beginning of the string.
          results.push(filepath.replace(datasetDir, ''))
        }
      }
    })
    return results
  }

  datasetDirs.forEach((dataDir) => {
    walk(path.join(datasetDir, dataDir)).forEach((dataFile) => {
      const split = dataFile.split('.')
      // Skip non-datarecorder files, i.e. '.csv', '.ipynb'.
      if (!split || split.length === 0 || split[split.length - 1].length > 5) {
        sequences.push(fileFormat(dataFile))
      }
    })
  })
}

export {appendDatasetSequences}
