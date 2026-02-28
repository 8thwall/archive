const deriveRpcNameFromFileName = (fileName: string) => fileName
  // Remove leading non-alphabetical characters.
  .replace(/^[^a-zA-Z]+/, '')
  // Convert to camelCase and remove trailing hypens and underscores.
  .replace(/[-_]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
  // Lowercase the first character.
  .replace(/^(.)/, match => match.toLowerCase())

export {
  deriveRpcNameFromFileName,
}
