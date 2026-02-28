# Platform API: Image Targets

The 8th Wall Image Target Management API enables developers to dynamically manage the **image target
library** associated with their 8th Wall powered WebAR projects. This API and accompanying
documentation is designed for developers familiar with web development & 8th Wall image targets.

**Before you begin:** Before you start using the Image Target API, your workspace needs to be on an
**Enterprise** billing plan. To upgrade, [contact sales](https://www.8thwall.com/licensing).

## Authentication {#authentication}

Authentication is provided by secret keys. Workspaces on an Enterprise plan can request an API Key.
You'll include this secret key in each request to verify the request is authorized. Since the key is
scoped to your workspace, the key will have access to all image targets inside all apps in that
workspace.

You can view your key on your account page.

![Visualization showing image targets inside apps, apps inside the workspace, and the API Key inside the workspace](/images/authentication-structure.png)

#### Important {#important}

The Image Target API key is a B2B key associated with your workspace. Follow best practices to
secure your API Key as publicly exposing your API key can result in unintended use and unauthorized
access. In particular please avoid:

- Embedding the Image Target API key in code that runs on a user's device or is publicly shared
- Storing the Image Target API key inside your application’s source tree

## Limits and Quotas {#limits-and-quotas}

- 25 requests per minute, with a burst allowance of 500, meaning you can make 500 requests in one
minute, then can make 25 requests per minute after that, or could wait 20 minutes and make another
500 requests.
- 10,000 requests per day.

**Note**: These limits only apply to the Image Target Management API, enabling developers to
dynamically manage the library of images associated with an 8th Wall project. **These limits are not
applicable to end-user activations of a Web AR experience.**

To request an increase to the Image Target API quota limits for projects in your workspace
please send a request to [support](mailto:support@8thwall.com).

## Endpoints {#endpoints}

- [Create image target](#create-image-target)
- [List image targets](#list-image-targets)
- [Get image target](#get-image-target)
- [Modify image target](#modify-image-target)
- [Delete image target](#delete-image-target)
- [Preview image target](#preview-image-target)

### Create image target {#create-image-target}

Upload a new target to an app's list of image targets

#### Request {#post-request}

```bash
curl -X POST "https://api.8thwall.com/v1/apps/$APP_KEY/targets" \
    -H "X-Api-Key:$SECRET_KEY" \
    -F "name=my-target-name" \
    -F "image=@image.png"\
    -F "geometry.top=0"\
    -F "geometry.left=0"\
    -F "geometry.width=480"\
    -F "geometry.height=640"\
    -F "metadata={\"customFlag\":true}"
    -F "loadAutomatically=true"
```

Field | Type | Default Value | Description
:-- |:-- | :-- | :--
image  | Binary data | | PNG or JPEG format, must be at least 480x640, less than 2048x2048, and less than 10MB
name | `String` | | Must be unique within an app, cannot include tildes (~), and cannot exceed 255 characters
type [Optional]| `String` | `'PLANAR'` | `'PLANAR'`, `'CYLINDER'`, or `'CONICAL'`.
metadata [Optional] | `String` | `null` | Must be valid JSON if `metadataIsJson` is true, and cannot exceed 2048 characters
metadataIsJson [Optional] | `Boolean` | `true` | You may set to false to use the metadata property as a raw string
loadAutomatically [Optional] | `Boolean` | `false` | Each app is limited to 5 image targets with `loadAutomatically: true`
geometry.isRotated [Optional] | `Boolean` | `false` | Set to true if the image is prerotated from landscape to portrait.
geometry.top | integer | | These properties specify the crop to apply to your image. It must be an aspect ratio of 3:4, and at least 480x640.
geometry.left  | integer |
geometry.width  | integer |
geometry.height  | integer |
geometry.topRadius | integer | | Only needed for `type: 'CONICAL'`
geometry.bottomRadius | integer | | Only needed for `type: 'CONICAL'`

#### Planar / Cylinder Upload Geometry {#planar--cylinder-upload-geometry}

This diagram shows how the specified crop is applied to your uploaded image to generate the
`imageUrl` and `thumbnailImageUrl`. The width:height ratio is always 3:4.

![Diagram showing how crop, rotation, and scale are applied to planar and cylinder image targets](/images/flat-geometry.jpg)

For a landscape crop, upload the image as rotated 90 degrees clockwise, set
`geometry.isRotated: true`, and specify the crop against the rotated image.

![Diagram showing how crop, rotation, and scale are applied to planar and cylinder image targets when isRotated is true](/images/rotated-geometry.jpg)

#### Conical Upload Geometry {#conical-upload-geometry}

This diagram shows how your uploaded image is flattened and cropped based on the parameters. The
uploaded image is in a "rainbow" format where the top and bottom edges of your content are aligned
to two concentric circles. If your target is narrower on the top than the bottom, specify `topRadius`
as the negative of the outer radius, and `bottomRadius` as the inner radius (positive). For a
landscape crop, set `geometry.isRotated: true`, and the flattened image will be rotated before having the
crop applied.

![Diagram showing how crop, rotation, and scale are applied to conical image targets](/images/cone-geometry.jpg)

#### Response {#post-response}

<span id="image-target-format">This is the standard JSON response format for image targets.</span>

```json
{
  "name": "...",
  "uuid": "...",
  "type": "PLANAR",
  "loadAutomatically": true,
  "status": "AVAILABLE",
  "appKey": "...",
  "geometry": {
    "top": 842,
    "left": 392,
    "width": 851,
    "height": 1135,
    "isRotated": true,
    "originalWidth": 2000,
    "originalHeight": 2000
  },
  "metadata": null,
  "metadataIsJson": true,
  "originalImageUrl": "https://cdn.8thwall.com/image-target/...",
  "imageUrl": "https://cdn.8thwall.com/image-target/...",
  "thumbnailImageUrl": "https://cdn.8thwall.com/image-target/...",
  "geometryTextureUrl": "https://cdn.8thwall.com/image-target/...",
  "created": 1613508074845,
  "updated": 1613683291310
}
```

Property | Type | Description
:-- | :-- | :--
name | `String`
uuid | `String` | Unique ID of this image target
type | `String` | `'PLANAR'`, `'CYLINDER'`, or `'CONICAL'`
loadAutomatically | `Boolean`
status | `String` | `'AVAILABLE'` or `'TAKEN_DOWN'`
appKey | `String` | The app the target belongs to
geometry | `Object` | See below
metadata | `String` |
metadataIsJson | `Boolean`
originalImageUrl | `String` | CDN URL for the source image that was uploaded
imageUrl | `String` | Cropped version of `geometryTextureUrl`
thumbnailImageUrl | `String` | 350px tall version of the `imageUrl` for use in thumbnails
geometryTextureUrl | `String` | For conical, this is an flattened version of the original image, for planar and cylinder, this is the same as `originalImageUrl`
created | integer | Creation date in milliseconds after unix epoch
updated | integer | Last updated date in milliseconds after unix epoch

#### Planar Geometry {#planar-geometry}

Property | Type | Description
:-- | :-- | :--
top | integer |
left |integer |
width | integer |
height | integer |
isRotated | Boolean  |
originalWidth | integer | Width of the uploaded image
originalHeight | integer | Height of the uploaded image

#### Cylinder or Conical Geometry {#cylinder-or-conical-geometry}

Extends the Planar Geometry properties with the alteration that `originalWidth` and
`originalHeight` refer to the dimensions of the flattened image stored at geometryTextureUrl.

Property | Type | Description
:-- | :-- | :--
topRadius | float
bottomRadius | float
coniness | float | Always 0 for `type: CYLINDER`, derived from `topRadius`/`bottomRadius` for `type: CONICAL`
cylinderCircumferenceTop | float | The circumference of the full circle traced by the upper edge of your target
targetCircumferenceTop | float | The length along your the upper edge of your target before having the crop applied
cylinderCircumferenceBottom | float | Derived from `cylinderCircumferenceTop` and `topRadius`/`bottomRadius`
cylinderSideLength | float | Derived from `targetCircumferenceTop` and the original image dimensions
arcAngle | float | Derived from `cylinderCircumferenceTop` and `targetCircumferenceTop`
inputMode | `String` | `'BASIC'` or `'ADVANCED'`. Controls what users see in the 8th Wall console, either sliders or number input boxes.

### List image targets {#list-image-targets}

Query for a list of image targets that belong to an app. Results are paginated, meaning if the app
contains more image targets than can be returned in one response, you will need to make multiple
requests to enumerate the full list of image targets.

#### Request {#list-request}

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets" -H "X-Api-Key:$SECRET_KEY"
```

Parameter | Type | Description
:-- | :-- | :--
by [Optional] | `String` | Specifies the column to sort by. Options are "created", "updated", "name", or "uuid".
dir [Optional] | `String` | Controls the sort direction of the list. Either "asc" or "desc".
start [Optional] | `String` | Specifies that the list starts with items that have this value in the `by` column
after [Optional] | `String` | Specifies that the list starts immediately after items that have this value
limit [Optional] | integer | Must be between 1 and 500
continuation [Optional] | `String` | Used to fetch the next page after the inital query.

#### Sorted List {#sorted-list}

This query lists the app's targets starting from "z" and going towards "a".

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets?by=name&dir=desc" -H "X-Api-Key:$SECRET_KEY"
```

#### Multiple sorts {#multiple-sorts}

You can specify a secondary "sort-by" parameter which acts as a tiebreaker in the case of duplicates in your first `by` value. `uuid` is used as a default tiebreaker if unspecified.

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets?by=updated&by=uuid" -H "X-Api-Key:$SECRET_KEY"
```

#### Specify a starting point {#specify-a-starting-point}

You can specify `start` or `after` values that correspond to the `by` values to specify your current position in the list. If you want your list to start immediately after the item with `updated: 333` and `uuid: 777`, you'd use:

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets?by=updated&by=uuid&start=333&after=777" -H "X-Api-Key:$SECRET_KEY"
```

This way, items with `updated: 333` are still included in the next page if their `uuid` comes after `777`. If an item's `updated` value is greater than `333`, but its `uuid` is less than `777`, it will still be included in the next page because the second `by` property only comes into play for tiebreakers.

It is not valid to specify an `after` value for the main sort while providing a `start` value for the tiebreaker sort. For example, it wouldn't be valid to specify `?by=name&by=uuid&after=my-name-&start=333`. This should instead be`?by=name&by=uuid&after=my-name-` because the second starting point only comes into play when the main starting point is inclusive (using `start`).

![Diagram showing how the by, start, and after parameters specify the starting point of the list](/images/image-target-sort.png)

#### Response {#list-response}

JSON object containing the property `targets`, which is an array of image target objects in the [standard format](#post-response).

If `continuationToken` is present, to fetch the next page of image targets, you'll need to specify `?continuation=[continuationToken]` in a followup request to get the next page of image targets.

```json
{
  "continuationToken": "...",
  "targets": [{
    "name": "...",
    "uuid": "...",
    "type": "PLANAR",
    "loadAutomatically": true,
    "status": "AVAILABLE",
    "appKey": "...",
    "geometry": {
      "top": 842,
      "left": 392,
      "width": 851,
      "height": 1135,
      "isRotated": true,
      "originalWidth": 2000,
      "originalHeight": 2000
    },
    "metadata": null,
    "metadataIsJson": true,
    "originalImageUrl": "https://cdn.8thwall.com/image-target/...",
    "imageUrl": "https://cdn.8thwall.com/image-target/...",
    "thumbnailImageUrl": "https://cdn.8thwall.com/image-target/...",
    "geometryTextureUrl": "https://cdn.8thwall.com/image-target/...",
    "created": 1613508074845,
    "updated": 1613683291310
  }, {
    "name": "...",
    "uuid": "...",
    "type": "CONICAL",
    "loadAutomatically": true,
    "status": "AVAILABLE",
    "appKey": "...",
    "geometry": {
      "top": 0,
      "left": 0,
      "width": 480,
      "height": 640,
      "originalWidth": 886,
      "originalHeight": 2048,
      "isRotated": true,
      "cylinderCircumferenceTop": 100,
      "cylinderCircumferenceBottom": 40,
      "targetCircumferenceTop": 50,
      "cylinderSideLength": 21.63,
      "topRadius": 1600,
      "bottomRadius": 640,
      "arcAngle": 180,
      "coniness": 1.3219280948873624,
      "inputMode": "BASIC"
    },
    "metadata": "{\"my-metadata\": 34534}",
    "metadataIsJson": true,
    "originalImageUrl": "https://cdn.8thwall.com/...",
    "imageUrl": "https://cdn.8thwall.com/...",
    "thumbnailImageUrl": "https://cdn.8thwall.com/...",
    "geometryTextureUrl": "https://cdn.8thwall.com/...",
    "created": 1613508074845,
    "updated": 1613683291310
  }]
}
```

### Get image target {#get-image-target}

#### Request {#get-request}

```bash
curl "https://api.8thwall.com/v1/targets/$TARGET_UUID" -H "X-Api-Key:$SECRET_KEY"
```

#### Response {#get-response}

JSON object of the [standard image target format](#post-response)

### Modify image target {#modify-image-target}

The following properties can be modified:

- `name`
- `loadAutomatically`
- `metadata`
- `metadataIsJson`

The same validation rules apply as the [initial upload](#create-image-target)

For cylinder and conical image targets, the following properties of the `geometry` object can also be modified:

- `cylinderCircumferenceTop`
- `targetCircumferenceTop`
- `inputMode`

The other geometry properties of the target will be updated to match.

#### Request {#patch-request}

```bash
curl -X PATCH "https://api.8thwall.com/v1/targets/$TARGET_UUID"\
    -H "X-Api-Key:$SECRET_KEY"\
    -H "Content-Type: application/json"\
    --data '{"name":"new-name", "geometry: {"inputMode": "BASIC"}, "metadata": "{}"}'
```

#### Response {#patch-response}

JSON object of the [standard image target format](#post-response)

### Delete image target {#delete-image-target}

#### Request {#delete-request}

```bash
curl -X DELETE "https://api.8thwall.com/v1/targets/$TARGET_UUID" -H "X-Api-Key:$SECRET_KEY"
```

#### Response {#delete-response}

A successful delete will return an empty response with status code `204: No Content`.

### Preview image target {#preview-image-target}

Generate a URL that users can use to preview the tracking for a target.

#### Request {#preview-request}

```bash
curl "https://api.8thwall.com/v1/targets/$TARGET_UUID/test" -H "X-Api-Key:$SECRET_KEY"
```

#### Response {#preview-response}

```json
{
  "url": "https://8w.8thwall.app/previewit/?j=...",
  "token": "...",
  "exp": 1612830293128
}
```

Property | Type | Description
:-- | :-- | :--
url | `String` | The URL that can be used to preview the target tracking
token | `String` | This token can currently only be used by our preview app.
exp | integer | The timestamp in milliseconds of when the token will expire. Tokens expire one hour after being issued.

Preview functionality is intended to be used in the context of a specific user managing or
configuring image targets. Do not publish preview URLs to a public site or share with a large number of users.

**Best practices for custom preview experiences:** The preview URL that is returned by the API is
the 8th Wall generic preview image target experience. If you would like to further customize the
frontend of your image target preview take the following steps:

1. Create a public 8th Wall project
1. Customize the UX of this project to your specifications
1. Upload image targets that users want to test to via API using the app key for the project you
created in step 1
1. Generate a testable image target URL for end-users using the public URL of the project in step 1
and a URL parameter with the name of the image target
1. In the project you created in step 1 use the URL parameter to set the active image target using
call [`XR8.XrController.configure({imageTargets: ['theTargetName']})`](./xrcontroller/configure.md).

## Error handling {#error-handling}

If the API rejects your request, the response will be `Content-Type: application/json`, and the
body will contain a `message` property containing an error string.

## Example {#example}

```json
{
  "message": "App not found: ..."
}
```

#### Status Codes {#status-codes}

Status | Reason
:-- | :--
400 | This can happen if you've specified an invalid value, or provided a parameter that does not exist.
403 | This can happen if you are not providing your secret key correctly.
404 | The app or image target could be deleted, or the app key or target UUID is incorrect. This is also the response code if the provided API key doesn't match the resource you're attempting to access.
413 | The uploaded image has been rejected for being too large a file.
429 | Your API Key has exceeded its associated [rate limit](#limits-and-quotas).
