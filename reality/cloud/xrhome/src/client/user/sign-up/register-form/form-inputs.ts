const PASSWORD_REQUIREMENTS =
  [
    {
      i18nKey: 'register_sign_up_page.register_form.password_requirements.one_uppercase',
      check: (s: string) => !!s.match(/[A-Z]/),
    },
    {
      i18nKey: 'register_sign_up_page.register_form.password_requirements.one_lowercase',
      check: (s: string) => !!s.match(/[a-z]/),
    },
    {
      i18nKey: 'register_sign_up_page.register_form.password_requirements.one_number',
      check: (s: string) => !!s.match(/[0-9]/),
    },
    {
      i18nKey: 'register_sign_up_page.register_form.password_requirements.minimum_char',
      check: (s: string) => (s.length >= 8),
    },
  ] as const

const MATCH_REQUIREMENT = {
  i18nKey: 'register_sign_up_page.register_form.match_requirement',
  check: (s: string, r: string) => s && s === r,
}

const getAllPasswordRequirements = () => [...PASSWORD_REQUIREMENTS, MATCH_REQUIREMENT]

export {
  PASSWORD_REQUIREMENTS,
  MATCH_REQUIREMENT,
  getAllPasswordRequirements,
}
