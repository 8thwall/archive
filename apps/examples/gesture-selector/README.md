# A-Frame: Gesture Selector

This example allows the user to position, scale, and rotate an objects idividually.

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZG0wc2MycHY4YnFtaHBpa2lqdjB2NXp5OGpqbGVmOXo5cG95cXptaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/GRjZagH8PtvbqWPxQP/giphy-downsized-large.gif)

### About this project

This project allows users to tap on specific entities in the scene and position, scale, and rotate an objects idividually. 
A highlight component is also used to show the user what entity they have clicked on.

### Project Components

`xrextras-gesture-detector` is required in your `<a-scene>` for xrextras gesture components
to function correctly.

`gesture-selector` needs to be added to all entties in the scene that you want the user to be able to position, scale, and rotate individually. 

`highlight` is a component that is used in the gesture-selector component. This adds an emissive material to your entities. 
This component highlight color and intensity can be customized. 

