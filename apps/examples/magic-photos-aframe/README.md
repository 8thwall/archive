# A-Frame: Magic Photos

This uses a custom component called xrextras-target-video-fade to fade in videos that autoplay + loop
when found and hide when lost.

![](https://media.giphy.com/media/dsupDLV16PWzwylC5G/giphy.gif)

```<xrextras-named-image-target>``` tracks an image target. Add content inside to copy the 
transforms from the tracked target to its children.

- name: the name of the image target as it appears on the "Image Targets" page

```<xrextras-target-video-fade>``` automatically fades video in and begins playback (muted only).

- video: the id of the <video> element used for playback
- height: scale the generated geometry height by this value (default: 1)
- width: scale the generated geometry width by this value (default: 1)

Point your device at the image targets below:

![](https://cdn.8thwall.com/web/img/readme/beach3-sm.jpg)
![](https://cdn.8thwall.com/web/img/readme/beach2-sm.jpg)
![](https://cdn.8thwall.com/web/img/readme/beach1-sm.jpg)
![](https://cdn.8thwall.com/web/img/readme/beach4-sm.jpg)
