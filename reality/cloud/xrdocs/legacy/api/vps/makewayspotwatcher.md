---
sidebar_label: makeWayspotWatcher()
---
# XR8.Vps.makeWayspotWatcher()

`XR8.Vps.makeWayspotWatcher({onVisible, onHidden, pollGps, lat, lng})`

## Description {#description}

Create a watcher to look for all VPS activated Locations, not just Project Locations.

## Parameters {#parameters}

Parameter | Description
--------- | -----------
onVisible [Optional] | Callback that is called when a new Location becomes visible within a 1000 meter radius.
onHidden [Optional] | Callback that is called when a Location you previously saw is no longer within a 1000 meter radius from you.
pollGps [Optional] | If true, turns on GPS and calls ‘onVisible’ and ‘onHidden’ callbacks with any Locations found/lost through GPS movement.
lat [Optional] | If `lat` or `lng` is set, calls `onVisible` and `onHidden` callbacks with any Locations found/lost near the set location.
lng [Optional] | If `lat` or `lng` is set, calls `onVisible` and `onHidden` callbacks with any Locations found/lost near the set location.

## Returns {#returns}

An object with the following methods:

`{dispose(), pollGps(), setLatLng()}`

Method | Description
------ | -----------
dispose() | Clears state and stops gps. Updates and will no longer call any callbacks.
pollGps(Boolean) | Turn on or off gps updates.
setLatLng(lat: Number, lng: Number) | Set the watcher's current location to `lat` / `lng`.

## Example {#example}

```javascript
const nearbyLocations_ = []

// Records the time between getting each location from the wayspotWatcher.
let gotAllLocationsTimeout_ = 0

const onLocationVisible = (location) => {
 nearbyLocations_.push(location)

 window.clearTimeout(gotAllLocationsTimeout_)
 gotAllLocationsTimeout_ = window.setTimeout(() => {
   // We get the locations individually.  If want to only perform an operation
   // after we have gotten all the nearby ones, we could do that here.
 }, 0)
}

const onLocationHidden = (location) => {
 const index = nearbyLocations_.indexOf(location)
 if (index > -1) {
   foundProjectLocations_.splice(index, 1)
 }
}

const onAttach = ({}) => {
 wayspotWatcher_ = XR8.Vps.makeWayspotWatcher(
   {onVisible: onLocationVisible, onHidden: onLocationHidden, pollGps: true}
 )
}

const onDetach = ({}) => {
  // Cleanup the watcher
 wayspotWatcher_.dispose()
}

```
