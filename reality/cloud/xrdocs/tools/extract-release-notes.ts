import {readFileSync} from 'node:fs'
import matter from 'gray-matter'

import type {
  ReleaseNotesData, ReleaseNoteData,
} from '../../../../c8/ecs/src/shared/release-notes-types'

// npx ts-node tools/extract-release-notes.ts

/* eslint-disable no-console */

const parseNoteText = (noteText: string) => {
  if (!noteText!.startsWith('## ')) {
    throw new Error('Note does not start with ## ')
  }

  const firstLineMatch = noteText.match(/^## (.*) {#version-(.*)}\n/)
  if (!firstLineMatch) {
    throw new Error('No title found in note')
  }

  const title = firstLineMatch[1].trim()
  const id = firstLineMatch[2].trim()

  const dateMatch = id.match(/^(\d{4})-(.*)-(\d{1,2})$/)
  if (!dateMatch) {
    throw new Error(`No date found in note ID: ${id}`)
  }
  const [yearString, monthString, dayString] = dateMatch.slice(1)

  const year = parseInt(yearString, 10)
  // Month is 0-indexed in JS
  const month = new Date(Date.parse(`${monthString} 1, ${yearString}`)).getMonth() + 1
  const day = parseInt(dayString, 10)

  const remainder = noteText.slice(firstLineMatch[0].length)

  // Skip date
  const remainderFirstNewline = remainder.indexOf('\n')
  if (remainderFirstNewline === -1) {
    throw new Error(`No contents found in note: ${id}`)
  }

  const contents = remainder.slice(remainderFirstNewline).trim()

  return {
    title,
    year,
    month,
    day,
    contents,
  }
}

const parseNotes = (filePath: string) => {
  const fileContent = readFileSync(filePath, 'utf-8')
  const frontMatter = matter(fileContent)
  console.warn(`Processing file: ${filePath}`)
  console.warn(`Front matter: ${JSON.stringify(frontMatter.data, null, 2)}`)

  const latestPopupId = frontMatter.data.latest_popup_id

  if (typeof latestPopupId !== 'string') {
    throw new Error(`Expected latest_popup_id to be a string, got ${latestPopupId}`)
  }

  const sectionStartIndices: number[] = []

  const sectionRegex = /^## /gm
  for (const match of fileContent.matchAll(sectionRegex)) {
    sectionStartIndices.push(match.index!)
  }

  console.warn(`Found ${sectionStartIndices.length} sections in file: ${filePath}`)

  if (sectionStartIndices.length === 0) {
    console.warn(`No sections found in file: ${filePath}`)
    return
  }

  const data: ReleaseNoteData[] = []

  for (let i = 0; i < sectionStartIndices.length; i++) {
    const start = sectionStartIndices[i]
    const end = sectionStartIndices[i + 1] || fileContent.length
    const {title, year, month, day, contents} = parseNoteText(fileContent.slice(start, end).trim())
    const id = [year, month, day].map(e => e.toString().padStart(2, '0')).join('_')

    const runtimeKey = `runtime_version_${id}`

    const runtimeVersion = frontMatter.data[runtimeKey]
    const shouldHaveRuntimeVersion = year > 2025 || (year === 2025 && month >= 8)
    if (!runtimeVersion && shouldHaveRuntimeVersion) {
      throw new Error(`No runtime version found for ${runtimeKey} in file: ${filePath}`)
    }

    data.push({
      id,
      title,
      year,
      month,
      day,
      contents,
      runtimeVersion,
    })
  }

  if (!data.length) {
    throw new Error(`No data found in file: ${filePath}`)
  }

  const notes: ReleaseNotesData = {
    latestPopupId: latestPopupId === 'latest' ? data[0].id : latestPopupId,
    notes: data,
  }

  console.log(JSON.stringify(notes, null, 2))
}

parseNotes('studio/changelog.md')
