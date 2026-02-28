---
sidebar_label: projectWayspots()
---
# XR8.Vps.projectWayspots()

`XR8.Vps.projectWayspots()`

## Description {#description}

Query data about each of your Project Locations.

## Parameters {#parameters}

None

## Returns {#returns}

A promise with an array of `ClientWayspotInfo`, which contains data about each of your Project Locations.

`[{id, name, imageUrl, title, lat, lng }]`

Property | Type | Description
-------- | ---- | -----------
id | `String` | id for this Location, only stable within a session.
name [Optional] | `String` | A reference to a Project Location.
imageUrl | `String` | URL to a representative image for this Location.
title | `String` | The Location's title.
lat | `Number` | Latitude of the Project Location.
lng | `Number` | Longitude of the Project Location.

## Example {#example}

```javascript
// Log the Project Locations.
XR8.Vps.projectWayspots().then((projectLocations) => {
  projectLocations.forEach((projectLocation) => {
    console.log('projectLocation: ', projectLocation)
  })
})
```
