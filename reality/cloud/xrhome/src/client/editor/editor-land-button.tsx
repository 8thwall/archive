import React from 'react'
import {useTranslation} from 'react-i18next'
import {Button} from 'semantic-ui-react'

type IEditorLandButton = {
  disabled: boolean
  onClick: () => void
  canLand?: boolean
  loading?: boolean
}

const EditorLandButton: React.FC<IEditorLandButton> = ({disabled, onClick, canLand, loading}) => {
  const {t} = useTranslation(['common'])

  return (
    <Button
      icon='arrow circle right'
      color={canLand ? 'green' : 'grey'}
      content={t('button.land')}
      loading={loading}
      disabled={disabled}
      onClick={onClick}
      a8='click;cloud-editor-land-flow;land-button'
    />
  )
}

export {
  EditorLandButton,
}
