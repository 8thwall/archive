// NOTE(christoph): The "project specifier" concept is a combination of shortName/appName that can
// be used to refer to an app, especially in a studio context. However, if we ever want to be able
// to change shortNames, we will need to massively reduce our dependency on project specifiers.

// While we look at migrating behaviors that depend on it, it would be good to at least point
// all the logic to use a shared function for easier grepping.

type AppOrName = {appName: string} | string
type AccountOrName = {shortName: string} | string

const makeProjectSpecifier = (account: AccountOrName, app: AppOrName) => (`\
${typeof account === 'string' ? account : account.shortName}\
.\
${typeof app === 'string' ? app : app.appName}`
)

export {
  makeProjectSpecifier,
}
