import ReactDOM from 'react-dom'
import React from 'react'
import Embed8 from '../src/embed8-react'

const App = () => {
  return (
    <React.Fragment>
      <h1>Testing Embed8 React</h1>
      <div>Simple Jini embed8 <Embed8 shortLink='jini' /></div>
      <div>Simple Jini embed8 expanded first <Embed8 shortLink='jini' expandedFirst /></div>
      <div>Jini embed8 with content <Embed8 shortLink='jini'>Custom text</Embed8></div>
      <div>Jini embed8 with content <Embed8 shortLink='jini'>AR</Embed8></div>
      <div>Jini embed8 with content <Embed8 shortLink='jini'>This is multi<br />line text</Embed8></div>

      <h1>Customizing elements</h1>
      <div>Jini embed8 with content <Embed8 shortLink='jini' hideIcon>Some text</Embed8></div>
      <div>Jini embed8 with content <Embed8 shortLink='jini' iconColor='gray'>Another text</Embed8></div>
      <div>Jini embed8 with vertical icon <Embed8 shortLink='jini' iconVertical /> Some vertical stuff</div>
      <div>Jini embed8 with content <Embed8 shortLink='jini' iconVertical>AR SDK</Embed8></div>
      <div style={{backgroundColor: '#464766'}}>Jini embed8 with content dark theme <Embed8 shortLink='jini' darkTheme>Dark</Embed8></div>
      <div>Jini embed8 with custom style 
        <Embed8
          shortLink='jini'
          style={{padding: '0.25em', borderRadius: '0.25em', backgroundColor: '#844', color: '#ddf'}}
        >
          Some text
        </Embed8>
      </div>
    </React.Fragment>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
