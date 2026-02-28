# A-Frame: Art Gallery

This example uses image targets to show information about paintings in AR. This showcases image
target tracking, as well as dynamic content loading using the 
[xrextras-generate-image-targets](https://github.com/8thwall/web/blob/master/xrextras/src/aframe/xr-components.js#L124)
component.

## Try it out

Here's what you should see in this demo:

![artgallery-screenshot](https://static.8thwall.app/assets/artgallery-screenshot-79s4v7i8k4.jpg)

On your phone, [try the live demo here](https://8thwall.8thwall.app/artgallery-aframe), or scan
the QR code in this image.  From the web app, scan these images, and tap on found images to see more
information.

![artgallery](https://static.8thwall.app/assets/gallery-n43fz3cxdf.jpg)

## Custom Metadata

This example uses image target metadata link specific data to the image targets themselves. The 
following metadata is added to the corresponding image target in the project's settings to make it
available to the app at runtime.

```
{
  "title":"A Sunday Afternoon on the Island of La Grande Jatte",
  "artist":"Seurat",
  "date":"1884"
}

{
  "title":"Monet Tulip Fields With The Rijnsburg Windmill",
  "artist":"Monet",
  "date":"1886",
  "wikiTitle":"Claude Monet"
}

{
  "title":"The Starry Night",
  "artist":"Van Gogh",
  "date":"1889"
}

{
  "title":"Mona Lisa",
  "artist":"Da Vinci",
  "date":"1503-1506"
}

{
  "title":"Claude Monet painting in his Garden at Argenteuil",
  "artist":"Renoir",
  "date":"1873",
  "wikiTitle":"Pierre-Auguste Renoir"
}
```
