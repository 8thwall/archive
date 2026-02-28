const parseCookie = (cookie: string): any => (
  cookie.split('; ').reduce((acc, currentValue) => {
    const [key, value] = currentValue.split('=')
    acc[key] = value
    return acc
  }, {})
)

export {parseCookie}
