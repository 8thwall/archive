# A-Frame: Smart Recenter

Example of recentering XR at the current camera position over a given distance. Useful for preventing drift over long distances.

![](https://media.giphy.com/media/h73jAnAZcK1CwaO20N/giphy.gif)

## Components

### recenter

Add recenter functionality with auto smart recenter after moving a certain distance. 

recenterDistance: { default: 0 }, // 0 means don't auto recenter, ex. 10 means auto recenter after moving 10 units
recenterHeight:   { default: 0 }, // 0 means don't adjust height, ex. 5 means recenter to height of 5
recenterFactor:   { default: 0 }, // 0 means when adjusting height, go all the way, ex. .75 means go 3/4 of the way towards recenterHeight

### treadmill

Shows a grid of arrows that let you visualize tracking, ground height, and scale, while moving with the camera

Also displays camera's current [x,z] position inside label at top left corner

### path-display (displayed at top right)
 
Displays a map of past camera positions on the x,z plane

### height-display (displayed at top left)

Displays a graph of past camera heights over time