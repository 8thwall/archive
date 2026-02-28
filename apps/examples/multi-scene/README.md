# A-Frame: React - Multiple Scenes

This project demonstrates how to build a React app with multiple A-Frame scenes using custom components, systems, and camera pipeline modules.

To cleanly register components, systems, and primitive across all of A-Frame scenes, import needed components to the scene .tsx files and pass them to the component/system/primitive prop of <AFrameScene>.


If you're using components which add custom pipeline modules, you need to remove them when the user leaves the scene. Custom camera pipeline modules can be removed in the click event handler of the <FloatingBackButton>.

![](https://media.giphy.com/media/dIXKT7L6vBVZCD9g4h/giphy.gif)

