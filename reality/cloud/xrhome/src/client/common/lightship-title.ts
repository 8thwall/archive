import type {TOptions} from 'i18next'
import type {TFunction} from 'react-i18next'

const makeLightshipTitle = (
  t: TFunction<'translation', undefined>, textKey: string,
  pathname: string, interpolations: Record<string, string>
) => {
  const baseOpts: TOptions = {
    ns: 'lightship-app',
  }
  const opts: TOptions = {
    ...baseOpts,
    replace: interpolations,
  }
  return `\
    ${t(textKey, opts)}\
    ${pathname.startsWith('/account') ? ` - ${t('global.account', baseOpts)} ` : ''}\
    ${pathname !== '/' ? ' - ' : ''}\
    ${t('global.niantic_lighthsip', baseOpts)}`
}

export {makeLightshipTitle}
