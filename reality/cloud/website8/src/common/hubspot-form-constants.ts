import type {SupportedLocale} from '../i18n/i18n-constants'

type FormMap = {[key: SupportedLocale]: string}

// TODO(wayne): Change the FGS HubSpot forms to the newly translated forms once created

const WEBAR_HERO_CLAIM_FORM_MAP: FormMap = {
  'en-US': 'c6720cd8-bf24-4fdb-b546-19f525a9a208',
  'ja-JP': '03d13055-16a3-47dc-8a25-d9a1e3df0930',
  'fr-FR': 'd428d42d-1643-4b8b-9a84-27f9ba0c9199',
  'de-DE': '413a156e-f9ee-4558-a2f3-af83c0ee51fb',
  'es-MX': '662afef6-422d-4835-8278-0a32f659b733',
}

const CONTACT_FORM_MAP: FormMap = {
  'en-US': '478dd7d0-1b83-4429-acc7-19083a6ef219',
  'ja-JP': '6377d8ef-fba5-43bc-a6a8-268e4229e356',
  'fr-FR': 'b9921ba6-b9f3-4b1b-8bc7-c1d26e2ab8bf',
  'de-DE': '44393c2a-5101-4340-9f97-2938b3888139',
  'es-MX': 'cdf400cf-852d-461c-ad02-aa3cada2b983',
}

const LICENSING_FORM_MAP: FormMap = {
  'en-US': '5db06d36-57b9-4084-80c4-d2fc3d6cb4d2',
  'ja-JP': 'f7ad4dc7-056a-4661-9963-a3e8f123874b',
  'fr-FR': '6c29e11b-8044-42a7-9096-56bd4e6b5d14',
  'de-DE': '0e3e27ed-6062-49e7-8845-b77b59eca0eb',
  'es-MX': '089a253d-3e3d-4615-b310-c677e6881694',
}

const REQUEST_AD_FORM_MAP: FormMap = {
  'en-US': '72a1f840-97a0-442a-9531-772613d95d4e',
  'ja-JP': '79bf86b0-fe92-430e-9762-a31b18d80c2e',
  'fr-FR': 'f20e8aa7-36da-4c3d-8096-c08c2210fc56',
  'de-DE': '061ed9d1-561c-4e1f-8e4a-6b160ce9a3ad',
  'es-MX': 'a719418d-fe29-42cd-85d2-2ef66086084a',
}

export {
  WEBAR_HERO_CLAIM_FORM_MAP,
  CONTACT_FORM_MAP,
  LICENSING_FORM_MAP,
  REQUEST_AD_FORM_MAP,
}
