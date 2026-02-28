import React from 'react'
import {Form} from 'semantic-ui-react'

import {
  COVER_IMAGE_PREVIEW_SIZES, MAX_MODULE_TITLE_LENGTH,
} from '../../../shared/module/module-constants'
import {deriveModuleCoverImageUrl} from '../../../shared/module-cover-image'
import type {IAccount, IModule} from '../../common/types/models'
import useActions from '../../common/use-actions'
import Accordion from '../../widgets/accordion'
import actions from '../actions'
import ModuleCoverImageField from './module-cover-image-field'
import BasicTextField from '../../widgets/basic-text-field'
import {LIBRARY_ACCOUNTS} from '../../../shared/account-constants'

interface IEditBasicInfoCard {
  account: IAccount
  module: IModule
  active: boolean
  onTitleClick: () => void
}

const getInitialFormState = (module: IModule) => ({
  title: module.title || '',
  description: module.description || '',
  // Check if we have a server provided image, if not, try to derive it ourselves.
  coverImagePreview: deriveModuleCoverImageUrl(module, COVER_IMAGE_PREVIEW_SIZES[400]),
  cropResult: null,
  publicFeatured: module.publicFeatured,
})

const EditBasicInfoCard: React.FC<IEditBasicInfoCard> = ({
  account,
  module,
  active,
  onTitleClick,
}) => {
  const [loading, setIsLoading] = React.useState(false)
  const initialFormState = getInitialFormState(module)
  const [formState, setFormState] = React.useState(initialFormState)
  const {patchModule} = useActions(actions)

  React.useEffect(() => {
    setFormState(getInitialFormState(module))
  }, [module.title, module.description, module.coverImageId])

  const isSaveDisabled = () => (
    Object.keys(initialFormState).every(key => initialFormState[key] === formState[key])
  )

  const onSaveClick = () => {
    const {title, description, cropResult, publicFeatured} = formState
    const fieldsToUpdate = {
      title,
      description,
      ...(cropResult ? {file: cropResult.original.file, crop: cropResult.cropAreaPixels} : {}),
      publicFeatured,
    }
    setIsLoading(true)
    patchModule(module.uuid, fieldsToUpdate).then(() => {
      setIsLoading(false)
    }).catch(() => {
      setIsLoading(false)
    })
  }

  const onTextFieldChange = (e) => {
    const {name, value} = e.target
    const newState = {...formState}
    newState[name] = value
    setFormState(newState)
  }

  const onCheckBoxChange = () => {
    const newState = {...formState}
    newState.publicFeatured = !formState.publicFeatured
    setFormState(newState)
  }

  const onCoverImageChange = (coverImagePreview, cropResult) => {
    setFormState({...formState, coverImagePreview, cropResult})
  }

  return (
    <Accordion className='edit-basic-info-card'>
      <Accordion.Title
        active={active}
        onClick={onTitleClick}
        a8='click;xrhome-module-settings;basic-information-accordion'
      >
        Basic Information
      </Accordion.Title>
      <Accordion.Content>
        <Form>
          <BasicTextField
            inputId={`${module.uuid}-title-input`}
            labelText='Module Title'
            inputName='title'
            value={formState.title}
            disabled={loading}
            maxLength={MAX_MODULE_TITLE_LENGTH}
            placeholder='Provide the title of your module'
            onChange={onTextFieldChange}
          />
          <BasicTextField
            inputId={`${module.uuid}-description-input`}
            labelText='Description'
            inputName='description'
            isTextArea
            value={formState.description}
            disabled={loading}
            maxLength={150}
            placeholder='Provide a brief description of your module'
            onChange={onTextFieldChange}
          />
          <ModuleCoverImageField
            inputId={`${module.uuid}-cover-image-input`}
            value={formState.coverImagePreview}
            disabled={loading}
            onChange={onCoverImageChange}
          />
          {LIBRARY_ACCOUNTS.includes(account.uuid) && (
            <Form.Checkbox
              id={`${module.uuid}-public-featured-input`}
              label='Public Featured'
              checked={formState.publicFeatured}
              toggle
              onChange={onCheckBoxChange}
            />
          )}
          <Form.Group>
            <Form.Button
              primary
              content='Save'
              onClick={onSaveClick}
              loading={loading}
              disabled={isSaveDisabled()}
            />
          </Form.Group>
        </Form>
      </Accordion.Content>
    </Accordion>
  )
}

export default EditBasicInfoCard
