---
sidebar_label: konfigurieren()
---

# LandingPage.configure()

`LandingPage.configure({ logoSrc, logoAlt, promptPrefix, url, promptSuffix, textColor, font, textShadow, backgroundSrc, backgroundBlur, backgroundColor, mediaSrc, mediaAlt, mediaAutoplay, mediaAnimation, mediaControls, sceneEnvMap, sceneOrbitIdle, sceneOrbitInteraction, sceneLightingIntensity, vrPromptPrefix })`

## Beschreibung {#description}

Konfiguriert das Verhalten und Aussehen des LandingPage-Moduls.

## Parameter (alle fakultativ) {#parameters-all-optional}

| Parameter              | Typ       | Standard                                                                      | Beschreibung                                                                                                                                                                                                                                            |
| ---------------------- | --------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| logoSrc                | `String`  |                                                                               | Bildquelle für das Markenlogo.                                                                                                                                                                                                          |
| logoAlt                | `String`  | ''Logo''                                                                      | Alt-Text für das Markenlogo-Bild.                                                                                                                                                                                                       |
| promptPrefix           | `String`  | Scannen oder besuchen".                                       | Legt die Textzeichenfolge für die Aufforderung zum Handeln fest, bevor die URL für das Erlebnis angezeigt wird.                                                                                                                         |
| url                    | `String`  | 8th.io Link, wenn 8th Wall gehostet wird, oder aktuelle Seite | Legt die angezeigte URL und den QR-Code fest.                                                                                                                                                                                           |
| promptSuffix           | `String`  | weiter                                                                        | Legt die Textzeichenfolge für die Aufforderung zum Handeln fest, nachdem die URL für das Erlebnis angezeigt wurde.                                                                                                                      |
| textColor              | Hex-Farbe | `'#ffffff'`                                                                   | Farbe des gesamten Textes auf der Landing Page.                                                                                                                                                                                         |
| Schriftart             | `String`  | Nunito", sans-serif"                                                          | Schriftart des gesamten Textes auf der Landing Page. Dieser Parameter akzeptiert gültige CSS font-family Argumente.                                                                                                     |
| textSchatten           | `Boolean` | false                                                                         | Legt die Eigenschaft text-shadow für alle Texte auf der Landing Page fest.                                                                                                                                                              |
| backgroundSrc          | `String`  |                                                                               | Bildquelle für das Hintergrundbild.                                                                                                                                                                                                     |
| backgroundBlur         | Nummer    | `0`                                                                           | Wendet einen Unschärfeeffekt auf den `backgroundSrc` an, wenn einer angegeben ist. (Normalerweise liegen die Werte zwischen 0,0 und 1,0)                                                                             |
| backgroundColor        | `String`  | `'linear-gradient(#464766,#2D2E43)'`                                          | Hintergrundfarbe der Landing Page. Dieser Parameter akzeptiert gültige CSS-Hintergrundfarbenargumente. Die Hintergrundfarbe wird nicht angezeigt, wenn ein background-src oder sceneEnvMap gesetzt ist. |
| mediaSrc               | `String`  | Das Titelbild der App, falls vorhanden                                        | Medienquelle (3D-Modell, Bild oder Video) für den Hauptinhalt der Landing Page. Zu den akzeptierten Medienquellen gehören a-asset-item id oder eine statische URL.                                   |
| mediaAlt               | `String`  | ''Vorschau''                                                                  | Alt-Text für den Bildinhalt der Landing Page.                                                                                                                                                                                           |
| mediaAutoplay          | `Boolean` | `true`                                                                        | Wenn die `mediaSrc` ein Video ist, wird angegeben, ob das Video beim Laden mit stummgeschaltetem Ton abgespielt werden soll.                                                                                                            |
| mediaAnimation         | `String`  | Erster Animationsclip des Modells, falls vorhanden                            | Handelt es sich bei "mediaSrc" um ein 3D-Modell, geben Sie an, ob ein bestimmter Animationsclip, der mit dem Modell verbunden ist, abgespielt werden soll, oder "none".                                                                 |
| mediaControls          | `String`  | 'minimal'                                                                     | Wenn `mediaSrc` ein Video ist, geben Sie die Mediensteuerung an, die dem Benutzer angezeigt wird. Wählen Sie zwischen "Keine", "Mininal" oder "Browser" (Browser-Standardeinstellungen)                              |
| sceneEnvMap            | `String`  | Feld                                                                          | Bildquelle, die auf ein gleichwinkliges Bild zeigt. Oder eine der folgenden voreingestellten Umgebungen: "Feld", "Hügel", "Stadt", "Pastell" oder "Raum".                                               |
| sceneOrbitIdle         | `String`  | Spin".                                                        | Handelt es sich bei "mediaSrc" um ein 3D-Modell, geben Sie an, ob sich das Modell "drehen" oder "keine" soll.                                                                                                                           |
| sceneOrbitInteraction  | `String`  | ''ziehen''                                                                    | Wenn es sich bei der Quelle um ein 3D-Modell handelt, geben Sie an, ob der Benutzer mit den Orbit-Steuerungen interagieren kann, wählen Sie "ziehen" oder "keine".                                                                      |
| sceneLightingIntensity | Nummer    | `1`                                                                           | Handelt es sich bei der "Medienquelle" um ein 3D-Modell, geben Sie die Stärke des Lichts an, das den Modus beleuchtet.                                                                                                                  |
| vrPromptPrefix         | `String`  | oder besuchen".                                               | Legt den Textstring für die Aufforderung zum Handeln fest, bevor die URL für das Erlebnis auf VR-Headsets angezeigt wird.                                                                                                               |

## Rückgabe {#returns}

Keine

## Beispiel - Code {#example---code}

```javascript
LandingPage.configure({
    mediaSrc: 'https://www.mydomain.com/bat.glb',
    sceneEnvMap: 'hill',
})
```
