declare const React: any

function CoreAssetsView() {
  return (
    <React.Fragment>
      <p>You should see Niantic 5 Year Background image right below taking up 75% of the view height horizontally.</p>
      <img style={{width: '75vh'}} crossOrigin='anonymous' src={require('../assets/home/NIA_5Year-BG_4.jpg')}></img>
    </React.Fragment>
  )
}

export {CoreAssetsView}
