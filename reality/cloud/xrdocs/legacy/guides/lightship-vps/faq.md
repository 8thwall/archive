---
sidebar_label: FAQ
sidebar_position: 5
---

# VPS FAQ {#lightship-vps-faq}

## What is Lightship VPS? {#what-is-lightship-vps}

Lightship VPS (Visual Positioning System) is a cloud service that enables applications to localize a 
user's device at real-world locations, enabling users to interact with persistent AR content and 
powering new immersive experiences. VPS determines the device's position and orientation (pose) by 
referencing map data that exists in Niantic's cloud.

## How does VPS work? {#how-does-vps-work}

When a device makes a call to the VPS service, the service receives a query image from the user's 
device along with their rough location (from GPS) as inputs and attempts to localize them using the 
map(s) that exist at that location. If localization is successful, then the service returns the 
device's position and orientation (pose) corresponding with the timestamp of the image that was 
transmitted. Because there is a time delay between when a VPS query image is captured and when a 
response is received from the VPS service, the device needs to have a motion tracking system in 
order to stay accurately localized while moving. When the VPS service returns a pose estimate to the 
device, the difference in pose from the device's tracking system is added to the localization 
response so that VPS can “keep up” with how the device moved while waiting for the server’s response 
to the VPS query.

## What is a scan? {#what-is-a-scan}

AR scans from players, developers, and surveyors are the fundamental ingredient used to create the 
Niantic Map: Niantic’s 3D map of the world. AR scans are recorded and uploaded using Niantic's AR 
scanning framework, which is a module used inside Pokemon Go, Ingress, and the Wayfarer App. Each AR 
scan consists of a series of video frames with supporting data from accelerometers and GPS sensors 
that construct a 3D model of the world from multiple 2D images. AR scans are used by Niantic to 
build maps and meshes of real-world locations.

## What is a map? {#what-is-a-map}

In VPS parlance, a map is the data artifact that is used to localize your device when the VPS API is 
called. A map can be thought of as a function that takes a query image as input and then returns 
position and orientation (pose) as output. The map that corresponds to a given location is created 
from the scans that were uploaded at that location. VPS maps are not human-readable.

## What is a mesh? {#what-is-a-mesh}

In VPS parlance, a mesh is a 3D model of a real-world location or object. Meshes provide a detailed 
representation of a physical space or object, and are useful for understanding what a location looks 
like, as a reference for authoring AR content, and for creating physics and occlusion effects. Like 
maps, meshes that correspond to a given location are created from the scans that were uploaded at 
that location. Meshes are both human- and machine-readable.

## Where can I use VPS? {#where-can-i-use-vps}

VPS is available at over 150,000 real-world locations, with more locations being added every day. In 
order for a location to be available on VPS, a sufficient amount of AR scan data must be uploaded at 
that location and the VPS activation process must be completed. Developers can add new locations to 
the map and request VPS activation of fully scanned locations using the Geospatial Browser.

## How does VPS activation work? {#how-does-vps-activation-work}

For a location to be eligible for VPS activation, it must have at least 10 scans uploaded that pass 
minimum quality checks, and the time difference between the oldest and newest scans at the location 
must be at least 5 hours. These requirements ensure that the resulting maps and meshes are of 
sufficient quality and capture enough variation such that users will be able to localize reliably. 
The VPS activation process runs on Niantic's AR mapping infrastructure and involves many complex 
steps. From the pool of eligible scans at the location, an algorithm selects most of the scans to 
use for building maps and meshes, and the remaining handful for validation and measuring
localization quality. The activation process for a location runs on Niantic servers and usually 
takes 1-2 hours to complete.

## Can I find my scans after VPS activation is done? {#can-i-find-my-scans-after-vps-activation-is-done}

During the activation process, the maps and meshes created from the uploaded scans are fused
together in order to incorporate as much information as possible. The final product, which is used 
by developers to author content and by users to localize, consists of scans from many different
sources. Scan data are mixed together to create a more comprehensive representation of the location, 
so there is not a one-to-one relationship between the scans that are uploaded at a location and the
maps and meshes that area created once it is VPS-activated.

## Can I add more scans to a location that's already activated? {#can-i-add-more-scans-to-a-location-thats-already-activated}

In some cases, developers may wish to add additional scans to a location that was previously 
activated in order to improve the quality and the coverage of the location's maps and meshes. In 
order for a Location to be eligible for "reactivation," it must have had at least 5 additional scans 
uploaded since the last time it was activated. Importantly, it is not yet possible to add new scans 
to an existing fused map, rather, the process of reactivating requires a new fused map to be built 
that incorporates the new scans in the context of the existing ones.

## How do I request VPS activation of a new location? {#how-do-i-request-vps-activation-of-a-new-location}

Once a location has enough scans uploaded to meet the VPS activation requirements (at least 10 total 
scans with at least a 5-hour time difference between the oldest and newest scans), developers can 
request VPS activation by selecting the location in the Wayfarer App or the Geospatial Browser and 
pressing the “activate” button. This will add the location to the activation queue. Typically, an 
activation request is completed within 2 hours. Developers also have the option to request 
reactivation of an existing location once 5 additional scans are uploaded.

## Does VPS work at night or in poor weather conditions? {#does-vps-work-at-night-or-in-poor-weather-conditions}

VPS works best when there is good visibility. In order to maximize the likelihood of successful 
VPS-powered experiences, it is best to upload many AR scans that cover a wide swath of different 
conditions (e.g. different times of day, different weather conditions, etc.). For example, if you 
are building an experience in a location that gets a lot of rain, having some scans from a rainy day 
is very helpful.

## Do AR scanning and VPS require phones with LiDAR sensors? {#do-ar-scanning-and-vps-require-phones-with-lidar-sensors}

AR scanning and VPS do not require LiDAR.
