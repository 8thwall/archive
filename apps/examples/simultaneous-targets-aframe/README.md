# A-Frame: Simultaneous Image Targets

This project is a spin-off of 8th Wall's [Art Gallery](https://www.8thwall.com/8thwall/artgallery-aframe) 
project and introduces a ```simultaneous-targets``` component that can detect one of these situations:

* A certain number of image targets are detected at the same time
* A specific set of image targets are detected at the same time

Once the quantity or list of image targets is detected, a 3d model is spawned.

![](https://media.giphy.com/media/2Pz67JescmbvAMSeCs/giphy.gif)

After launching this demo, scan these image targets:

![](https://cdn.8thwall.com/web/img/readme/gallery.png)

Notes:

The ```simultaneous-targets``` component takes the following parameters:

* targetQuantity: The number of image targets you want the user to detect simultaneously.
* targetList: A specific list of image targets you want the user to detect simultaneously.

Note: specify either ```targetQuantity``` or ```targetList``` but not both.

Example:

```simultaneous-targets="targetQuantity: 2"```

or

```simultaneous-targets="targetList: image1, image2"```


## Attribution

Present 3d model from [Google Poly](https://poly.google.com/view/8wyQNiCKMBP)


