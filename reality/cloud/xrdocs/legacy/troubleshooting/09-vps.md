---
id: vps-troubleshooting
---
# Lightship VPS

## Location permissions denied {#location-permissions-denied}

#### Issue {#issue}

When launching an experience that uses the Lightship Maps Module or Lightship VPS, you might encounter an alert reading `“LOCATION PERMISSION DENIED. PLEASE ALLOW AND TRY AGAIN.”`

#### Resolution {#resolution}

Enable location permissions on both the browser level and on the system level.

**Browser Level (iOS)**

Please ensure that Location is set to "Ask" or "Allow" in `Settings > Safari > Location`.

**System Level (iOS)**

Please ensure that Location Services are enabled in `Settings > Privacy & Security > Location Services > Safari`

https://support.apple.com/en-us/HT207092

## Signing into Wayfarer with 8th Wall using Google {#signing-into-wayfarer-with-8th-wall-using-google}

#### Issue {#issue}

If you try to sign in to Wayfarer with 8th Wall using Google authentication, the app freezes on a white screen.

#### Resolution {#resolution}

The Wayfarer app doesn't support Google authentication at this time. If you have an active 8th Wall account, you can go to https://www.8thwall.com/profile to connect an email/password combination and then use that to login to Wayfarer instead.

## Test Scan not showing up in the Geospatial Browser {#test-scan-not-showing-up-in-the-geospatial-browser}

#### Issue {#issue}

You take a Test Scan in the Wayfarer app but it never appears in the 8th Wall Geospatial Browser.

#### Resolution {#resolution}

It's likely the wrong 8th Wall workspace is selected from the profile page in the Wayfarer app. Please select the correct 8th Wall workspace and re-scan the location.

## Activation or Test Scan stuck in processing {#activation-or-test-scan-stuck-in-processing}

#### Resolution {#resolution}

Please contact support@lightship.dev and include details on the VPS Location or Test Scan.

## Failed activation {#failed-activation}

#### Resolution {#resolution}

Please contact support@lightship.dev and include details on the VPS Location.
