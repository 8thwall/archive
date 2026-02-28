---
sidebar_position: 3
---

# Scanning Locations

## Scaniverse for Niantic Developers {#scaniverse-for-niantic-developers}

Scaniverse for Niantic Developers seamlessly integrates
the Geospatial Browser (GSB) with the award-winning scanning experience in Scaniverse. This
significantly streamlines developer workflows around browsing the map, adding locations, and of
course scanning:

* We’ve made the Geospatial Browser (GSB) mobile-friendly so that it can be effectively used within
Scaniverse to browse the map, inspect locations, add locations, and request VPS activation
* Simplified login flow using a simple QR code that links Scaniverse with your 
8th Wall account.
* We have adopted Scaniverse’s existing UI to power creation and uploading of scans
* We’ve enabled testing localization at VPS-activated locations within Scaniverse
* We’ve integrated our latest improvements to map filtering to make it easier than ever to find the 
location(s) you are looking for

### Linking Scaniverse with the Geospatial Browser (GSB) {#linking-scaniverse-with-the-geospatial-browser}

**Prerequisite**: Install Scaniverse from the iOS [App Store](https://apps.apple.com/us/app/scaniverse-3d-scanner/id1541433223). Support for Android devices is coming soon.

1. Log in to your 8th Wall account on your desktop. Open the **Geospatial Browser (GSB)**, select any
location on the map, and then select **View Details**. In the bottom right corner of the location
details card, press **Generate QR Code**. A QR code will be displayed.

![Scaniverse1](/images/scaniverse1.png)

2. Scan the **QR code** with your Camera app. Open the Camera app on your phone, point it at the QR code. 

3. Tap on the **Scaniverse** link that appears. This will link Scaniverse with your 8th Wall
developer account. This only needs to be done once. 
:::info
**Make sure to allow www.8thwall.com to use
your current location when prompted; this is required for proper operation of the GSB interface.**
:::

![Scaniverse2](/images/scaniverse2.png)

4. Once you have linked Scaniverse to GSB, you will be able to return to the GSB screen at any time
by tapping the **GSB button** in the bottom ribbon of the Scaniverse app. Note that you may unlink
Scaniverse from GSB at any time by going to the **Settings** menu and toggling off the **Niantic
Developer Mode** option.


5. All of the scans you have taken outside of Niantic Developer Mode will remain accessible when
linking/unlinking Scaniverse with GSB. 

![Scaniverse3](/images/scaniverse3.png)

### Browsing the GSB Map in Scaniverse

1. Tapping on the **Person** icon will allow you to select your 8th Wall Workspace.

2. Tapping on the **Upload** button will allow you to select location scans to upload. Note that
only scans that originate from Niantic Developer Mode (using the Add Scans or Test Scan options) can
be uploaded to Niantic for VPS activation purposes.

3. Tapping on the **Plus** button will allow you to create new locations and test scans.

4. Tapping the **Layers** button will toggle on the satellite view of the map.

5. Tapping the **Reticule** button will center the map on your location.

6. Tapping the **Compass** button will return the map to its default, north-up orientation.

7. The **Controls** button will allow you to apply filters to the locations that appear on the map
based on their size, category, or activation status.

8. The **Magnifying Glass** button will allow you to search the map.

9. Tapping on the **X** button will close the GSB and return you to the Scaniverse home screen.

![Scaniverse4](/images/scaniverse4.jpg)

10. Selecting a location on the map will bring up a **Preview** screen, which can be tapped for more
details.

11. If you’ve selected a VPS-activated location, you can tap the **Test VPS** button to verify that
localization works.

12. To create a scan to add to a particular location, tap the **Add Scans** button of the respective
location. Note that you must be near the location in order for the Add Scans option to be available.

![Scaniverse5](/images/scaniverse5.png)

### Creating and Uploading Scans

1. The **Record** button is used to start and stop the scanning process.

2. The **Pause** button can be used to temporarily suspend the scanning process if desired.

3. The **Time** display indicates the duration of the current scan. A minimum length of 15 seconds
is required for a scan to be viable for upload for VPS development purposes. A scan length of 30-60
seconds is ideal (scans in excess of 60 seconds are split into multiple pieces for processing
purposes).

4. Tapping on the **X** button will return you to the Scaniverse home screen.

![Scaniverse6](/images/scaniverse6.png)

5. When you have completed a scan, you will be able to inspect a **Preview Mesh** of the scene that
you captured.

6. If you are happy with your scan you may choose to upload it immediately by pressing the **Upload
Scan** button.

7. You may also elect to **Upload Later** if you’d like to use a WiFi connection (recommended).

8. If you are not happy with your scan, you can discard it by pressing the **Delete** button.

![Scaniverse7](/images/scaniverse7.png)

## Installing Niantic Wayfarer {#installing-niantic-wayfarer}

We currently only support Wayfarer App on iOS which is an alternative to scaniverse. To scan new VPS
Locations or add scans to previously activated Locations, please see below for installation and
usage instructions. 

### iOS {#ios}

The Niantic Wayfarer App requires iOS 12 or later and an iPhone 8 or later. A LiDAR-capable device
is **not** required.

To install the Niantic Wayfarer App, go to
[Testflight for Niantic Wayfarer](https://testflight.apple.com/join/VXu1F2jf)
([8th.io/wayfarer-ios](https://8th.io/wayfarer-ios))
on your iOS device.

## Using Niantic Wayfarer {#using-niantic-wayfarer}

You can add scans to [Public Locations](./vps-locations.md#location-types) as well as create
[Test Scans](./vps-locations.md#test-scans) with the Niantic Wayfarer App.

Once you have installed the app, login with your 8th Wall credentials by pressing the _Login with
8th Wall_ button.

If you have access to multiple workspaces, select a workspace by pressing the _8th Wall Workspace_
dropdown on the profile page.

Login Page | Profile Page
---------------------- | ------------------------
![wayfarer app login](/images/wayfarer-app-login.jpg) | ![wayfarer app profile](/images/wayfarer-app-profile.jpg) |

On the _Map_ page, select a VPS Location to add a scan to a public Location (1), or select _Scan_ to add a test scan to your workspace (2).

Take a scan of the area using the recommended [scanning technique](#scanning-technique).

Map Page | Scanning Page
---------------------- | ------------------------
![wayfarer add scan](/images/wayfarer-add-scan.jpg) | ![wayfarer scanning](/images/wayfarer-scanning.jpg) |

Once the scan has been completed, select either public or test, and then upload.

Scan Type | Scan Upload
---------------------- | ------------------------
![wayfarer scan type](/images/wayfarer-scan-type.jpg) | ![wayfarer scan upload](/images/wayfarer-scan-upload.jpg) |

Processing scans can take 15-30 minutes. Once processed, scans will populate in the geospatial browser.

Issues related to scanning or processing should be directed to [support@lightship.dev](mailto://support@lightship.dev).

You can find more information on how to use the Wayfarer app in the [Lightship documentation](https://lightship.dev/docs/ardk/vps/generating_scans.html#using-the-niantic-wayfarer-app).

## Scanning Technique {#scanning-technique}

Scanned VPS-activated locations should be no larger than a 10-meter diameter around the location.
For example, a typical statue would work as a VPS-activated Location. An entire building, however,
would not. One face or doorway/entrance into a building might work. We recommend sticking with
smaller areas to start (e.g. a desk, statue, or mural).

Before scanning, be aware of your surroundings and ensure you have the right to access the location
you are scanning.

1. Check the area to be scanned and the surroundings of the scanned object to determine if there 
are any obstacles and to select a scanning route. It is necessary to plan the route you intend to 
use for scanning before starting the procedure.

2. Make sure your camera is in focus. Camera shake can negatively affect 3D reconstruction. Keep 
your phone as close to your side as possible to avoid blurring. Walk around the object you are 
scanning instead of standing in one location and moving your phone.

3. Walk at a slow and natural stroll pace. Move slowly and smoothly during scanning. Sudden changes 
of direction are a definite no-no. Move slowly and smoothly with your feet on the ground. If you are 
scanning in a darker setting, it’s even more important to move slowly and smoothly. Move the phone 
with you while you are moving (think crab walk).

4. VPS Location should always be the focal point. In order for us to build the map, it's important 
to focus on the VPS Location and capture the full 360° orbit of it. If it is not safe or not 
possible to get 360° coverage, capture as much as you can.

5. Vary your distance/angles (0-10m or 0-35ft). In order for the 3D map to work well in different 
scenarios, it’s important that we capture the environment around the Location and have a variety of 
different scans. It’s important to vary your distance and angles while scanning the Location.

Video of recommended VPS Location scanning technique:

````mdx-code-block
<iframe width="560" height="315" src="https://www.youtube.com/embed/FYS3fe5drf0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
````

#### Things to avoid while scanning {#things-to-avoid-while-scanning}

1. Avoid scanning while the surroundings are not safe, e.g. in the middle of the road, or in a 
playground with children.

2. Avoid scanning while the Location is too far away (>10m or 35ft) or too big to focus your camera 
on.

3. Avoid scanning while you are casually taking a walk or jogging. It is important to keep the 
Location as your focal point at all times.

4. Avoid pointing your phone at very bright objects such as a fluorescent light or the sun.

5. Avoid not moving or moving too fast while scanning. Abrupt motions will cause offsets in the 
reconstruction.

6. Avoid scanning if your phone gets too hot. If the temperature of the device rises too high, the 
performance of the device will be greatly reduced, which will negatively affect the scan.

7. Avoid uploading any scans that look incomplete or not representative of what you're trying to 
scan.