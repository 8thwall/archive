const isBlockedFileName = (file: string): boolean => !!file.match(/[^a-zA-Z0-9 \-_./~&,[\]#@+()=']/)
const isConventionalFileName = (file: string): boolean => !file.match(/[^a-zA-Z0-9 \-_./@~[\]]/)

export {
  isBlockedFileName,
  isConventionalFileName,
}
