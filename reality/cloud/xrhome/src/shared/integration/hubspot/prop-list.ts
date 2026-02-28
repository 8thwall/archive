type PropList = Array<{
  property: string
  value: string | number | boolean | null
}>

const convertObjToPropList = (obj: {}): PropList | null => {
  if (!obj) {
    return null
  }
  return Object.keys(obj).map(k => ({
    property: k,
    value: obj[k],
  }))
}

export {
  convertObjToPropList,
}

export type {
  PropList,
}
