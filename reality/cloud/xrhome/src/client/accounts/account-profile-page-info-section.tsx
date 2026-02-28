import React from 'react'
import {Form, Button, Input, TextArea} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import type {DeepReadonly} from 'ts-essentials'

import type {IAccount} from '../common/types/models'
import useActions from '../common/use-actions'
import {combine, bool} from '../common/styles'
import {ACCOUNT_MIN_ICON_WIDTH} from '../../shared/account-constants'
import useStyles from './account-profile-page-jss'
import AccountLogoImageField from './widgets/account-logo-image-field'
import accountActions from './account-actions'
import {
  formattedAddressWithPlaceId,
  setAutoCompleteWidget,
} from '../common/google-maps'
import {
  isEntryWebAccount, requiresCustomIcon, isDefaultIcon, getIconIdFromCdnUrl,
} from '../../shared/account-utils'
import {SocialLinkInput} from './social-link-input'
import {SocialLinkType} from './socials-name-parser'
import {extractPlatformHandle, constructPlatformUrl} from './socials-name-parser'

const BIO_MAX_LENGTH = 240
const NEWLINE_KEY_CODE = 13
// To resolve jsx-a11y/label-has-associated-control
// and we want to have an id as distinct as possible
const ADDRESS_SEARCH_INPUT_ID = 'accountPublicProfileAddressSearchInput'

const getInitialFormState = account => ({
  iconImage: account.icon?.[ACCOUNT_MIN_ICON_WIDTH] || '',  // Use largest 400x400 logo image
  iconImageCropResult: null,
  iconImageFileName: '',
  name: account.name || '',
  url: account.url || '',
  googleMapsPlaceId: account.googleMapsPlaceId || '',
  bio: account.bio || '',
  contactUrl: account.contactUrl || '',
  twitterHandle: constructPlatformUrl(account.twitterHandle, SocialLinkType.Twitter) || '',
  linkedInHandle: constructPlatformUrl(account.linkedInHandle, SocialLinkType.LinkedIn) || '',
  youtubeHandle: constructPlatformUrl(account.youtubeHandle, SocialLinkType.Youtube) || '',
})

type FormFieldName = keyof ReturnType<typeof getInitialFormState>

const PUBLIC_PROFILE_REQUIRED_FIELDS: DeepReadonly<FormFieldName[]> = [
  'iconImage', 'name', 'url', 'googleMapsPlaceId', 'bio', 'contactUrl',
]

const ENTRY_PROFILE_REQUIRED_FIELDS: DeepReadonly<FormFieldName[]> = ['name']

const hasMissingRequiredField = (formState, requiredFields, account) => {
  if (requiresCustomIcon(account) && isDefaultIcon(getIconIdFromCdnUrl(formState.iconImage))) {
    return true
  }

  return Object.keys(formState).some(key => !formState[key] && requiredFields.includes(key))
}

interface IAccountProfilePageInfoSection {
  // Variables
  account: IAccount
  shouldHighlightRequired: boolean

  // Functions
  setHasEmptyRequiredFormField(value: boolean): void
  setShouldHighlightRequired(value: boolean): void
  setIsPublishDisabled(value: boolean): void
}

const AccountProfilePageInfoSection: React.FC<IAccountProfilePageInfoSection> = ({
  account,
  setHasEmptyRequiredFormField,
  shouldHighlightRequired,
  setShouldHighlightRequired,
  setIsPublishDisabled,
}) => {
  const {updateAccountMetadata} = useActions(accountActions)
  const autoCompleteRef = React.useRef(null)
  const classes = useStyles()
  const {t} = useTranslation(['account-pages', 'common'])

  const {publicFeatured, uuid} = account
  const initialFormState = getInitialFormState(account)
  const [formState, setFormState] = React.useState(initialFormState)
  const [initialAddress, setInitialAddress] = React.useState('')
  const [address, setAddress] = React.useState('')
  const [shouldValidate, setShouldValidate] = React.useState(false)
  const [isUpdating, setIsUpdating] = React.useState(false)
  const requiredFields = isEntryWebAccount(account)
    ? ENTRY_PROFILE_REQUIRED_FIELDS
    : PUBLIC_PROFILE_REQUIRED_FIELDS

  React.useEffect(() => {
    setFormState(getInitialFormState(account))
  }, [
    account.icon,
    account.name,
    account.url,
    account.googleMapsPlaceId,
    account.bio,
    account.contactUrl,
  ])

  React.useEffect(() => {
    const updatePlace = async () => {
      if (account.googleMapsPlaceId) {
        try {
          const curAddress = await formattedAddressWithPlaceId(account.googleMapsPlaceId)
          setInitialAddress(curAddress)
          setAddress(curAddress)
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(
            `Fail to get address with place_id: ${account.googleMapsPlaceId} ${e}`
          )
        }
      }
    }

    updatePlace()
  }, [account.googleMapsPlaceId])

  const onPlaceSelect = (autoComplete) => {
    if (autoComplete) {
      const {place_id: newPlaceId, formatted_address: formattedAddress} = autoComplete.getPlace()
      const newState = {...formState}
      newState.googleMapsPlaceId = newPlaceId
      setFormState(newState)
      setAddress(formattedAddress)
    }
  }

  const hasEmptyRequiredFormField = hasMissingRequiredField(formState, requiredFields, account)

  // Sync hasEmptyRequiredFormField with Profile page state
  React.useEffect(() => {
    setHasEmptyRequiredFormField(hasEmptyRequiredFormField)
  }, [hasEmptyRequiredFormField])

  React.useEffect(() => {
    setAutoCompleteWidget(onPlaceSelect, autoCompleteRef)
    if (!hasEmptyRequiredFormField) {
      setShouldHighlightRequired(false)
    }
  }, [formState])

  // iconImage, iconImageCropResult, and iconImageFileName change at the same time
  // so we don't need to exclude any of them
  const isFormStateDiff = !Object.keys(
    formState
  ).every(key => formState[key] === initialFormState[key])

  // Does not allow saving with any empty required field(s) for public profile
  const isSaveDisabled = publicFeatured
    ? (!isFormStateDiff || hasEmptyRequiredFormField)
    : !isFormStateDiff

  // Sync isPublishDisabled with Profile page state
  React.useEffect(() => {
    setIsPublishDisabled(
      hasMissingRequiredField(initialFormState, requiredFields, account) || !isSaveDisabled
    )
  }, [initialFormState, isSaveDisabled])

  const onLogoImageChange = (iconImage, iconImageCropResult, iconImageFileName) => {
    const newState = {...formState, iconImage, iconImageCropResult, iconImageFileName}
    setFormState(newState)
  }

  const onTextFieldChange = (e) => {
    const {name, value} = e.target
    // Replace newline/return(s) with one single space
    const noNewLineValue = value.replace(/[\r\n]+/g, ' ')
    const newState = {...formState}
    newState[name] = noNewLineValue
    setFormState(newState)
  }

  const onTextAreaKeyDown = (e) => {
    if (e.keyCode === NEWLINE_KEY_CODE) {
      e.preventDefault()
    }
  }

  const onAddressChange = (e) => {
    const newState = {...formState}
    newState.googleMapsPlaceId = ''
    setFormState(newState)
    setAddress(e.target.value)
  }

  const formSubmit = async () => {
    setIsUpdating(true)

    // Strip iconImage, iconImageCropResult, and iconImageFileName from formState
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {iconImage, iconImageCropResult, iconImageFileName, ...strippedFormState} = formState

    await updateAccountMetadata({
      uuid,
      ...strippedFormState,
      twitterHandle: extractPlatformHandle(formState.twitterHandle),
      linkedInHandle: extractPlatformHandle(formState.linkedInHandle),
      youtubeHandle: extractPlatformHandle(formState.youtubeHandle),
    }, iconImageCropResult?.original?.file, iconImageCropResult?.cropAreaPixels)

    setIsUpdating(false)
  }

  const revertChange = () => {
    setFormState(initialFormState)
    setAddress(initialAddress)
  }

  // Highlight the required fields if the profile is already public
  // or temporarily if "Activate Public Profile" is clicked
  const shouldRequired = publicFeatured || shouldHighlightRequired

  // When public, either the inserted address is empty
  // or the input loses focus and the place_id is not set yet
  // we want to highlight this field as required but not filled
  const shouldHighlightRequireAddress =
    shouldRequired && (!formState.googleMapsPlaceId && (shouldValidate || !address))

  const shouldHighlightRequireField = (fieldName: FormFieldName) => {
    if (requiredFields.includes(fieldName)) {
      // "googleMapsPlaceId" is a special and required field
      if (fieldName === 'googleMapsPlaceId') {
        return bool(shouldHighlightRequireAddress, classes.requiredField)
      } else {
        return bool(shouldRequired && !formState[fieldName], classes.requiredField)
      }
    } else {
      return null
    }
  }

  const socialLinksGroup = (
    <div className={classes.socialLinksGroup}>
      <SocialLinkInput
        type={SocialLinkType.Twitter}
        value={formState.twitterHandle}
        onChange={(handle) => {
          const newState = {...formState}
          newState.twitterHandle = handle
          setFormState(newState)
        }}
      />
      <SocialLinkInput
        type={SocialLinkType.LinkedIn}
        value={formState.linkedInHandle}
        onChange={(handle) => {
          const newState = {...formState}
          newState.linkedInHandle = handle
          setFormState(newState)
        }}
      />
      <SocialLinkInput
        type={SocialLinkType.Youtube}
        value={formState.youtubeHandle}
        onChange={(handle) => {
          const newState = {...formState}
          newState.youtubeHandle = handle
          setFormState(newState)
        }}
      />
    </div>
  )

  return (
    <>
      <h4 className={classes.sectionTitle}>{t('profile_page.info')}</h4>
      <Form id='profile-search-form' onSubmit={formSubmit} autoComplete='false'>
        <AccountLogoImageField
          iconImage={formState.iconImage}
          iconImageFileName={formState.iconImageFileName}
          onChange={onLogoImageChange}
        />
        <Form.Field
          className={combine(
            shouldHighlightRequireField('name'),
            classes.requiredAsterisk
          )}
          control={Input}
          label={t('profile_page.input.label.name')}
          name='name'
          value={formState.name}
          onChange={onTextFieldChange}
          placeholder={t('profile_page.input.placeholder.name')}
        />
        <Form.Field
          className={combine(!isEntryWebAccount(account) &&
            shouldHighlightRequireField('url'),
          !isEntryWebAccount(account) && classes.requiredAsterisk)}
          control={Input}
          label={t('profile_page.input.label.website_url')}
          name='url'
          type='url'
          value={formState.url}
          onChange={onTextFieldChange}
          placeholder='https://www.companywebsite.com'
        />
        <Form.Field
          className={combine(
            shouldHighlightRequireField('googleMapsPlaceId'),
            !isEntryWebAccount(account) && classes.requiredAsterisk
          )}
        >
          {/* eslint jsx-a11y/label-has-associated-control: ["error", {assert: "either"}] */}
          <label htmlFor={ADDRESS_SEARCH_INPUT_ID}>
            {t('profile_page.input.label.primary_location')}
          </label>
          <div className='ui input'>
            <input
              ref={autoCompleteRef}
              id={ADDRESS_SEARCH_INPUT_ID}
              type='text'
              value={address}
              onChange={onAddressChange}
              placeholder={t('profile_page.input.placeholder.primary_location')}
              onBlur={() => setShouldValidate(true)}
              onFocus={() => setShouldValidate(false)}
            />
          </div>
          {shouldValidate && !formState.googleMapsPlaceId && !isEntryWebAccount(account) &&
            <span
              className={
                publicFeatured
                  ? classes.generalErrorMessage
                  : classes.addressWarningMessage
              }
            >
              No&nbsp;city&nbsp;selected
            </span>
          }
        </Form.Field>
        <Form.Group grouped className={classes.bioGroup}>
          <Form.Field
            className={combine(
              shouldHighlightRequireField('bio'),
              !isEntryWebAccount(account) && classes.requiredAsterisk
            )}
            control={TextArea}
            maxLength={BIO_MAX_LENGTH}
            label={t('profile_page.input.label.bio')}
            name='bio'
            value={formState.bio}
            onChange={onTextFieldChange}
            onKeyDown={onTextAreaKeyDown}
            placeholder={t('profile_page.input.placeholder.bio')}
          />
          {isFormStateDiff &&
            <p>{`${formState.bio.length}/${BIO_MAX_LENGTH}`}</p>
          }
        </Form.Group>
        <Form.Field
          className={combine(
            shouldHighlightRequireField('contactUrl'),
            !isEntryWebAccount(account) && classes.requiredAsterisk
          )}
          control={Input}
          label={t('profile_page.input.label.contact_email')}
          name='contactUrl'
          type='email'
          value={formState.contactUrl}
          onChange={onTextFieldChange}
          placeholder='email@address.com'
        />
        <Form.Group
          grouped
          className={classes.socialLinksSection}
        >
          <h3 className={classes.socialLinksLabel}>
            {t('profile_page.input.label.social_links')}
          </h3>
          {socialLinksGroup}
        </Form.Group>
        <Form.Group inline>
          <Form.Field
            className={classes.saveButton}
            primary
            control={Button}
            loading={isUpdating}
            disabled={isSaveDisabled}
            content={t('button.save', {ns: 'common'})}
          />
          {isFormStateDiff &&
            <Form.Field
              className={classes.cancelButton}
              type='button'
              onClick={revertChange}
              content={t('button.cancel', {ns: 'common'})}
            />
          }
        </Form.Group>
      </Form>
    </>
  )
}

export default AccountProfilePageInfoSection
