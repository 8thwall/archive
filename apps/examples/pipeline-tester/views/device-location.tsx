declare const React: any
declare const XR8: any

const DeviceLocationView = () => {
  const [coordinates, setCoordinates] = React.useState({})
  const [timestamp, setTimestamp] = React.useState(0)
  const [error, setError] = React.useState('')

  const successFunc = (pos: Position): void => {
    setCoordinates(pos.coords)
    setTimestamp(pos.timestamp)
  }
  // NOTE(dat): We need to change Position to GeoPosition when we upgrade Typescript to 4.1x+
  const errorFunc = (err: PositionError): void => {
    setError(`${err.code} ${err.message}`)
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      return
    }

    navigator.geolocation.getCurrentPosition(successFunc, errorFunc, {
      maximumAge: 0, // no cache please
      enableHighAccuracy: true,
    })
    
  }
  // Sensor APIs
  React.useEffect(() => {
    if (!navigator.geolocation) {
      setError('No geolocation available on navigator')
    } else {
      getCurrentLocation()
    }
  }, [])

  return (
    <div className='container'>
      <h1>Device Location APIs</h1>
      <p>Instructions: click "Get Current Location". You should not see a red message about low precision GPS.</p>
      <button onClick={getCurrentLocation}>Get Current Location</button>
      {error && <p>Error: {error}</p>}
      <p>Coordinates</p>
      {coordinates.accuracy > 1000 && <strong style={{color: 'red'}}>GPS in LOW precision mode</strong>}
      <p>Lat: {coordinates.latitude} Lng: {coordinates.longitude} Accuracy (95% confidence in meters: {coordinates.accuracy}</p>
      <p>Heading: {coordinates.heading} Speed: {coordinates.speed}</p>
      <p>Altitude: {coordinates.altitude} Alt Accurarcy: {coordinates.altitudeAccuracy}</p>
      <p>Timestamp</p>
      <p>{timestamp}</p>
    </div>
  )
}

export {DeviceLocationView}
