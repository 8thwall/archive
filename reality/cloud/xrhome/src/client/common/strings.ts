/* eslint-disable import/prefer-default-export */
const titleCase = (str?: string) => (
  str?.replace(/\S+/g, s => s.charAt(0).toUpperCase() + s.substr(1))
)

export {
  titleCase,
}
