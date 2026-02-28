import * as fs from 'fs'
import * as path from 'path'

const A8_REGEX_PATTERN = /[`'](click|scroll);([^`']*?(\$\{[^}]*\})?[^`']*?)*[`']/gs

interface FileRecord {
  file: string;
  type: string;
  action: string;
  category: string;
}

const fetchA8Tags = (dir: string, fileList: string[]) => {
  const files = fs.readdirSync(dir)
  files.forEach((file) => {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      fetchA8Tags(filePath, fileList)
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath)
    }
  })
  return fileList
}

// Check if a file contains the specified attributes
const checkFileForPattern = (filePath: string, pattern: RegExp) => {
  const content = fs.readFileSync(filePath, 'utf8')
  const matches = Array.from(content.matchAll(pattern))
  return matches.map((match) => {
    const parts = match[0].split(';')
    return {
      file: filePath,
      type: parts[0]?.replace(/['`]/g, ''),
      action: parts[1],
      category: parts[2]?.replace(/['`]/g, ''),
    }
  })
}

// Convert data to CSV format
const convertToCSV = (data: {file: string; type: string; action: string; category: string}[]) => {
  const header = 'File,Event Type,Event Action, Event Category\n'
  const rows = data.map(row => `${row.file},${row.type},${row.action},${row.category}`).join('\n')
  return header + rows
}

const mainTagWriter = () => {
  const directoryPath = '../src'
  const exportPath = './'

  const files = fetchA8Tags(directoryPath, [])

  const results: FileRecord[] = []

  files.forEach((file) => {
    const matches = checkFileForPattern(file, A8_REGEX_PATTERN)
    results.push(...matches)
  })
  const csvContent = convertToCSV(results)
  const outputPath = path.join(exportPath, 'results.csv')
  fs.writeFileSync(outputPath, csvContent)
  // eslint-disable-next-line no-console
  console.log('CSV file written successfully')
}

mainTagWriter()
