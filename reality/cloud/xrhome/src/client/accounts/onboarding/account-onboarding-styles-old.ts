import {hexColorWithAlpha} from '../../../shared/colors'
import {createThemedStyles} from '../../ui/theme'

const useOnboardingStyles = createThemedStyles(theme => ({
  formWrapper: {
    backgroundColor: hexColorWithAlpha(theme.modalBg, 0.2),
    padding: '1em',
    borderRadius: '2em',
    backdropFilter: 'blur(10px)',
    boxShadow:
      `-1px -1px 1px 0px ${hexColorWithAlpha(theme.sfcDisabledColor, 0.5)}, ` +
      `1px 1px 1px 0px ${theme.subtleBorder}, ` +
      '0px 15px 35px 0px rgba(0, 0, 0, 0.35)',
    overflow: 'hidden',
  },
  formContent: {
    backgroundColor: hexColorWithAlpha(theme.modalBg, 0.25),
    boxShadow:
      `-1px -1px 1px 0px ${hexColorWithAlpha(theme.sfcDisabledColor, 0.5)}, ` +
      `1px 1px 1px 0px ${theme.subtleBorder}`,
    padding: '3em 2em',
    borderRadius: '1.5em',
    display: 'flex',
    gap: '1.5em',
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
}))

export {useOnboardingStyles}
