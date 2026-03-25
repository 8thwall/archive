import '../style/hideable-pre.scss'
declare const React: any

const HideablePre = ({name, content, startOpened = false}) => {
  const [show, setShow] = React.useState(startOpened)
  return show
    ? (
      <div className='hideable-pre'>
        <button className='show' onClick={() => setShow(false)}>Hide {name}</button>
        <pre>{JSON.stringify(content, null, 4)}</pre>
      </div>
    ) : <button onClick={() => setShow(true)}>Show {name}</button>
}

export {
  HideablePre,
}
