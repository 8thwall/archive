# A-Frame: PLY Loader

Load PLY files in your A-Frame project, allowing the rendering of point cloud models in WebAR.

![](https://media.giphy.com/media/mXU5RAc6IMx4jlywJC/giphy.gif)

```<ply-model>``` renders a ply file as either a point cloud or mesh.

- src: the path to the ply asset bundle (New asset bundle -> Other.. -> Main File: filename.ply -> Create)
- mesh: if true, generates a mesh from the point cloud (default: false)
- size: size of the rendered points (default: 1)

```bench.ply``` and ```tree.ply``` files from 3D Scanner App by Laan Labs. Captured on iPhone 12 Pro Max.
