*A-Frame: Curved Image Target (CLOSED BETA)*

TODO(RIGEL): REAL DEAL README

Welcome to the Curved Image Target Closed Beta! This A-Frame example project showcases multiple 
curved image targets in a single scene. The front label generates a 'container' with 3D content inside 
and the back label generates surface geometry that a video material is applied to.

*Using Curved Image Targets*

1. Download the 'back-label-beta.jpg' and 'front-label-beta.jpg' from the /assets/image-target-files
folder and print to a reasonable label size.

2. Affix the two images to the front and back of a cylindrical object (i.e. wine bottle) and adjust
the 'Curve Amount' slider to match the object's shape or input measurements directly with 'Advanced'. 
Be sure to use 'Test it Out' for a quick preview without the need to modify project code.

3. Scan the 'Preview' QR code above and give it a spin!

If you don't have access to a printer, you can get started quickly by taking a photo of any 
flat image/label, wrapping it around a cylinder, and visually estimating the 'Curve Amount' value.

NOTE: When uploading your own curved image targets, be sure the image file you upload has already been 
cropped for the ENTIRE LABEL REGION. The pre-upload crop action corresponds to the ACTIVATION REGION
or the area that the engine will recognize and track. Make sure this is the most feature-rich portion
of your entire label.

*Using the included A-Frame components*

Each of the three components featured in the scene are located in the /components folder:

```curved-image-target```

This component tracks curved image targets and optionally generates cylindrical geometry that 
matches the uploaded target curvature.

name: the name of the image target as it appears on the "Image Targets" page
geometry: "full" "label" or "none" (default: label)
  - "full" ignores the theta length of the uncropped label and generates a full open-faced cylinder
  - "label" generates a cylinder that matches the size of the uncropped, uploaded image target
  - "none" does not generate geometry (useful for just curved image target tracking)
height: scale the generated geometry height by this value (default: 1)
width: scale the generated geometry width by this value (default: 1)

```curved-target-container```

This component tracks curved image targets and generates a series of cylinder meshes that 
form a portal-like container that 3D content can be placed inside. The effect works through a 
combination of "interior" geometry that is visible to the user and "hider" geometry that blocks 
rendering outside the interior's opening. The generated cylinder proportions match that of the
uploaded target curvature. 

name: the name of the image target as it appears on the "Image Targets" page
color: the color of the interior geometry (default: #464766)
height: scale the generated geometry height by this value (default: 1)
width: scale the generated geometry width by this value (default: 1)

```curved-target-video```

This component tracks curved image targets and generates cylindrical geometry that matches the
uploaded target curvature for use with video playback.

name: the name of the image target as it appears on the "Image Targets" page
video: the id of the <video> element for playback
thumb: the id of the <img> element to serve as a thumbnail (optional)
autoplay: enable autoplay on initial image found event; requires muted on <video> (default: true)
canstop: enable paused/played on tap (default: true)
height: scale the generated geometry height by this value (default: 1)
width: scale the generated geometry width by this value (default: 1)

If you have any questions or feedback, let us know in the slack channels... and have fun! :)

*Attribution*

Jellyfish by [Google Poly](https://poly.google.com/view/dA5osnS0Rzj)

