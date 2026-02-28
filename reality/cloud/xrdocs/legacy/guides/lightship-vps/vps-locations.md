---
sidebar_position: 2
---

# VPS Locations

## Managing Locations {#managing-locations}

The Geospatial Browser can be accessed from within your Project by selecting the map icon in the
left hand menu (annotated as #1 in the image below). On this page you will find a map view (#2)
which you can use to search to find VPS-activated Locations. Selecting a VPS-activated
location will display the 3D mesh of the location (#3) so you can verify you have selected the
correct location and add it to your project (#4).

![ConsoleGSB](/images/console-geospatial-browser.jpg)

When you add a VPS-activated Location to your project you will see the Location in the "Project
Locations" table in the Geospatial Browser (annotated as #1 in the image below). Once you have a
Location in the “Project Locations" table you can use the "Download" button (#2) to download a GLB or
OBJ (toggle shown as #3) version of the 3D mesh and open it in third-party 3D software applications,
such as Blender, or import it directly into your 8th Wall project. When referencing Locations in
your project code you will need to copy the "Name" field (#4) from the "Project Locations" table.

![ConsoleGSBManageWayspots](/images/console-geospatial-browser-manage-wayspots.jpg)

If the location you'd like to use in your project is not available as a VPS Location, you can create
the location by following the instructions in the
[Create New Location](#create-new-location) section.

## Create New Location {#create-new-location}

1. Click on an open spot on the map to select where you’d like to create a new VPS Location. See
[VPS Location Requirements](#location-requirements) to learn more about choosing a good spot to
create a VPS Location.

![ConsoleCreateWayspot](/images/console-create-wayspot.png)

2. Workspaces on `Pro` or `Enterprise` plans will have the option to **Create Public Location** or
**Create Private Location**. Public Locations are accessible to all developers and people using
their projects, while Private Locations will only be visible and accessible to your workspace and
its projects. Creating a Public Location is the correct choice for most projects; Private Locations
are a premium feature for developers that need to create special access-controlled or temporary VPS
experiences. Click either the **Create Public Location** or the **Create Private Location** button
to start the location creation process.

3. **Check for Duplicates**: Before creating a new Location, you are required to check that your
Location doesn't already exist. Compare your desired Location to others already on the map to ensure
that you are not creating a duplicate. If this is not a duplicate Location, you must check the **My
Location is not a duplicate** box and click on the **Next** button to continue.

![ConsoleCreateWayspotNoDuplicate](/images/console-create-wayspot-nodupe.png)

4. **Add Location Information**: Location metadata will be visible to developers using the
Geospatial Browser and can be visible to end-users. Remember that Niantic's Trust & Safety team uses
the information you provide to determine whether the Location meets our criteria to be made publicly
available. Once you have added the following information for the Location you are trying to create,
click on the **Submit** button:

* Title (125 characters)
* Description (250 characters)
* Category (1 or more)
* Image (if available)

5. Your location should immediately be added to your Location Submissions tab in the Geospatial
Browser with its type ("Public" or "Private") and the status ("Not Activated"). It will be available
for scanning within a few minutes and VPS activation can be requested once it's fully scanned.

## Location Requirements {#location-requirements}

When choosing any location for use with VPS, please consider the following:

* VPS works best at locations that are distinct and consistent in appearance (e.g. a sandy beach or
a crowded patio space with moveable furniture will not work well).
* Locations that are dominated by reflective or transparent features (e.g. windows and mirrors) are
not recommended.
* The larger the experience, the more scanning you will need to do to capture the space; the maximum
recommended size for a VPS experience today is 400 m^2 (20 x 20 m), though larger experiences can be
supported with careful scanning.

### Public Location Requirements {#public-location-requirements}

**Public Locations** are accessible to all developers and people using their projects and apps. When
adding a new Public Location, please consider the following guidelines:

* Public Locations should be permanent physical, tangible, and identifiable places or objects.
* Public Locations should be safe and publicly accessible by pedestrians.
* Make sure to include accurate information in the title, description, and photo to help your users
find the location.

### Private Location Requirements {#private-location-requirements}

**Private Locations** are a premium feature for developers that need to create special
access-controlled or temporary VPS experiences. They are only visible and accessible to the
workspace that created them. When creating a new Private Location, please consider the following:

* Private Locations are only discoverable by the workspace that created them, so they can only be
scanned and localized against by members and users of that workspace's projects.
* Private Locations are a good choice if you are building a special access-controlled experience
(e.g. on your or your client's private property).
* Private Locations are also an option if you're building an experience in a public location that
temporarily has a different appearance (e.g. a concert, museum exhibition, or other special event).

## Location Quantities {#location-quantities}

There is no limit to the number of Locations that can be associated with an 8th Wall project.
Locations are localized server side via the VPS service.

## Location Types {#location-types}

In the Geospatial Browser, you will see four different types of Locations:

Type | Icon | Description
---- | ---- | -----------
Public | ![WSPublic](/images/wayspot-type-public.png) | "Public" Locations have been approved by Niantic's Trust & Safety team and have met the required criteria of safety and public accessibility. These Locations may be used in published projects.
Pending | ![WSPending](/images/wayspot-type-pending.png) | "Pending" Locations are being reviewed by Niantic's Trust & Safety team to determine if they meet the required criteria of safety and public accessibility. **This process can take up to 2 business days.** Pending Locations can be scanned and activated while waiting for the review to complete.
Rejected | ![WSRejected](/images/wayspot-type-rejected.png) | "Rejected" Locations may have failed Niantic's Trust & Safety review, be a duplicate of an existing or previously rejected Locations, or may not be allowed by Niantic for another reason. These Locations cannot be added to projects.
Test | ![WSTest](/images/wayspot-type-private.png) | "Test" Locations are only accessible to your Workspace by scanning the location using Niantic's Wayfarer app. Test Locations are intended for use during development and may not be included in a published project.

For questions or issues related to creating VPS Locations, or to check the status of existing and existing Location, please contact [support@lightship.dev](mailto://support@lightship.dev)

## Location Status {#location-status}

In the Geospatial Browser, you will see five different statuses for VPS Locations:

Status | Icon | Description
---- | ---- | -----------
Not Activated | ![WSNotActivated](/images/wayspot-status-not-activated.png) | Locations with a status of 'Not Activated'  have not had any scans submitted for the location. A minimum of 10 viable scans must be submitted for the location before you will be able to request activation. After one scan is submitted the Location status will change to 'Scanning'.
Scanning | ![WSScanning](/images/wayspot-status-scanning.png) | Locations with a status of 'Scanning' have had at least one scan submitted for the location. A minimum of 10 viable scans must be submitted for the location before you will be able to request activation.
Processing | ![WSProcessing](/images/wayspot-status-processing.png) | Locations with a status of 'Processing' have had an activation request submitted and will display the 'Processing' status until the activation process has completed. **Typically, an activation request is completed within 4 hours. You will receive and email when the process is complete.**
Active | ![WSActive](/images/wayspot-status-active.png) | Locations with a status of 'Active' are available to be used in projects to create WebAR content using VPS for Web.
Failed | ![WSFailed](/images/wayspot-status-failed.png) | Locations with a status of 'Failed' encountered an issue during the activation process. This could be a result of a number of factors, such as poor suitability of the location for VPS, insufficient scans, or corrupt data. Unfortunately this means that this Location cannot be used to create WebAR content using VPS. We encourage you to find a new Location to use in your 8th Wall project.

For questions or issues related to Location scanning, activating or status, please contact [support@lightship.dev](mailto://support@lightship.dev)

## Location Quality {#location-quality}

After a Location has been VPS activated, Niantic provides a quality rating in the Geospatial browser.
Location details display either _Fair Quality_ or _Good Quality_.

Location Quality refers to the Location's ability to localize at any time. Locations with several scans
in all types of lighting tend to have a higher quality. Locations with minimum required scans or a
majority of scans in one type of lighting tend to have a lower quality.

Quality rating is an automated process and may not reflect the actual performance of the Location.
The best way to determine quality is to try it out yourself.

## Location Alignment {#location-alignment}

The unaligned warning can happen for various reasons and means localization against the mesh can not
be guaranteed. Although the mesh may work well for localization, the warning indicates the mesh is
experimental and should be used at your own risk.

Note: All **test** scans are unaligned.

## Location Events {#location-events}

8th Wall emits events at various stages in the Project Location lifecycle (e.g. scanning, found,
updated, lost, etc). Please see the API reference for specific instructions on handling these events
in your web application:

* [AFrame Events](/legacy/api/aframeevents)
* [PlayCanvas Events](/legacy/api/playcanvasevents/playcanvas-image-target-events)
* [XrController Dispatched Events](/legacy/api/xrcontroller/pipelinemodule/#dispatched-events)

## Test Scans {#test-scans}

Test scans are a single mesh, available to only one workspace, to develop and test VPS
experiences. While test scans are a great solution for developing and testing VPS experiences
while a public Location is being nominated or activated, they are not authorized for use in published
projects.

Test scans are created using the Niantic Wayfarer app. Ensure you’re logged in to Wayfarer using
8th Wall credentials and that the correct workspace is selected from the Profile page. The test
scan will only be available in the selected 8th Wall workspace at the time of scanning and
uploading. Scans can not be moved to a different workspace or Lightship account.

In the Wayfarer app, select _Scan_ and [take a scan of the area](/legacy/guides/lightship-vps#using-niantic-wayfarer).

Test scans should be 60 seconds or less; a new mesh is generated every 60 seconds – so scanning
for 120 seconds will result in 2 test scans. All test scans are
[unaligned](#location-alignment).

Once processed, you can preview the mesh and add it to your project from the geospatial browser
_Test Scans_ tab.

![Test scans tab](/images/private-scans-tab.jpg)

If your test scan fails processing, you may need to rescan. Reach out to
[support@lightship.dev](mailto://support@lightship.dev) for more information.
