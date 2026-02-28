const UUIDV4_REGEX = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
const isValidUuidv4 = (s: string): boolean => UUIDV4_REGEX.test(s)

export {isValidUuidv4}
