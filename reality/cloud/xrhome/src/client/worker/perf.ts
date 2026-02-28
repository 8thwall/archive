export const start = (name) => {
  if (BuildIf.LOCAL_DEV) {
    console.time(name)
  }
}

export const end = (name) => {
  if (BuildIf.LOCAL_DEV) {
    console.timeEnd(name)
  }
}

export const log = (...things) => {
  if (BuildIf.LOCAL_DEV) {
    console.log(...things)
  }
}
