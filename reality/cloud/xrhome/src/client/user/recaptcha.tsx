import React from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

import {siteKey} from '../../shared/google-config'
import {useUiTheme} from '../ui/theme'

const verifyCaptcha = recaptchaCode => fetch('/api/public/users/recaptcha', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({recaptchaCode}),
}).then((res) => {
  if (res.ok) {
    return res
  } else {
    throw new Error('Fail to verify Captcha')
  }
})

const useRecaptcha = () => {
  const [recaptchaValue, setRecaptchaValue] = React.useState(null)
  const verifyRecaptcha = () => {
    if (!BuildIf.LOCAL_DEV) {
      return Promise.resolve()
    }

    return verifyCaptcha(recaptchaValue)
  }
  return [recaptchaValue, setRecaptchaValue, verifyRecaptcha]
}

interface IRecaptchaVerifyBox {
  onPass(value: string): void
}

const RecaptchaVerifyBox: React.FunctionComponent<IRecaptchaVerifyBox> = ({onPass}) => {
  const ref = React.useRef(null)
  const theme = useUiTheme()
  return <ReCAPTCHA ref={ref} sitekey={siteKey} onChange={onPass} theme={theme.recaptchaTheme} />
}

export {
  useRecaptcha,
  RecaptchaVerifyBox as default,
}
