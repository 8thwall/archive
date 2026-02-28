---
sidebar_label: configure()
---

# LandingPage.configure()

`LandingPage.configure({ logoSrc, logoAlt, promptPrefix, url, promptSuffix, textColor, font, textShadow, backgroundSrc, backgroundBlur, backgroundColor, mediaSrc, mediaAlt, mediaAutoplay, mediaAnimation, mediaControls, sceneEnvMap, sceneOrbitIdle, sceneOrbitInteraction, sceneLightingIntensity, vrPromptPrefix })`

## Beschreibung {#description}

Konfiguriert das Verhalten und Aussehen des LandingPage-Moduls.

## Parameter (alle optional) {#parameters-all-optional}

| Parameter              | Typ         | Standard                                                      | Beschreibung                                                                                                                                                                                                 |
| ---------------------- | ----------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| logoSrc                | `String`    |                                                               | Bildquelle für das Markenlogo-Bild.                                                                                                                                                                          |
| logoAlt                | `String`    | `'Logo'`                                                      | Alt-Text für das Markenlogo-Bild.                                                                                                                                                                            |
| promptPrefix           | `String`    | `'Scannen oder besuchen'`                                     | Legt den Textstring für den Aufruf zur Aktion fest, bevor die URL für das Erlebnis angezeigt wird.                                                                                                           |
| url                    | `String`    | 8th.io Link, wenn 8th Wall gehostet wird, oder aktuelle Seite | Legt die angezeigte URL und den QR-Code fest.                                                                                                                                                                |
| promptSuffix           | `String`    | `'fortfahren'`                                                | Legt den Textstring für den Aufruf zur Aktion fest, nachdem die URL für das Erlebnis angezeigt wurde.                                                                                                        |
| textColor              | Hex-Farbe   | `'#ffffff'`                                                   | Farbe des gesamten Textes auf der Landing Page.                                                                                                                                                              |
| Schriftart             | `String`    | `"'Nunito', sans-serif"`                                      | Schriftart des gesamten Textes auf der Landing Page. Dieser Parameter akzeptiert gültige CSS font-family Argumente.                                                                                          |
| textShadow             | `Boolesche` | `false`                                                       | Legt die Eigenschaft text-shadow für alle Texte auf der Landing Page fest.                                                                                                                                   |
| backgroundSrc          | `String`    |                                                               | Bildquelle für das Hintergrundbild.                                                                                                                                                                          |
| backgroundBlur         | `Nummer`    | `0`                                                           | Wendet einen Unschärfe-Effekt auf `backgroundSrc` an, wenn einer angegeben ist. (Normalerweise liegen die Werte zwischen 0.0 und 1.0)                                                                        |
| backgroundColor        | `String`    | `'linear-gradient(#464766,#2D2E43)'`                          | Hintergrundfarbe der Landing Page. Dieser Parameter akzeptiert gültige CSS-Hintergrundfarbenargumente. Die Hintergrundfarbe wird nicht angezeigt, wenn eine background-src oder sceneEnvMap eingestellt ist. |
| mediaSrc               | `String`    | Das Titelbild der App, falls vorhanden                        | Medienquelle (3D-Modell, Bild oder Video) für den Held-Inhalt der Landing Page. Akzeptierte Medienquellen sind a-asset-item id oder eine statische URL.                                                      |
| mediaAlt               | `String`    | `Vorschau`                                                    | Alt-Text für Landing Page Bildinhalte.                                                                                                                                                                       |
| mediaAutoplay          | `Boolesche` | `wahr`                                                        | Wenn die `mediaSrc` ein Video ist, gibt sie an, ob das Video beim Laden mit stummgeschaltetem Ton abgespielt werden soll.                                                                                    |
| mediaAnimation         | `String`    | Erster Animationsclip des Modells, falls vorhanden            | Wenn es sich bei `mediaSrc` um ein 3D-Modell handelt, geben Sie an, ob ein bestimmter Animationsclip, der mit dem Modell verknüpft ist, abgespielt werden soll, oder "keiner".                               |
| mediaControls          | `String`    | `'minimal'`                                                   | Wenn `mediaSrc` ein Video ist, geben Sie die Mediensteuerung an, die dem Benutzer angezeigt wird. Wählen Sie aus "keine", "minimal" oder "Browser" (Browser-Standardeinstellungen)                           |
| sceneEnvMap            | `String`    | `'Feld'`                                                      | Bildquelle, die auf ein gleichwinkliges Bild zeigt. Oder eine der folgenden voreingestellten Umgebungen: "Feld", "Hügel", "Stadt", "Pastell", oder "Weltraum".                                               |
| sceneOrbitIdle         | `String`    | `'Spin'`                                                      | Wenn es sich bei `mediaSrc` um ein 3D-Modell handelt, geben Sie an, ob sich das Modell "drehen" soll oder "nicht".                                                                                           |
| sceneOrbitInteraction  | `String`    | `'ziehen'`                                                    | Wenn die `mediaSrc` ein 3D-Modell ist, geben Sie an, ob der Benutzer mit den Orbit-Steuerelementen interagieren kann, wählen Sie "ziehen" oder "keine".                                                      |
| sceneLightingIntensity | `Nummer`    | `1`                                                           | Wenn die `mediaSrc` ein 3D-Modell ist, geben Sie die Stärke des Lichts an, das den Modus beleuchtet.                                                                                                         |
| vrPromptPrefix         | `String`    | `'oder besuchen'`                                             | Legt den Textstring für den Aufruf zur Aktion fest, bevor die URL für das Erlebnis auf VR-Headsets angezeigt wird.                                                                                           |

## Returns {#returns}

Keine

## Beispiel - Code {#example---code}

```javascript
LandingPage.configure({
    mediaSrc: 'https://www.mydomain.com/bat.glb',
    sceneEnvMap: 'hill',
})
```
