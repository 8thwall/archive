const sanitizeAlias = (s: string): string => s.replace(/[^a-zA-Z0-9-_]/gi, '_').toLowerCase()

export {
  sanitizeAlias,
}
