import React from 'react'
import {Button, Popup} from 'semantic-ui-react'
import {toString as generateQrCode} from 'qrcode'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import {gray4} from '../../static/styles/settings'

const PNG_SIZE = 512

const useStyles = createUseStyles({
  button: {
    margin: '0 !important',
    borderColor: `${gray4} !important`,
  },
})

const downloadData = (data: string, filename: string) => {
  const a = document.createElement('a')
  a.setAttribute('download', filename)
  a.setAttribute('href', data)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

interface IQrCodeDownloadOptions {
  content: string
}

const QrCodeDownloadOptions: React.FC<IQrCodeDownloadOptions> = ({content}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const {t} = useTranslation(['common'])
  const classes = useStyles()

  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const contextRef = React.useRef<CanvasRenderingContext2D>(null)
  const imgRef = React.useRef<HTMLImageElement>(null)

  const initializeElements = () => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas')
      contextRef.current = canvasRef.current.getContext('2d')
      canvasRef.current.width = PNG_SIZE
      canvasRef.current.height = PNG_SIZE
    }

    imgRef.current = imgRef.current || document.createElement('img')
  }

  const generateSvg = async () => {
    const svg = await generateQrCode(content, {type: 'svg'})
    return `data:image/svg+xml,${encodeURIComponent(svg)}`
  }

  const handleImageLoaded = () => {
    contextRef.current.clearRect(0, 0, PNG_SIZE, PNG_SIZE)
    contextRef.current.drawImage(imgRef.current, 0, 0, PNG_SIZE, PNG_SIZE)
    const png = canvasRef.current.toDataURL()
    downloadData(png, '8code.png')
    imgRef.current.onload = null
  }

  const downloadSvg = async () => {
    downloadData(await generateSvg(), '8code.svg')
  }

  const downloadPng = async () => {
    initializeElements()
    imgRef.current.onload = handleImageLoaded
    imgRef.current.src = await generateSvg()
  }

  const popupContent = (
    <div className='qr-code-download-options'>
      <Button className='gray-4' onClick={downloadPng} content='PNG' />
      <Button className='gray-4' onClick={downloadSvg} content='SVG' />
    </div>
  )

  const popupTrigger = (
    <Button
      className={classes.button}
      color='black'
      basic={!isOpen}
      icon='cloud download'
      content={t('button.download')}
    />
  )

  return (
    <Popup
      trigger={popupTrigger}
      content={popupContent}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      basic
      on='click'
      position='bottom center'
    />
  )
}

export {
  QrCodeDownloadOptions,
}
