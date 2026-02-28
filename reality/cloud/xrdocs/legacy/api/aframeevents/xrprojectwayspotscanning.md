# xrprojectwayspotscanning

## Description {#description}

This event is emitted by [`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps) when all Project Locations have been loaded for scanning.

`xrprojectwayspotscanning.detail : { wayspots: [] }`

Property  | Description
--------- | -----------
wayspots: [] | An array objects containing Location information.

`wayspots` is an array of objects with the following properties:

Property  | Description
--------- | -----------
id | An id for this Project Location that is stable within a session
name | The Project Location name.
imageUrl | URL to a representative image for this Project Location.
title | The Location title.
lat | Latitude of this Project Location.
lng | Longitude of this Project Location.
